import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// 获取系统设置
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

    // 获取系统设置（这里我们使用一个简单的键值对存储）
    const settings = await prisma.systemSetting.findMany({
      orderBy: {
        key: 'asc'
      }
    })

    // 转换为对象格式
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)

    // 默认设置
    const defaultSettings = {
      siteName: '播控人员培训系统',
      siteDescription: '专业的播控人员技能培训平台',
      allowRegistration: 'true',
      requireEmailVerification: 'false',
      maxLoginAttempts: '5',
      sessionTimeout: '24',
      enableNotifications: 'true',
      maintenanceMode: 'false',
      maintenanceMessage: '系统维护中，请稍后访问',
      contactEmail: 'admin@example.com',
      supportPhone: '400-123-4567',
      companyName: '播控培训中心',
      companyAddress: '北京市朝阳区xxx路xxx号',
      backupFrequency: 'daily',
      logRetentionDays: '30',
      maxFileSize: '10',
      allowedFileTypes: 'jpg,jpeg,png,gif,pdf,doc,docx',
      ...settingsObj
    }

    return NextResponse.json({ settings: defaultSettings })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: '获取设置失败' },
      { status: 500 }
    )
  }
}

// 更新系统设置
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const user = await getCurrentUser(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const settings = await request.json()

    // 批量更新设置
    const updatePromises = Object.entries(settings).map(([key, value]) =>
      prisma.systemSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ message: '设置更新成功' })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: '更新设置失败' },
      { status: 500 }
    )
  }
}
