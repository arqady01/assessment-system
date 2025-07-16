import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 获取所有分类 (管理员)
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
    const profession = searchParams.get('profession') || ''

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }
    if (profession) {
      where.profession = profession
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: {
            questions: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const total = await prisma.category.count({ where })

    return NextResponse.json({
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: '获取分类失败' },
      { status: 500 }
    )
  }
}

// 创建分类 (管理员)
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

    const { name, description, profession, color, icon } = await request.json()

    if (!name || !profession) {
      return NextResponse.json({ error: '请填写完整信息' }, { status: 400 })
    }

    // 检查分类名称是否已存在
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        profession
      }
    })

    if (existingCategory) {
      return NextResponse.json({ error: '该专业下已存在同名分类' }, { status: 400 })
    }

    const category = await prisma.category.create({
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
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: '创建分类失败' },
      { status: 500 }
    )
  }
}
