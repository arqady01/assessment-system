import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 检查答案
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    const { selectedOptions } = await request.json()

    // 获取题目和正确选项
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        options: true
      }
    })

    if (!question) {
      return NextResponse.json(
        { error: '题目不存在' },
        { status: 404 }
      )
    }

    // 获取正确选项的ID
    const correctOptionIds = question.options
      .filter(option => option.isCorrect)
      .map(option => option.id)

    // 判断答案是否正确
    let isCorrect = false
    
    if (question.type === 'SINGLE_CHOICE' || question.type === 'TRUE_FALSE') {
      // 单选题或判断题，只有一个正确答案
      isCorrect = selectedOptions.length === 1 && correctOptionIds.includes(selectedOptions[0])
    } else if (question.type === 'MULTIPLE_CHOICE') {
      // 多选题，需要选中所有正确答案，且不能选错
      isCorrect = 
        selectedOptions.length === correctOptionIds.length && 
        correctOptionIds.every(id => selectedOptions.includes(id))
    }

    // 获取当前用户
    const token = request.cookies.get('token')?.value
    let userId = null
    
    if (token) {
      const user = await getCurrentUser(token)
      if (user) {
        userId = user.id
      }
    }

    // 记录答题结果
    if (userId) {
      await prisma.examResult.create({
        data: {
          isCorrect,
          userId,
          questionId: question.id,
          selectedOptions: {
            create: selectedOptions.map((optionId: string) => ({
              optionId
            }))
          }
        }
      })
    }

    return NextResponse.json({
      isCorrect,
      correctOptionIds
    })
  } catch (error) {
    return NextResponse.json(
      { error: '检查答案失败' },
      { status: 500 }
    )
  }
}
