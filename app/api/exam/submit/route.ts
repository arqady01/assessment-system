import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 提交答案
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const user = await getCurrentUser(token)
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 401 })
    }

    const { questionId, userAnswer, timeSpent } = await request.json()

    // 获取题目和正确答案
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        options: true
      }
    })

    if (!question) {
      return NextResponse.json({ error: '题目不存在' }, { status: 404 })
    }

    // 判断答案是否正确
    let isCorrect = false
    if (question.type === 'SINGLE_CHOICE') {
      const correctOption = question.options.find(opt => opt.isCorrect)
      isCorrect = correctOption?.id === userAnswer
    } else if (question.type === 'MULTIPLE_CHOICE') {
      const correctOptions = question.options.filter(opt => opt.isCorrect).map(opt => opt.id)
      const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer]
      isCorrect = correctOptions.length === userAnswers.length && 
                  correctOptions.every(id => userAnswers.includes(id))
    } else if (question.type === 'TRUE_FALSE') {
      const correctOption = question.options.find(opt => opt.isCorrect)
      isCorrect = correctOption?.content === userAnswer
    }

    // 保存答题结果
    const examResult = await prisma.examResult.create({
      data: {
        userId: user.id,
        questionId,
        userAnswer: typeof userAnswer === 'string' ? userAnswer : JSON.stringify(userAnswer),
        isCorrect,
        timeSpent
      }
    })

    // 记录学习日志
    await prisma.studyLog.create({
      data: {
        userId: user.id,
        action: 'practice',
        details: JSON.stringify({
          questionId,
          isCorrect,
          timeSpent
        })
      }
    })

    return NextResponse.json({
      examResult,
      isCorrect,
      explanation: question.explanation,
      correctAnswer: question.options.filter(opt => opt.isCorrect)
    })
  } catch (error) {
    return NextResponse.json(
      { error: '提交答案失败' },
      { status: 500 }
    )
  }
}
