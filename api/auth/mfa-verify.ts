import { NextApiRequest, NextApiResponse } from 'next'
import { AuthValidator } from '@/lib/security/auth-validator'
import { SecurityValidator } from '@/lib/security/cpp-bridge'
import crypto from 'crypto'
import speakeasy from 'speakeasy'

interface MFARequest {
  mfaToken: string
  code: string
  method: 'totp' | 'sms' | 'email' | 'backup'
  deviceTrust?: boolean
}

interface MFAResponse {
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
  backupCodes?: string[]
}

const authValidator = new AuthValidator({
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiry: '1h',
  bcryptRounds: 12,
  maxLoginAttempts: 3,
  lockoutDuration: 5 * 60 * 1000,
  sessionTimeout: 24 * 60 * 60 * 1000,
  csrfSecret: process.env.CSRF_SECRET!,
  encryptionKey: process.env.ENCRYPTION_KEY!
})

const securityValidator = new SecurityValidator()

export default async function handler(req: NextApiRequest, res: NextApiResponse<MFAResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const clientIP = getClientIP(req)
  const userAgent = req.headers['user-agent'] || ''
  const startTime = Date.now()

  try {
    const { mfaToken, code, method, deviceTrust }: MFARequest = req.body

    if (!mfaToken || !code || !method) {
      return res.status(400).json({ success: false, error: 'MFA token, code and method required' })
    }

    const sanitizedCode = authValidator.sanitizeInput(code)
    
    if (!authValidator.checkRateLimit(`mfa_${clientIP}`)) {
      authValidator.auditLog('MFA_RATE_LIMITED', 'unknown', { ip: clientIP })
      return res.status(429).json({ success: false, error: 'Too many MFA attempts' })
    }

    const mfaSession = await getMFASession(mfaToken)
    if (!mfaSession || mfaSession.expiresAt < Date.now()) {
      authValidator.recordFailedAttempt(`mfa_${clientIP}`)
      authValidator.auditLog('MFA_INVALID_TOKEN', 'unknown', { ip: clientIP })
      return res.status(401).json({ success: false, error: 'Invalid or expired MFA token' })
    }

    const user = await getUserById(mfaSession.userId)
    if (!user) {
      authValidator.recordFailedAttempt(`mfa_${clientIP}`)
      authValidator.auditLog('MFA_USER_NOT_FOUND', mfaSession.userId, { ip: clientIP })
      return res.status(401).json({ success: false, error: 'User not found' })
    }

    let isValidCode = false
    let usedBackupCode = false

    switch (method) {
      case 'totp':
        isValidCode = await verifyTOTPCode(user.id, sanitizedCode)
        break
      case 'sms':
        isValidCode = await verifySMSCode(user.id, sanitizedCode)
        break
      case 'email':
        isValidCode = await verifyEmailCode(user.id, sanitizedCode)
        break
      case 'backup':
        const backupResult = await verifyBackupCode(user.id, sanitizedCode)
        isValidCode = backupResult.valid
        usedBackupCode = backupResult.used
        break
      default:
        return res.status(400).json({ success: false, error: 'Invalid MFA method' })
    }

    if (!isValidCode) {
      await incrementMFAFailures(user.id)
      authValidator.recordFailedAttempt(`mfa_${clientIP}`)
      authValidator.auditLog('MFA_FAILED', user.id, { 
        ip: clientIP, 
        method,
        code: sanitizedCode.substring(0, 2) + '****'
      })
      return res.status(401).json({ success: false, error: 'Invalid MFA code' })
    }

    if (deviceTrust) {
      await addTrustedDevice(user.id, clientIP, userAgent)
    }

    const sessionId = authValidator.createSession(user.id, clientIP, userAgent, user.permissions)
    const tokens = authValidator.generateTokens(user.id, user.permissions)

    await clearMFASession(mfaToken)
    await clearMFAFailures(user.id)
    authValidator.clearFailedAttempts(`mfa_${clientIP}`)

    await updateLastLogin(user.id, clientIP, userAgent)

    const response: MFAResponse = {
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
    }

    if (usedBackupCode) {
      const remainingCodes = await getRemainingBackupCodes(user.id)
      if (remainingCodes.length <= 2) {
        response.backupCodes = await generateNewBackupCodes(user.id)
        await sendBackupCodesEmail(user.email, response.backupCodes)
      }
    }

    authValidator.auditLog('MFA_SUCCESS', user.id, { 
      ip: clientIP, 
      userAgent,
      method,
      sessionId,
      duration: Date.now() - startTime
    })

    res.status(200).json(response)

  } catch (error) {
    authValidator.auditLog('MFA_ERROR', 'system', { 
      ip: clientIP, 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    })
  }
}

