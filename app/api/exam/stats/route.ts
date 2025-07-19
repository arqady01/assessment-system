import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 获取用户统计数据
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const user = await getCurrentUser(token)
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 401 })
    }

    // 总答题数
    const totalAnswered = await prisma.examResult.count({
      where: { userId: user.id }
    })

    // 正确答题数
    const correctAnswered = await prisma.examResult.count({
      where: { 
        userId: user.id,
        isCorrect: true
      }
    })

    // 收藏数
    const favoriteCount = await prisma.favorite.count({
      where: { userId: user.id }
    })

    // 完成率
    const completionRate = totalAnswered > 0 ? Math.round((correctAnswered / totalAnswered) * 100) : 0

    // 最近7天的学习记录
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentActivity = await prisma.studyLog.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // 按分类统计答题情况
    const categoryStats = await prisma.examResult.groupBy({
      by: ['questionId'],
      where: { userId: user.id },
      _count: {
        questionId: true
      }
    })

    return NextResponse.json({
      stats: {
        totalAnswered,
        correctAnswered,
        favoriteCount,
        completionRate,
        recentActivity: recentActivity.length
      },
      recentActivity
    })
  } catch (error) {
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    )
  }
}
