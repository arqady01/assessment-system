import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execAsync = promisify(exec)

// 创建数据库备份
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const user = await getCurrentUser(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupDir = path.join(process.cwd(), 'backups')
    const backupFile = path.join(backupDir, `backup-${timestamp}.db`)

    // 确保备份目录存在
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // 复制数据库文件（SQLite）
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupFile)
      
      return NextResponse.json({ 
        message: '备份创建成功',
        backupFile: `backup-${timestamp}.db`,
        size: fs.statSync(backupFile).size
      })
    } else {
      return NextResponse.json(
        { error: '数据库文件不存在' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Create backup error:', error)
    return NextResponse.json(
      { error: '创建备份失败' },
      { status: 500 }
    )
  }
}

// 获取备份列表
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const user = await getCurrentUser(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const backupDir = path.join(process.cwd(), 'backups')
    
    if (!fs.existsSync(backupDir)) {
      return NextResponse.json({ backups: [] })
    }

    const files = fs.readdirSync(backupDir)
    const backups = files
      .filter(file => file.endsWith('.db'))
      .map(file => {
        const filePath = path.join(backupDir, file)
        const stats = fs.statSync(filePath)
        return {
          name: file,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        }
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return NextResponse.json({ backups })
  } catch (error) {
    console.error('Get backups error:', error)
    return NextResponse.json(
      { error: '获取备份列表失败' },
      { status: 500 }
    )
  }
}
