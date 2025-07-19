import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 删除题目
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const user = await getCurrentUser(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    await prisma.question.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    return NextResponse.json(
      { error: '删除失败' },
      { status: 500 }
    )
  }
}

// 更新题目
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // 先删除旧的选项
    await prisma.option.deleteMany({
      where: { questionId: params.id }
    })

    // 更新题目和创建新选项
    const question = await prisma.question.update({
      where: { id: params.id },
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
      { error: '更新失败' },
      { status: 500 }
    )
  }
}
