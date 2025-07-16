import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 获取题目详情
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        category: true,
        options: true,
        _count: {
          select: {
            examResults: true,
            favorites: true
          }
        }
      }
    })

    if (!question) {
      return NextResponse.json(
        { error: '题目不存在' },
        { status: 404 }
      )
    }

    // 不返回正确答案给前端
    const sanitizedQuestion = {
      ...question,
      options: question.options.map(opt => ({
        ...opt,
        isCorrect: undefined
      }))
    }

    return NextResponse.json({ question: sanitizedQuestion })
  } catch (error) {
    return NextResponse.json(
      { error: '获取题目失败' },
      { status: 500 }
    )
  }
}
