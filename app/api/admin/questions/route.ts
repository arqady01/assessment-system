import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 获取所有题目 (管理员)
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const where: any = {}
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ]
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
      questions,
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

    if (!title || !content || !type || !categoryId || !options || options.length === 0) {
      return NextResponse.json({ error: '请填写完整信息' }, { status: 400 })
    }

    // 验证至少有一个正确答案
    const hasCorrectAnswer = options.some((opt: any) => opt.isCorrect)
    if (!hasCorrectAnswer) {
      return NextResponse.json({ error: '至少需要一个正确答案' }, { status: 400 })
    }

    const question = await prisma.question.create({
      data: {
        title,
        content,
        type,
        difficulty: difficulty || 'MEDIUM',
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
    console.error('Create question error:', error)
    return NextResponse.json(
      { error: '创建题目失败' },
      { status: 500 }
    )
  }
}
