import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 获取题目列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profession = searchParams.get('profession')
    const categoryId = searchParams.get('categoryId')
    const difficulty = searchParams.get('difficulty')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (profession) {
      where.category = {
        profession
      }
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (difficulty) {
      where.difficulty = difficulty
    }

    const questions = await prisma.question.findMany({
      where,
      include: {
        category: true,
        options: true,
        _count: {
          select: {
            examResults: true,
            favorites: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const total = await prisma.question.count({ where })

    return NextResponse.json({
      questions: questions.map(q => ({
        ...q,
        options: q.options.map(opt => ({
          ...opt,
          isCorrect: undefined // 不返回正确答案给前端
        }))
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: '获取题目失败' },
      { status: 500 }
    )
  }
}

// 创建题目 (管理员)
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

    const { title, content, type, difficulty, explanation, categoryId, options } = await request.json()

    const question = await prisma.question.create({
      data: {
        title,
        content,
        type,
        difficulty,
        explanation,
        categoryId,
        options: {
          create: options
        }
      },
      include: {
        options: true,
        category: true
      }
    })

    return NextResponse.json({ question })
  } catch (error) {
    return NextResponse.json(
      { error: '创建题目失败' },
      { status: 500 }
    )
  }
}
