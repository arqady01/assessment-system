import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据...')

  // 创建管理员用户
  const adminPassword = await bcrypt.hash('admin123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '系统管理员',
      password: adminPassword,
      role: 'ADMIN'
    }
  })

  // 创建测试用户
  const userPassword = await bcrypt.hash('123456', 12)
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: '测试用户',
      password: userPassword,
      role: 'STUDENT',
      profession: 'tv'
    }
  })

  // 创建分类
  const categories = [
    {
      name: '基础知识',
      description: '掌握核心概念和理论',
      profession: 'tv',
      color: '#3b82f6',
      icon: 'BookOpen'
    },
    {
      name: '岗位职能',
      description: '专业岗位技能训练',
      profession: 'tv',
      color: '#10b981',
      icon: 'Zap'
    },
    {
      name: '消防知识',
      description: '安全消防相关知识',
      profession: 'tv',
      color: '#f59e0b',
      icon: 'Flame'
    },
    {
      name: '模拟测试',
      description: '全面检验学习成果',
      profession: 'tv',
      color: '#8b5cf6',
      icon: 'Award'
    }
  ]

  const createdCategories = []
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: {
        name_profession: {
          name: category.name,
          profession: category.profession
        }
      },
      update: {},
      create: category
    })
    createdCategories.push(created)
  }

  // 创建示例题目
  const questions = [
    {
      title: '电视播控系统的主要功能是什么？',
      content: '电视播控系统在广播电视行业中扮演着重要角色，请选择其主要功能。',
      type: 'SINGLE_CHOICE',
      difficulty: 'EASY',
      explanation: '电视播控系统的主要功能是控制节目播出顺序和时间，确保节目按计划准确播出。',
      categoryId: createdCategories[0].id,
      options: [
        { content: '控制节目播出顺序和时间', isCorrect: true },
        { content: '制作电视节目内容', isCorrect: false },
        { content: '管理演播室设备', isCorrect: false },
        { content: '编辑视频素材', isCorrect: false }
      ]
    },
    {
      title: '以下哪些是播控员的日常工作职责？',
      content: '播控员在日常工作中需要承担多项职责，请选择所有正确的选项。',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '播控员需要监控播出质量、执行播出计划、处理突发情况，但通常不负责节目制作。',
      categoryId: createdCategories[1].id,
      options: [
        { content: '监控播出质量', isCorrect: true },
        { content: '执行播出计划', isCorrect: true },
        { content: '处理播出突发情况', isCorrect: true },
        { content: '制作节目内容', isCorrect: false }
      ]
    },
    {
      title: '消防安全检查应该多久进行一次？',
      content: '根据消防安全规定，播控机房的消防安全检查频率是？',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '根据消防安全规定，重要设施如播控机房应该每月进行一次全面的消防安全检查。',
      categoryId: createdCategories[2].id,
      options: [
        { content: '每天', isCorrect: false },
        { content: '每周', isCorrect: false },
        { content: '每月', isCorrect: true },
        { content: '每季度', isCorrect: false }
      ]
    }
  ]

  for (const questionData of questions) {
    const { options, ...questionInfo } = questionData
    await prisma.question.create({
      data: {
        ...questionInfo,
        options: {
          create: options
        }
      }
    })
  }

  // 创建示例案例
  const cases = [
    {
      title: '突发停电应急处理案例',
      description: '播出过程中遇到突发停电的应急处理流程',
      content: `
## 案例背景
某电视台在晚间黄金时段播出过程中突然遇到市电停电，播控员需要立即采取应急措施确保播出不中断。

## 处理流程
1. **立即启动UPS电源**：确保关键设备继续运行
2. **启动备用发电机**：为长时间停电做准备
3. **切换到备用播出链路**：确保信号传输稳定
4. **通知相关部门**：及时上报情况并协调处理

## 经验总结
- 平时要定期检查UPS和发电机状态
- 建立完善的应急预案和演练机制
- 保持与电力部门的良好沟通
      `,
      profession: 'tv',
      tags: JSON.stringify(['应急处理', '停电', '播出安全'])
    },
    {
      title: '设备故障快速排查方法',
      description: '播控设备出现故障时的快速排查和处理方法',
      content: `
## 故障现象
播出画面出现马赛克、声音断续等异常现象。

## 排查步骤
1. **检查信号源**：确认信号输入是否正常
2. **检查传输链路**：排查线路连接问题
3. **检查设备状态**：查看设备指示灯和报警信息
4. **切换备用设备**：必要时启用备用播出链路

## 预防措施
- 建立设备巡检制度
- 定期维护保养设备
- 准备充足的备用设备
      `,
      profession: 'tv',
      tags: JSON.stringify(['设备维护', '故障排查', '播出质量'])
    }
  ]

  for (const caseData of cases) {
    await prisma.case.create({
      data: caseData
    })
  }

  // 创建操作规范
  const standards = [
    {
      title: '播控室日常操作规范',
      description: '播控室工作人员日常操作的标准流程',
      content: `
## 上岗准备
1. 检查个人防护用品佩戴情况
2. 查看当日播出计划和特殊安排
3. 检查设备运行状态和报警信息
4. 与前班人员进行工作交接

## 播出操作
1. 严格按照播出单执行播出计划
2. 实时监控播出质量和设备状态
3. 及时处理播出过程中的异常情况
4. 详细记录播出日志和设备状态

## 下班流程
1. 整理当班播出记录和设备日志
2. 向后班人员详细交接工作情况
3. 检查设备状态，确保正常运行
4. 清理工作区域，关闭非必要设备
      `,
      profession: 'tv',
      category: '日常操作',
      version: '1.0'
    },
    {
      title: '应急处理操作规范',
      description: '播出过程中突发情况的应急处理标准',
      content: `
## 应急响应原则
1. **快速响应**：发现问题立即处理
2. **安全第一**：确保人员和设备安全
3. **播出优先**：尽最大努力保证播出不中断
4. **及时上报**：重大问题及时向上级汇报

## 常见应急情况处理
### 设备故障
- 立即切换备用设备
- 通知技术人员检修
- 详细记录故障现象和处理过程

### 信号中断
- 检查信号传输链路
- 启用备用信号源
- 协调相关部门恢复信号

### 停电事故
- 启动UPS和发电机
- 切换到应急播出模式
- 通知电力部门抢修
      `,
      profession: 'tv',
      category: '应急处理',
      version: '1.0'
    }
  ]

  for (const standardData of standards) {
    await prisma.standard.create({
      data: standardData
    })
  }

  console.log('数据初始化完成！')
  console.log('管理员账号：admin@example.com / admin123456')
  console.log('测试账号：user@example.com / 123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