async function getMFASession(token: string) {
  return {
    userId: 'user123',
    expiresAt: Date.now() + 5 * 60 * 1000,
    attempts: 0
  }
}

async function getUserById(userId: string) {
  return {
    id: userId,
    username: 'testuser',
    email: 'user@example.com',
    role: 'user',
    permissions: ['read', 'write'],
    totpSecret: 'JBSWY3DPEHPK3PXP',
    backupCodes: ['123456', '789012']
  }
}

async function verifyTOTPCode(userId: string, code: string): Promise<boolean> {
  const user = await getUserById(userId)
  if (!user?.totpSecret) return false

  return speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token: code,
    window: 2
  })
}

async function verifySMSCode(userId: string, code: string): Promise<boolean> {
  const storedCode = await getSMSCode(userId)
  return storedCode === code && await isSMSCodeValid(userId)
}

async function verifyEmailCode(userId: string, code: string): Promise<boolean> {
  const storedCode = await getEmailCode(userId)
  return storedCode === code && await isEmailCodeValid(userId)
}

async function verifyBackupCode(userId: string, code: string): Promise<{ valid: boolean; used: boolean }> {
  const user = await getUserById(userId)
  if (!user?.backupCodes) return { valid: false, used: false }

  const codeIndex = user.backupCodes.indexOf(code)
  if (codeIndex === -1) return { valid: false, used: false }

  await removeBackupCode(userId, code)
  return { valid: true, used: true }
}

async function getSMSCode(userId: string): Promise<string> {
  return '123456'
}

async function isSMSCodeValid(userId: string): Promise<boolean> {
  return true
}

async function getEmailCode(userId: string): Promise<string> {
  return '789012'
}

async function isEmailCodeValid(userId: string): Promise<boolean> {
  return true
}

async function removeBackupCode(userId: string, code: string) {
  console.log(`Removing backup code for user ${userId}`)
}

async function getRemainingBackupCodes(userId: string): Promise<string[]> {
  return ['111111', '222222']
}

async function generateNewBackupCodes(userId: string): Promise<string[]> {
  const codes = []
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(3).toString('hex').toUpperCase())
  }
  await saveBackupCodes(userId, codes)
  return codes
}

async function saveBackupCodes(userId: string, codes: string[]) {
  console.log(`Saving backup codes for user ${userId}`)
}

async function sendBackupCodesEmail(email: string, codes: string[]) {
  console.log(`Sending backup codes to ${email}`)
}

async function addTrustedDevice(userId: string, ip: string, userAgent: string) {
  console.log(`Adding trusted device for user ${userId}`)
}

async function clearMFASession(token: string) {
  console.log(`Clearing MFA session ${token}`)
}

async function incrementMFAFailures(userId: string) {
  console.log(`Incrementing MFA failures for user ${userId}`)
}

async function clearMFAFailures(userId: string) {
  console.log(`Clearing MFA failures for user ${userId}`)
}

async function updateLastLogin(userId: string, ip: string, userAgent: string) {
  console.log(`Updating last login for user ${userId}`)
}

function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    return (forwarded as string).split(',')[0].trim()
  }
  return req.connection.remoteAddress || '127.0.0.1'
}
