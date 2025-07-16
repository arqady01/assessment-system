import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// 密码验证
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// 生成JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// 验证JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

// 用户注册
export async function registerUser(email: string, password: string, name?: string, profession?: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error('用户已存在')
  }

  const hashedPassword = await hashPassword(password)
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      profession
    }
  })

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  })

  return { user: { ...user, password: undefined }, token }
}

// 用户登录
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw new Error('用户不存在')
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    throw new Error('密码错误')
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  })

  return { user: { ...user, password: undefined }, token }
}

// 获取当前用户
export async function getCurrentUser(token: string) {
  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      profession: true,
      avatar: true,
      createdAt: true
    }
  })

  return user
}
