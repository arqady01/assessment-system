import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 获取系统状态
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

    // 获取系统统计信息
    const [
      totalUsers,
      totalQuestions,
      totalCategories,
      totalExams,
      recentUsers,
      recentExams
    ] = await Promise.all([
      prisma.user.count(),
      prisma.question.count(),
      prisma.category.count(),
      prisma.examResult.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 最近24小时
          }
        }
      }),
      prisma.examResult.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 最近24小时
          }
        }
      })
    ])

    // 计算系统健康状态
    const systemHealth = {
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      platform: process.platform
    }

    // 数据库连接状态
    let dbStatus = 'connected'
    try {
      await prisma.$queryRaw`SELECT 1`
    } catch (error) {
      dbStatus = 'disconnected'
      systemHealth.status = 'warning'
    }

    const status = {
      system: systemHealth,
      database: {
        status: dbStatus,
        totalRecords: totalUsers + totalQuestions + totalCategories + totalExams
      },
      statistics: {
        totalUsers,
        totalQuestions,
        totalCategories,
        totalExams,
        recentUsers,
        recentExams
      },
      performance: {
        responseTime: Date.now() - request.headers.get('x-request-start') || 0,
        activeConnections: 1 // 简化示例
      }
    }

    return NextResponse.json({ status })
  } catch (error) {
    console.error('Get system status error:', error)
    return NextResponse.json(
      { error: '获取系统状态失败' },
      { status: 500 }
    )
  }
}
