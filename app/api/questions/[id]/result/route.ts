import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 记录答题结果
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const user = await getCurrentUser(token)
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 401 })
    }

    const { isCorrect, selectedOptions } = await request.json()

    // 检查题目是否存在
    const question = await prisma.question.findUnique({
      where: { id }
    })

    if (!question) {
      return NextResponse.json(
        { error: '题目不存在' },
        { status: 404 }
      )
    }

    // 记录答题结果
    const examResult = await prisma.examResult.create({
      data: {
        isCorrect,
        userId: user.id,
        questionId: question.id,
        selectedOptions: {
          create: selectedOptions.map((optionId: string) => ({
            optionId
          }))
        }
      },
      include: {
        selectedOptions: true
      }
    })

    return NextResponse.json({ examResult })
  } catch (error) {
    return NextResponse.json(
      { error: '记录答题结果失败' },
      { status: 500 }
    )
  }
}
