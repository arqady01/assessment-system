import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取分类详情
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            questions: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: '分类不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ category })
  } catch (error) {
    return NextResponse.json(
      { error: '获取分类失败' },
      { status: 500 }
    )
  }
}
