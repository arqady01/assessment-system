import { Request, Response, NextFunction } from 'express'
import { AuthValidator } from './auth-validator'
import { CppSecurityBridge, SecurityValidator } from './cpp-bridge'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

export interface SecurityRequest extends Request {
  user?: {
    id: string
    permissions: string[]
    sessionId: string
  }
  securityContext?: {
    validated: boolean
    threats: string[]
    riskLevel: 'low' | 'medium' | 'high'
  }
}

export class SecurityMiddleware {
  private authValidator: AuthValidator
  private securityValidator: SecurityValidator
  private trustedProxies: Set<string> = new Set()

  constructor(config: any) {
    this.authValidator = new AuthValidator(config.auth)
    this.securityValidator = new SecurityValidator(config.cppExecutable)
    this.trustedProxies = new Set(config.trustedProxies || [])
  }

  authenticate() {
    return async (req: SecurityRequest, res: Response, next: NextFunction) => {
      try {
        const token = this.extractToken(req)
        if (!token) {
          return res.status(401).json({ error: 'No token provided' })
        }

        const decoded = this.authValidator.verifyToken(token)
        const session = this.authValidator.validateSession(
          decoded.sessionId,
          this.getClientIP(req),
          req.get('User-Agent') || ''
        )

        if (!session) {
          return res.status(401).json({ error: 'Invalid session' })
        }

        req.user = {
          id: decoded.userId,
          permissions: decoded.permissions,
          sessionId: decoded.sessionId
        }

        next()
      } catch (error) {
        res.status(401).json({ error: 'Authentication failed' })
      }
    }
  }

  authorize(requiredPermission: string) {
    return (req: SecurityRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      if (!this.authValidator.validatePermission(req.user.permissions, requiredPermission)) {
        return res.status(403).json({ error: 'Insufficient permissions' })
      }

      next()
    }
  }

  validateInput() {
    return async (req: SecurityRequest, res: Response, next: NextFunction) => {
      try {
        const threats: string[] = []
        let riskLevel: 'low' | 'medium' | 'high' = 'low'

        for (const [key, value] of Object.entries(req.body || {})) {
          if (typeof value === 'string') {
            const sqlValid = await this.securityValidator.validateUserInput(value, 'sql')
            const xssValid = await this.securityValidator.validateUserInput(value, 'xss')
            const cmdValid = await this.securityValidator.validateUserInput(value, 'command')

            if (!sqlValid) {
              threats.push(`SQL injection attempt in ${key}`)
              riskLevel = 'high'
            }
            if (!xssValid) {
              threats.push(`XSS attempt in ${key}`)
              riskLevel = riskLevel === 'high' ? 'high' : 'medium'
            }
            if (!cmdValid) {
              threats.push(`Command injection attempt in ${key}`)
              riskLevel = 'high'
            }
          }
        }

        for (const [key, value] of Object.entries(req.query || {})) {
          if (typeof value === 'string') {
            const pathValid = await this.securityValidator.validateUserInput(value, 'path')
            if (!pathValid) {
              threats.push(`Path traversal attempt in query ${key}`)
              riskLevel = riskLevel === 'high' ? 'high' : 'medium'
            }
          }
        }

        if (threats.length > 0 && riskLevel === 'high') {
          this.authValidator.auditLog('SECURITY_THREAT', req.user?.id || 'anonymous', {
            threats,
            ip: this.getClientIP(req),
            userAgent: req.get('User-Agent'),
            path: req.path,
            method: req.method
          })
          return res.status(400).json({ error: 'Security validation failed' })
        }

        req.securityContext = {
          validated: true,
          threats,
          riskLevel
        }

        next()
      } catch (error) {
        res.status(500).json({ error: 'Security validation error' })
      }
    }
  }

