import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 删除分类
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

    // 检查分类下是否有题目
    const questionCount = await prisma.question.count({
      where: { categoryId: params.id }
    })

    if (questionCount > 0) {
      return NextResponse.json(
        { error: `该分类下还有 ${questionCount} 个题目，无法删除` },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { error: '删除失败' },
      { status: 500 }
    )
  }
}

// 更新分类
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

    const { name, description, profession, color, icon } = await request.json()

    if (!name || !profession) {
      return NextResponse.json({ error: '请填写完整信息' }, { status: 400 })
    }

    // 检查分类名称是否已存在（排除当前分类）
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        profession,
        NOT: {
          id: params.id
        }
      }
    })

    if (existingCategory) {
      return NextResponse.json({ error: '该专业下已存在同名分类' }, { status: 400 })
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        description: description || '',
        profession,
        color: color || '#3b82f6',
        icon: icon || 'BookOpen'
      },
      include: {
        _count: {
          select: {
            questions: true
          }
        }
      }
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    )
  }
}
