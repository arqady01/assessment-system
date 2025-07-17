import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取操作规范详情
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    const standard = await prisma.standard.findUnique({
      where: { id }
    })

    if (!standard) {
      return NextResponse.json(
        { error: '操作规范不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ standard })
  } catch (error) {
    console.error('获取操作规范详情失败:', error)
    return NextResponse.json(
      { error: '获取操作规范详情失败' },
      { status: 500 }
    )
  }
}
