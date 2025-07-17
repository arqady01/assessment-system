import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'

export interface SecurityConfig {
  jwtSecret: string
  jwtExpiry: string
  bcryptRounds: number
  maxLoginAttempts: number
  lockoutDuration: number
  sessionTimeout: number
  csrfSecret: string
  encryptionKey: string
}

export interface UserCredentials {
  username: string
  password: string
  email?: string
  role?: string
  permissions?: string[]
}

export interface AuthToken {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

export interface SecurityContext {
  userId: string
  sessionId: string
  ipAddress: string
  userAgent: string
  permissions: string[]
  lastActivity: number
}

export class AuthValidator {
  private config: SecurityConfig
  private failedAttempts: Map<string, { count: number; lockUntil: number }> = new Map()
  private activeSessions: Map<string, SecurityContext> = new Map()
  private blacklistedTokens: Set<string> = new Set()

  constructor(config: SecurityConfig) {
    this.config = config
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.config.bcryptRounds)
    return bcrypt.hash(password, salt)
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  generateTokens(userId: string, permissions: string[]): AuthToken {
    const payload = {
      userId,
      permissions,
      type: 'access',
      iat: Math.floor(Date.now() / 1000)
    }

    const refreshPayload = {
      userId,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000)
    }

    const accessToken = jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.jwtExpiry,
      issuer: 'assessment-system',
      audience: 'assessment-client'
    })

    const refreshToken = jwt.sign(refreshPayload, this.config.jwtSecret, {
      expiresIn: '7d',
      issuer: 'assessment-system',
      audience: 'assessment-client'
    })

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
      tokenType: 'Bearer'
    }
  }

  verifyToken(token: string): any {
    if (this.blacklistedTokens.has(token)) {
      throw new Error('Token has been revoked')
    }

    try {
      return jwt.verify(token, this.config.jwtSecret, {
        issuer: 'assessment-system',
        audience: 'assessment-client'
      })
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  revokeToken(token: string): void {
    this.blacklistedTokens.add(token)
  }

  checkRateLimit(identifier: string): boolean {
    const attempts = this.failedAttempts.get(identifier)
    
    if (!attempts) return true
    
    if (attempts.lockUntil > Date.now()) {
      return false
    }
    
    if (attempts.lockUntil <= Date.now()) {
      this.failedAttempts.delete(identifier)
      return true
    }
    
    return attempts.count < this.config.maxLoginAttempts
  }

  recordFailedAttempt(identifier: string): void {
    const attempts = this.failedAttempts.get(identifier) || { count: 0, lockUntil: 0 }
    attempts.count++
    
    if (attempts.count >= this.config.maxLoginAttempts) {
      attempts.lockUntil = Date.now() + this.config.lockoutDuration
    }
    
    this.failedAttempts.set(identifier, attempts)
  }

  clearFailedAttempts(identifier: string): void {
    this.failedAttempts.delete(identifier)
  }

  createSession(userId: string, ipAddress: string, userAgent: string, permissions: string[]): string {
    const sessionId = crypto.randomBytes(32).toString('hex')
    
    const context: SecurityContext = {
      userId,
      sessionId,
      ipAddress,
      userAgent,
      permissions,
      lastActivity: Date.now()
    }
    
    this.activeSessions.set(sessionId, context)
    return sessionId
  }

  validateSession(sessionId: string, ipAddress: string, userAgent: string): SecurityContext | null {
    const session = this.activeSessions.get(sessionId)
    
    if (!session) return null
    
    if (session.ipAddress !== ipAddress || session.userAgent !== userAgent) {
      this.activeSessions.delete(sessionId)
      return null
    }
    
    if (Date.now() - session.lastActivity > this.config.sessionTimeout) {
      this.activeSessions.delete(sessionId)
      return null
    }
    
    session.lastActivity = Date.now()
    this.activeSessions.set(sessionId, session)
    
    return session
  }

  destroySession(sessionId: string): void {
    this.activeSessions.delete(sessionId)
  }

  encrypt(data: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher('aes-256-cbc', this.config.encryptionKey)
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return iv.toString('hex') + ':' + encrypted
  }

  decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':')
    const iv = Buffer.from(parts[0], 'hex')
    const encrypted = parts[1]
    const decipher = crypto.createDecipher('aes-256-cbc', this.config.encryptionKey)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }

  generateCSRFToken(): string {
    return crypto.createHmac('sha256', this.config.csrfSecret)
      .update(crypto.randomBytes(32))
      .digest('hex')
  }

  validateCSRFToken(token: string, sessionToken: string): boolean {
    const expected = crypto.createHmac('sha256', this.config.csrfSecret)
      .update(sessionToken)
      .digest('hex')
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim()
  }

  validatePermission(userPermissions: string[], requiredPermission: string): boolean {
    return userPermissions.includes(requiredPermission) || userPermissions.includes('admin')
  }

  generateSecureId(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  hashSensitiveData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  createSecurityHeaders() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"]
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    })
  }

  createRateLimit() {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests',
      standardHeaders: true,
      legacyHeaders: false
    })
  }

  validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (password.length < 8) errors.push('Password must be at least 8 characters')
    if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter')
    if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter')
    if (!/\d/.test(password)) errors.push('Password must contain number')
    if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain special character')
    
    return { valid: errors.length === 0, errors }
  }

  auditLog(action: string, userId: string, details: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details: JSON.stringify(details),
      hash: this.hashSensitiveData(`${action}${userId}${Date.now()}`)
    }
    
    console.log('AUDIT:', logEntry)
  }
}
