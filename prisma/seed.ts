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
    // 电视播控规范
    {
      title: '电视播控基础操作规范',
      description: '电视播控室工作人员日常操作的标准流程',
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
      category: '基础操作',
      version: '1.2'
    },
    {
      title: '电视播出安全操作指南',
      description: '电视播出过程中的安全操作要求和注意事项',
      content: `
## 安全操作原则
1. **人员安全**：严格遵守安全操作规程
2. **设备安全**：正确使用和维护设备
3. **播出安全**：确保播出内容和质量安全
4. **信息安全**：保护播出系统和数据安全

## 设备操作安全
### 电气安全
- 操作前检查电源和接地
- 禁止带电操作设备
- 使用合格的电气工具

### 机械安全
- 正确操作机械设备
- 定期检查设备状态
- 及时更换磨损部件

## 应急安全措施
1. 熟悉应急预案和逃生路线
2. 掌握消防器材使用方法
3. 建立应急联系机制
      `,
      profession: 'tv',
      category: '安全操作',
      version: '1.0'
    },
    {
      title: '电视播出紧急情况处理流程',
      description: '电视播出过程中突发情况的应急处理标准',
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

## 应急联系方式
- 技术部门：内线8001
- 安全部门：内线8002
- 领导值班：内线8000
      `,
      profession: 'tv',
      category: '应急处理',
      version: '1.1'
    },

    // 广播播控规范
    {
      title: '广播播控基础操作规范',
      description: '广播播控室工作人员的基础操作标准和流程',
      content: `
## 岗位职责
1. 负责广播节目的播出控制
2. 监控播出质量和设备状态
3. 处理播出过程中的技术问题
4. 维护播出记录和设备日志

## 操作流程
### 开机准备
1. 检查播出设备状态
2. 核对当日播出安排
3. 测试音频信号质量
4. 确认备用设备就绪

### 播出控制
1. 按时启动节目播出
2. 实时监控音频质量
3. 及时调整音量和音质
4. 处理播出中的异常情况

### 交接班
1. 整理播出记录
2. 检查设备状态
3. 向接班人员交接
4. 填写交接班记录
      `,
      profession: 'radio',
      category: '基础操作',
      version: '1.0'
    },
    {
      title: '广播设备维护规范',
      description: '广播播控设备的日常维护和保养标准',
      content: `
## 维护原则
1. **预防为主**：定期检查和维护
2. **及时处理**：发现问题立即解决
3. **规范操作**：按照标准程序操作
4. **详细记录**：完整记录维护过程

## 日常维护
### 音频设备
- 每日检查音频质量
- 清洁设备表面和接口
- 检查线缆连接状态
- 测试备用设备功能

### 传输设备
- 监控信号传输质量
- 检查天线和传输线路
- 测试发射功率
- 维护冷却系统

## 定期保养
### 周保养
- 全面检查设备状态
- 清洁设备内部
- 检查接地系统
- 测试应急设备

### 月保养
- 深度清洁设备
- 检查备件库存
- 更新维护记录
- 培训操作人员
      `,
      profession: 'radio',
      category: '设备维护',
      version: '1.0'
    },
    {
      title: '广播播出应急预案',
      description: '广播播出系统应急情况的处理预案和操作指南',
      content: `
## 应急预案体系
1. **一级预案**：重大播出事故
2. **二级预案**：一般播出故障
3. **三级预案**：轻微技术问题

## 应急处理流程
### 信号中断
1. 立即启动备用信号源
2. 检查传输链路状态
3. 通知技术维护人员
4. 向上级部门报告

### 设备故障
1. 快速切换备用设备
2. 隔离故障设备
3. 联系设备厂商
4. 记录故障详情

### 人员应急
1. 启动人员替补机制
2. 通知备班人员到岗
3. 协调其他部门支援
4. 确保播出连续性

## 应急资源
- 备用播出系统
- 应急发电设备
- 备班人员名单
- 应急联系方式
      `,
      profession: 'radio',
      category: '应急预案',
      version: '1.0'
    },

    // 技术运维规范
    {
      title: '技术设备维护手册',
      description: '播控系统技术设备的维护保养操作手册',
      content: `
## 维护管理体系
1. **计划维护**：按计划进行的维护
2. **预防维护**：预防性维护措施
3. **故障维护**：故障后的维修处理
4. **改进维护**：设备改进和升级

## 设备分类维护
### 播出服务器
- 定期检查硬盘状态
- 监控系统资源使用
- 更新系统补丁
- 备份重要数据

### 网络设备
- 检查网络连接状态
- 监控网络流量
- 更新设备固件
- 维护网络安全

### 音视频设备
- 校准音视频参数
- 清洁设备接口
- 检查信号质量
- 更换易损部件

## 维护记录
1. 详细记录维护过程
2. 统计设备运行数据
3. 分析故障趋势
4. 制定改进措施
      `,
      profession: 'tech',
      category: '设备维护',
      version: '1.0'
    },
    {
      title: '系统故障排查指南',
      description: '播控系统常见故障的排查方法和解决方案',
      content: `
## 故障排查原则
1. **系统性排查**：从整体到局部
2. **逐步排除**：逐一排除可能原因
3. **重点突出**：优先处理关键问题
4. **记录详细**：完整记录排查过程

## 常见故障类型
### 系统故障
- 服务器死机或重启
- 操作系统异常
- 软件程序错误
- 数据库连接问题

### 网络故障
- 网络连接中断
- 网络速度缓慢
- IP地址冲突
- 路由配置错误

### 硬件故障
- 硬盘损坏
- 内存故障
- 电源问题
- 接口损坏

## 排查方法
### 初步诊断
1. 观察故障现象
2. 收集错误信息
3. 检查系统日志
4. 确定影响范围

### 深入分析
1. 使用诊断工具
2. 分析系统性能
3. 检查硬件状态
4. 验证配置参数

### 解决方案
1. 制定修复计划
2. 实施修复措施
3. 验证修复效果
4. 总结经验教训
      `,
      profession: 'tech',
      category: '故障排查',
      version: '1.0'
    },
    {
      title: '设备巡检标准流程',
      description: '播控系统设备的定期巡检标准和操作流程',
      content: `
## 巡检管理制度
1. **日巡检**：每日例行检查
2. **周巡检**：每周深度检查
3. **月巡检**：每月全面检查
4. **季巡检**：每季度专项检查

## 巡检内容
### 环境检查
- 机房温湿度
- 空调运行状态
- 消防系统状态
- 安全防护设施

### 设备检查
- 设备运行状态
- 指示灯和报警
- 接线和接口
- 设备清洁状况

### 系统检查
- 系统运行参数
- 日志和报警信息
- 备份系统状态
- 网络连接状态

## 巡检流程
### 准备工作
1. 制定巡检计划
2. 准备巡检工具
3. 查看历史记录
4. 确认安全措施

### 执行巡检
1. 按计划进行检查
2. 详细记录检查结果
3. 及时处理发现问题
4. 拍照记录重要信息

### 后续处理
1. 整理巡检报告
2. 跟踪问题处理
3. 更新设备档案
4. 制定改进措施
      `,
      profession: 'tech',
      category: '设备巡检',
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
