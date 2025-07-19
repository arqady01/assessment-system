import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取操作规范列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profession = searchParams.get('profession')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (profession) {
      where.profession = profession
    }
    
    if (category) {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { content: { contains: search } }
      ]
    }

    const standards = await prisma.standard.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        updatedAt: 'desc'
      }
    })

    const total = await prisma.standard.count({ where })

    return NextResponse.json({
      standards,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('获取操作规范失败:', error)
    return NextResponse.json(
      { error: '获取操作规范失败' },
      { status: 500 }
    )
  }
}
