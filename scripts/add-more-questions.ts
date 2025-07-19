import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMoreQuestions() {
  console.log('开始添加更多题目...')

  // 获取所有分类
  const allCategories = await prisma.category.findMany()

  // 补充题目
  const additionalQuestions = [
    // 电视播控 - 岗位职能
    {
      title: '播控员的工作交接内容包括？',
      content: '播控员在交接班时，需要向接班人员交接的内容包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      explanation: '交接班时需要详细交接播出计划、设备状态、异常情况等重要信息。',
      categoryName: '岗位职能',
      profession: 'tv',
      options: [
        { content: '当前播出计划执行情况', isCorrect: true },
        { content: '设备运行状态', isCorrect: true },
        { content: '异常情况及处理结果', isCorrect: true },
        { content: '个人工作心得', isCorrect: false }
      ]
    },
    {
      title: '播控员的职业素养要求是？',
      content: '作为播控员，应具备的基本职业素养包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '播控员需要具备责任心强、技术熟练、应变能力强、保密意识强等职业素养。',
      categoryName: '岗位职能',
      profession: 'tv',
      options: [
        { content: '高度的责任心', isCorrect: true },
        { content: '熟练的技术操作能力', isCorrect: true },
        { content: '强烈的保密意识', isCorrect: true },
        { content: '丰富的节目制作经验', isCorrect: false }
      ]
    },
    {
      title: '播控员的值班纪律要求？',
      content: '播控员在值班期间必须遵守的纪律要求包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      explanation: '值班期间要坚守岗位、保持警觉、严格执行规程、及时记录。',
      categoryName: '岗位职能',
      profession: 'tv',
      options: [
        { content: '不得擅离职守', isCorrect: true },
        { content: '保持高度警觉', isCorrect: true },
        { content: '严格执行操作规程', isCorrect: true },
        { content: '可以处理私人事务', isCorrect: false }
      ]
    },

    // 电视播控 - 消防知识
    {
      title: '播控机房的消防设备包括？',
      content: '播控机房应配备的消防设备包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      explanation: '播控机房应配备气体灭火系统、烟感报警器、手提式灭火器等消防设备。',
      categoryName: '消防知识',
      profession: 'tv',
      options: [
        { content: '气体灭火系统', isCorrect: true },
        { content: '烟感报警器', isCorrect: true },
        { content: '手提式灭火器', isCorrect: true },
        { content: '水喷淋系统', isCorrect: false }
      ]
    },
    {
      title: '电气火灾的扑救方法是？',
      content: '播控设备发生电气火灾时，正确的扑救方法是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '电气火灾必须先切断电源，然后使用干粉或二氧化碳灭火器扑救，不能用水。',
      categoryName: '消防知识',
      profession: 'tv',
      options: [
        { content: '先切断电源，再用干粉灭火器', isCorrect: true },
        { content: '直接用水扑救', isCorrect: false },
        { content: '用湿毛巾覆盖', isCorrect: false },
        { content: '用沙土掩埋', isCorrect: false }
      ]
    },
    {
      title: '火灾报警的正确程序是？',
      content: '发现火灾时，正确的报警程序应该是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'EASY',
      explanation: '发现火灾应立即报警119，同时通知单位领导和相关部门，组织人员疏散。',
      categoryName: '消防知识',
      profession: 'tv',
      options: [
        { content: '立即拨打119→通知领导→组织疏散', isCorrect: true },
        { content: '先灭火→再报警→通知领导', isCorrect: false },
        { content: '通知领导→报警119→组织疏散', isCorrect: false },
        { content: '组织疏散→通知领导→报警119', isCorrect: false }
      ]
    },

    // 电视播控 - 模拟测试
    {
      title: '综合测试：播出链路故障处理',
      content: '播出过程中发现主播出链路故障，画面出现马赛克，此时应该：',
      type: 'SINGLE_CHOICE',
      difficulty: 'HARD',
      explanation: '发现主链路故障应立即切换到备用链路，确保播出不中断，然后排查故障原因。',
      categoryName: '模拟测试',
      profession: 'tv',
      options: [
        { content: '立即切换到备用播出链路', isCorrect: true },
        { content: '调整信号参数尝试修复', isCorrect: false },
        { content: '重启播控设备', isCorrect: false },
        { content: '暂停播出进行检修', isCorrect: false }
      ]
    },
    {
      title: '综合测试：多故障同时处理',
      content: '同时出现停电和主设备故障，正确的处理优先级是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'HARD',
      explanation: '应先启动UPS保证供电，再切换备用设备，最后启动发电机，确保播出连续性。',
      categoryName: '模拟测试',
      profession: 'tv',
      options: [
        { content: '启动UPS→切换备用设备→启动发电机', isCorrect: true },
        { content: '切换备用设备→启动UPS→启动发电机', isCorrect: false },
        { content: '启动发电机→启动UPS→切换备用设备', isCorrect: false },
        { content: '同时进行所有操作', isCorrect: false }
      ]
    },
    {
      title: '综合测试：应急播出决策',
      content: '重大突发事件需要插播紧急新闻，但当前正在播出重要节目，应该：',
      type: 'SINGLE_CHOICE',
      difficulty: 'HARD',
      explanation: '重大突发事件的紧急新闻具有最高优先级，应立即中断当前节目进行插播。',
      categoryName: '模拟测试',
      profession: 'tv',
      options: [
        { content: '立即中断当前节目，插播紧急新闻', isCorrect: true },
        { content: '等当前节目结束后再播', isCorrect: false },
        { content: '在屏幕下方滚动播出', isCorrect: false },
        { content: '推迟到下一个时段播出', isCorrect: false }
      ]
    },

    // 广播播控补充题目
    {
      title: '立体声广播的技术特点是？',
      content: 'FM立体声广播相比单声道广播的技术特点包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '立体声广播具有声音层次丰富、空间感强、音质更好等特点。',
      categoryName: '基础知识',
      profession: 'radio',
      options: [
        { content: '声音层次更丰富', isCorrect: true },
        { content: '具有空间立体感', isCorrect: true },
        { content: '音质更加清晰', isCorrect: true },
        { content: '传输距离更远', isCorrect: false }
      ]
    },
    {
      title: '调音台的基本功能包括？',
      content: '广播调音台的基本功能包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      explanation: '调音台具有信号混合、音量控制、音效处理、监听输出等基本功能。',
      categoryName: '设备操作',
      profession: 'radio',
      options: [
        { content: '多路音频信号混合', isCorrect: true },
        { content: '音量大小控制', isCorrect: true },
        { content: '音效处理', isCorrect: true },
        { content: '视频信号处理', isCorrect: false }
      ]
    },
    {
      title: '广播信号传输中断的处理流程？',
      content: '广播信号传输中断时的标准处理流程是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '信号中断时应立即启用备用传输链路，同时排查故障原因并及时修复。',
      categoryName: '应急处理',
      profession: 'radio',
      options: [
        { content: '启用备用传输链路→排查故障→修复主链路', isCorrect: true },
        { content: '排查故障→修复主链路→恢复传输', isCorrect: false },
        { content: '通知听众→排查故障→修复链路', isCorrect: false },
        { content: '重启设备→检查连接→恢复传输', isCorrect: false }
      ]
    },

    // 技术运维补充题目
    {
      title: '虚拟化技术的优势包括？',
      content: '在播控系统中应用虚拟化技术的主要优势包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '虚拟化技术可以提高资源利用率、降低成本、便于管理、提高可靠性。',
      categoryName: '系统维护',
      profession: 'tech',
      options: [
        { content: '提高硬件资源利用率', isCorrect: true },
        { content: '降低运维成本', isCorrect: true },
        { content: '便于系统管理', isCorrect: true },
        { content: '完全消除硬件故障', isCorrect: false }
      ]
    },
    {
      title: '日志分析的重要性体现在？',
      content: '系统日志分析在故障排除中的重要性体现在：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '日志分析可以帮助定位问题、分析趋势、预防故障、优化性能。',
      categoryName: '故障排除',
      profession: 'tech',
      options: [
        { content: '快速定位问题根源', isCorrect: true },
        { content: '分析系统运行趋势', isCorrect: true },
        { content: '预防潜在故障', isCorrect: true },
        { content: '自动修复所有问题', isCorrect: false }
      ]
    },
    {
      title: '零信任安全模型的核心理念是？',
      content: '零信任网络安全模型的核心理念是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'HARD',
      explanation: '零信任模型的核心是"永不信任，始终验证"，对所有访问请求都进行验证。',
      categoryName: '网络安全',
      profession: 'tech',
      options: [
        { content: '永不信任，始终验证', isCorrect: true },
        { content: '一次验证，永久信任', isCorrect: false },
        { content: '内网免验证，外网严格验证', isCorrect: false },
        { content: '基于角色的访问控制', isCorrect: false }
      ]
    }
  ]

  // 添加题目到数据库
  for (const questionData of additionalQuestions) {
    const { options, categoryName, profession, ...questionInfo } = questionData
    
    // 找到对应的分类
    const category = allCategories.find(c => 
      c.name === categoryName && c.profession === profession
    )
    
    if (!category) {
      console.log(`未找到分类: ${categoryName} (${profession})`)
      continue
    }

    // 检查题目是否已存在
    const existingQuestion = await prisma.question.findFirst({
      where: { title: questionInfo.title }
    })

    if (existingQuestion) {
      console.log(`题目已存在: ${questionInfo.title}`)
      continue
    }

    try {
      await prisma.question.create({
        data: {
          ...questionInfo,
          categoryId: category.id,
          options: {
            create: options
          }
        }
      })
      console.log(`添加题目: ${questionInfo.title}`)
    } catch (error) {
      console.error(`添加题目失败: ${questionInfo.title}`, error)
    }
  }

  console.log('补充题目添加完成！')
}

addMoreQuestions()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
