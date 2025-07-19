import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 获取系统统计数据 (管理员)
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

    // 获取统计数据
    const [
      totalUsers,
      totalQuestions,
      totalExams,
      totalCategories,
      recentUsers,
      recentExams
    ] = await Promise.all([
      prisma.user.count(),
      prisma.question.count(),
      prisma.examResult.count(),
      prisma.category.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      }),
      prisma.examResult.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          question: {
            select: {
              title: true
            }
          }
        }
      })
    ])

    // 计算本月新增用户
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)

    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: thisMonth
        }
      }
    })

    // 计算上月用户数
    const lastMonth = new Date(thisMonth)
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const lastMonthUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastMonth,
          lt: thisMonth
        }
      }
    })

    const userGrowth = lastMonthUsers > 0 
      ? Math.round(((newUsersThisMonth - lastMonthUsers) / lastMonthUsers) * 100)
      : 100

    return NextResponse.json({
      stats: {
        totalUsers,
        totalQuestions,
        totalExams,
        totalCategories,
        newUsersThisMonth,
        userGrowth
      },
      recentUsers,
      recentExams
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    )
  }
}
