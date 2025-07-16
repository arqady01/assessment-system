import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取下一题
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const currentId = searchParams.get('currentId')
    const categoryId = searchParams.get('categoryId')

    if (!currentId || !categoryId) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 获取当前题目
    const currentQuestion = await prisma.question.findUnique({
      where: { id: currentId }
    })

    if (!currentQuestion) {
      return NextResponse.json(
        { error: '当前题目不存在' },
        { status: 404 }
      )
    }

    // 获取同分类下的下一题（按创建时间排序）
    const nextQuestion = await prisma.question.findFirst({
      where: {
        categoryId,
        createdAt: {
          gt: currentQuestion.createdAt
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        id: true,
        title: true
      }
    })

    if (!nextQuestion) {
      // 如果没有下一题，返回该分类的第一题
      const firstQuestion = await prisma.question.findFirst({
        where: {
          categoryId,
          id: {
            not: currentId
          }
        },
        orderBy: {
          createdAt: 'asc'
        },
        select: {
          id: true,
          title: true
        }
      })

      return NextResponse.json({ nextQuestion: firstQuestion })
    }

    return NextResponse.json({ nextQuestion })
  } catch (error) {
    return NextResponse.json(
      { error: '获取下一题失败' },
      { status: 500 }
    )
  }
}
