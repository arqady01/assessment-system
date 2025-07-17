import { NextApiRequest, NextApiResponse } from 'next'
import { AuthValidator } from '@/lib/security/auth-validator'
import { SecurityValidator } from '@/lib/security/cpp-bridge'
import { SecurityMiddleware } from '@/lib/security/middleware'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

interface LoginRequest {
  username: string
  password: string
  captcha?: string
  deviceFingerprint?: string
  rememberMe?: boolean
}

interface LoginResponse {
  success: boolean
  tokens?: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
  user?: {
    id: string
    username: string
    role: string
    permissions: string[]
  }
  error?: string
  requiresMFA?: boolean
  mfaToken?: string
}

const authValidator = new AuthValidator({
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiry: '1h',
  bcryptRounds: 12,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000,
  sessionTimeout: 24 * 60 * 60 * 1000,
  csrfSecret: process.env.CSRF_SECRET!,
  encryptionKey: process.env.ENCRYPTION_KEY!
})

const securityValidator = new SecurityValidator()

export default async function handler(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const clientIP = getClientIP(req)
  const userAgent = req.headers['user-agent'] || ''
  const startTime = Date.now()

  try {
    const { username, password, captcha, deviceFingerprint, rememberMe }: LoginRequest = req.body

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' })
    }

    const sanitizedUsername = authValidator.sanitizeInput(username)
    
    if (!authValidator.checkRateLimit(clientIP)) {
      authValidator.auditLog('LOGIN_RATE_LIMITED', sanitizedUsername, { ip: clientIP })
      return res.status(429).json({ success: false, error: 'Too many login attempts' })
    }

    if (!authValidator.checkRateLimit(sanitizedUsername)) {
      authValidator.auditLog('USER_RATE_LIMITED', sanitizedUsername, { ip: clientIP })
      return res.status(429).json({ success: false, error: 'Account temporarily locked' })
    }

    const inputValid = await securityValidator.validateUserInput(sanitizedUsername, 'sql')
    if (!inputValid) {
      authValidator.recordFailedAttempt(clientIP)
      authValidator.auditLog('MALICIOUS_LOGIN_ATTEMPT', sanitizedUsername, { 
        ip: clientIP, 
        userAgent,
        threat: 'SQL injection in username'
      })
      return res.status(400).json({ success: false, error: 'Invalid input detected' })
    }

    const user = await getUserFromDatabase(sanitizedUsername)
    if (!user) {
      authValidator.recordFailedAttempt(clientIP)
      authValidator.recordFailedAttempt(sanitizedUsername)
      authValidator.auditLog('LOGIN_FAILED', sanitizedUsername, { 
        ip: clientIP, 
        reason: 'User not found'
      })
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    if (user.isLocked && user.lockUntil > Date.now()) {
      authValidator.auditLog('LOGIN_BLOCKED', user.id, { 
        ip: clientIP, 
        reason: 'Account locked'
      })
      return res.status(423).json({ success: false, error: 'Account locked' })
    }

    const passwordValid = await authValidator.verifyPassword(password, user.passwordHash)
    if (!passwordValid) {
      await updateFailedLoginAttempts(user.id)
      authValidator.recordFailedAttempt(clientIP)
      authValidator.recordFailedAttempt(sanitizedUsername)
      authValidator.auditLog('LOGIN_FAILED', user.id, { 
        ip: clientIP, 
        reason: 'Invalid password'
      })
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    if (user.requiresMFA) {
      const mfaToken = generateMFAToken(user.id)
      await storeMFAToken(user.id, mfaToken)
      
      authValidator.auditLog('MFA_REQUIRED', user.id, { ip: clientIP })
      return res.status(200).json({ 
        success: false, 
        requiresMFA: true, 
        mfaToken 
      })
    }

    if (deviceFingerprint) {
      const knownDevice = await checkDeviceFingerprint(user.id, deviceFingerprint)
      if (!knownDevice) {
        await sendSecurityAlert(user.email, clientIP, userAgent)
        await saveDeviceFingerprint(user.id, deviceFingerprint, clientIP, userAgent)
      }
    }

    const sessionId = authValidator.createSession(user.id, clientIP, userAgent, user.permissions)
    const tokens = authValidator.generateTokens(user.id, user.permissions)

    await clearFailedLoginAttempts(user.id)
    authValidator.clearFailedAttempts(clientIP)
    authValidator.clearFailedAttempts(sanitizedUsername)

    await updateLastLogin(user.id, clientIP, userAgent)

    if (rememberMe) {
      res.setHeader('Set-Cookie', [
        `refreshToken=${tokens.refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
        `sessionId=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
      ])
    }

    authValidator.auditLog('LOGIN_SUCCESS', user.id, { 
      ip: clientIP, 
      userAgent,
      sessionId,
      duration: Date.now() - startTime
    })

    res.status(200).json({
      success: true,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      },
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions
      }
    })

  } catch (error) {
    authValidator.auditLog('LOGIN_ERROR', 'system', { 
      ip: clientIP, 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    })
  }
}

async function getUserFromDatabase(username: string) {
  return {
    id: 'user123',
    username,
    passwordHash: '$2a$12$example',
    email: 'user@example.com',
    role: 'user',
    permissions: ['read', 'write'],
    isLocked: false,
    lockUntil: 0,
    requiresMFA: false,
    failedLoginAttempts: 0
  }
}

async function updateFailedLoginAttempts(userId: string) {
  console.log(`Updating failed login attempts for user ${userId}`)
}

async function clearFailedLoginAttempts(userId: string) {
  console.log(`Clearing failed login attempts for user ${userId}`)
}

async function updateLastLogin(userId: string, ip: string, userAgent: string) {
  console.log(`Updating last login for user ${userId} from ${ip}`)
}

function generateMFAToken(userId: string): string {
  return crypto.createHmac('sha256', process.env.MFA_SECRET!)
    .update(`${userId}${Date.now()}`)
    .digest('hex')
}

async function storeMFAToken(userId: string, token: string) {
  console.log(`Storing MFA token for user ${userId}`)
}

async function checkDeviceFingerprint(userId: string, fingerprint: string): Promise<boolean> {
  return false
}

async function saveDeviceFingerprint(userId: string, fingerprint: string, ip: string, userAgent: string) {
  console.log(`Saving device fingerprint for user ${userId}`)
}

async function sendSecurityAlert(email: string, ip: string, userAgent: string) {
  console.log(`Sending security alert to ${email} for login from ${ip}`)
}

function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    return (forwarded as string).split(',')[0].trim()
  }
  return req.connection.remoteAddress || '127.0.0.1'
}