  csrfProtection() {
    return (req: SecurityRequest, res: Response, next: NextFunction) => {
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        const token = req.get('X-CSRF-Token') || req.body._csrf
        const sessionToken = req.user?.sessionId

        if (!token || !sessionToken) {
          return res.status(403).json({ error: 'CSRF token required' })
        }

        if (!this.authValidator.validateCSRFToken(token, sessionToken)) {
          return res.status(403).json({ error: 'Invalid CSRF token' })
        }
      }

      next()
    }
  }

  rateLimiting() {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: (req: SecurityRequest) => {
        if (req.user?.permissions.includes('admin')) return 1000
        if (req.user?.permissions.includes('premium')) return 500
        return 100
      },
      message: 'Too many requests',
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: SecurityRequest, res: Response) => {
        this.authValidator.auditLog('RATE_LIMIT_EXCEEDED', req.user?.id || 'anonymous', {
          ip: this.getClientIP(req),
          userAgent: req.get('User-Agent')
        })
        res.status(429).json({ error: 'Rate limit exceeded' })
      }
    })
  }

  slowDown() {
    return slowDown({
      windowMs: 15 * 60 * 1000,
      delayAfter: 50,
      delayMs: 500,
      maxDelayMs: 20000
    })
  }

  ipWhitelist(whitelist: string[]) {
    const allowedIPs = new Set(whitelist)
    
    return (req: SecurityRequest, res: Response, next: NextFunction) => {
      const clientIP = this.getClientIP(req)
      
      if (!allowedIPs.has(clientIP)) {
        this.authValidator.auditLog('IP_BLOCKED', req.user?.id || 'anonymous', {
          ip: clientIP,
          userAgent: req.get('User-Agent')
        })
        return res.status(403).json({ error: 'IP not allowed' })
      }
      
      next()
    }
  }

  geoBlocking(blockedCountries: string[]) {
    return async (req: SecurityRequest, res: Response, next: NextFunction) => {
      try {
        const clientIP = this.getClientIP(req)
        const country = await this.getCountryFromIP(clientIP)
        
        if (blockedCountries.includes(country)) {
          this.authValidator.auditLog('GEO_BLOCKED', req.user?.id || 'anonymous', {
            ip: clientIP,
            country,
            userAgent: req.get('User-Agent')
          })
          return res.status(403).json({ error: 'Access denied from your location' })
        }
        
        next()
      } catch (error) {
        next()
      }
    }
  }

  sessionSecurity() {
    return (req: SecurityRequest, res: Response, next: NextFunction) => {
      if (req.user) {
        const sessionAge = Date.now() - (req.user as any).sessionStart
        const maxAge = 24 * 60 * 60 * 1000

        if (sessionAge > maxAge) {
          this.authValidator.destroySession(req.user.sessionId)
          return res.status(401).json({ error: 'Session expired' })
        }

        const userAgent = req.get('User-Agent')
        const storedAgent = (req.user as any).userAgent

        if (userAgent !== storedAgent) {
          this.authValidator.auditLog('SESSION_HIJACK_ATTEMPT', req.user.id, {
            currentAgent: userAgent,
            storedAgent,
            ip: this.getClientIP(req)
          })
          return res.status(401).json({ error: 'Session security violation' })
        }
      }

      next()
    }
  }

  contentSecurityPolicy() {
    return (req: SecurityRequest, res: Response, next: NextFunction) => {
      res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self'; " +
        "font-src 'self'; " +
        "object-src 'none'; " +
        "media-src 'self'; " +
        "frame-src 'none'"
      )
      
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('X-Frame-Options', 'DENY')
      res.setHeader('X-XSS-Protection', '1; mode=block')
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
      
      next()
    }
  }

  auditLogging() {
    return (req: SecurityRequest, res: Response, next: NextFunction) => {
      const startTime = Date.now()
      
      res.on('finish', () => {
        const duration = Date.now() - startTime
        
        this.authValidator.auditLog('REQUEST', req.user?.id || 'anonymous', {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration,
          ip: this.getClientIP(req),
          userAgent: req.get('User-Agent'),
          threats: req.securityContext?.threats || [],
          riskLevel: req.securityContext?.riskLevel || 'low'
        })
      })
      
      next()
    }
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    
    return req.cookies?.token || null
  }

  private getClientIP(req: Request): string {
    const forwarded = req.get('X-Forwarded-For')
    if (forwarded) {
      const ips = forwarded.split(',').map(ip => ip.trim())
      for (const ip of ips) {
        if (!this.trustedProxies.has(ip)) {
          return ip
        }
      }
    }
    
    return req.get('X-Real-IP') || req.connection.remoteAddress || '127.0.0.1'
  }

  private async getCountryFromIP(ip: string): Promise<string> {
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}`)
      const data = await response.json()
      return data.countryCode || 'UNKNOWN'
    } catch {
      return 'UNKNOWN'
    }
  }

  destroy(): void {
    this.securityValidator.destroy()
  }
}
