import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 获取分类列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profession = searchParams.get('profession')

    // 如果没有指定专业，尝试从用户信息获取
    let targetProfession = profession
    if (!targetProfession) {
      const token = request.cookies.get('token')?.value
      if (token) {
        const user = await getCurrentUser(token)
        if (user?.profession) {
          targetProfession = user.profession
        }
      }
    }

    const where: any = {}
    if (targetProfession) {
      where.profession = targetProfession
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
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({ categories })
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

    const category = await prisma.category.create({
      data: {
        name,
        description,
        profession,
        color,
        icon
      }
    })

    return NextResponse.json({ category })
  } catch (error) {
    return NextResponse.json(
      { error: '创建分类失败' },
      { status: 500 }
    )
  }
}
