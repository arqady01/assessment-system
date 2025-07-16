import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addQuestions() {
  console.log('开始添加题目数据...')

  // 首先获取所有分类
  const categories = await prisma.category.findMany()
  console.log('找到分类:', categories.map(c => `${c.name} (${c.profession})`))

  // 为每个专业创建分类（如果不存在）
  const categoryData = [
    // 电视播控分类
    { name: '基础知识', profession: 'tv', description: '电视播控基础理论知识', color: '#3b82f6', icon: 'BookOpen' },
    { name: '设备操作', profession: 'tv', description: '播控设备操作技能', color: '#10b981', icon: 'Settings' },
    { name: '应急处理', profession: 'tv', description: '突发情况应急处理', color: '#f59e0b', icon: 'AlertTriangle' },
    { name: '安全规范', profession: 'tv', description: '播出安全规范要求', color: '#ef4444', icon: 'Shield' },
    
    // 广播播控分类
    { name: '基础知识', profession: 'radio', description: '广播播控基础理论知识', color: '#3b82f6', icon: 'BookOpen' },
    { name: '设备操作', profession: 'radio', description: '广播设备操作技能', color: '#10b981', icon: 'Settings' },
    { name: '应急处理', profession: 'radio', description: '突发情况应急处理', color: '#f59e0b', icon: 'AlertTriangle' },
    { name: '安全规范', profession: 'radio', description: '播出安全规范要求', color: '#ef4444', icon: 'Shield' },
    
    // 技术运维分类
    { name: '系统维护', profession: 'tech', description: '系统日常维护管理', color: '#3b82f6', icon: 'Database' },
    { name: '故障排除', profession: 'tech', description: '设备故障诊断排除', color: '#10b981', icon: 'Zap' },
    { name: '网络安全', profession: 'tech', description: '网络安全防护知识', color: '#f59e0b', icon: 'Shield' },
    { name: '技术标准', profession: 'tech', description: '技术规范和标准', color: '#ef4444', icon: 'Award' }
  ]

  // 创建分类
  const createdCategories = []
  for (const catData of categoryData) {
    const existing = await prisma.category.findFirst({
      where: { name: catData.name, profession: catData.profession }
    })
    
    if (!existing) {
      const created = await prisma.category.create({ data: catData })
      createdCategories.push(created)
      console.log(`创建分类: ${created.name} (${created.profession})`)
    } else {
      createdCategories.push(existing)
    }
  }

  // 获取所有分类（包括新创建的）
  const allCategories = await prisma.category.findMany()
  
  // 电视播控题目
  const tvQuestions = [
    // 基础知识
    {
      title: '电视播控系统的核心功能是什么？',
      content: '电视播控系统在广播电视行业中起到关键作用，以下哪项是其核心功能？',
      type: 'SINGLE_CHOICE',
      difficulty: 'EASY',
      explanation: '电视播控系统的核心功能是按照预定的播出计划，自动或手动控制节目的播出顺序、时间和内容，确保节目准确无误地传送给观众。',
      categoryName: '基础知识',
      profession: 'tv',
      options: [
        { content: '控制节目播出顺序和时间', isCorrect: true },
        { content: '制作电视节目内容', isCorrect: false },
        { content: '管理演播室灯光', isCorrect: false },
        { content: '编辑视频素材', isCorrect: false }
      ]
    },
    {
      title: '播控员的主要职责包括哪些？',
      content: '作为电视播控员，需要承担多项重要职责，以下哪些是播控员的主要工作内容？',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '播控员的主要职责包括：监控播出质量、执行播出计划、处理突发情况、记录播出日志等，确保播出工作的顺利进行。',
      categoryName: '基础知识',
      profession: 'tv',
      options: [
        { content: '监控播出画面和声音质量', isCorrect: true },
        { content: '执行每日播出计划', isCorrect: true },
        { content: '处理播出过程中的突发情况', isCorrect: true },
        { content: '制作电视广告内容', isCorrect: false }
      ]
    },
    {
      title: '数字电视信号的主要优势是什么？',
      content: '与模拟电视信号相比，数字电视信号具有明显优势，以下说法正确的是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '数字电视信号具有抗干扰能力强、画质清晰、可传输更多频道、支持交互功能等优势，是电视技术发展的主要方向。',
      categoryName: '基础知识',
      profession: 'tv',
      options: [
        { content: '抗干扰能力强，画质更清晰', isCorrect: true },
        { content: '传输距离更远', isCorrect: false },
        { content: '设备成本更低', isCorrect: false },
        { content: '功耗更小', isCorrect: false }
      ]
    },

    // 设备操作
    {
      title: '播控台的开机顺序应该是？',
      content: '为了保护设备和确保正常工作，播控台设备的开机顺序非常重要，正确的开机顺序是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'EASY',
      explanation: '正确的开机顺序是：先开信号源设备，再开中间处理设备，最后开输出设备。这样可以避免设备冲击和信号干扰。',
      categoryName: '设备操作',
      profession: 'tv',
      options: [
        { content: '信号源→处理设备→输出设备', isCorrect: true },
        { content: '输出设备→处理设备→信号源', isCorrect: false },
        { content: '处理设备→信号源→输出设备', isCorrect: false },
        { content: '同时开启所有设备', isCorrect: false }
      ]
    },
    {
      title: '视频切换台的主要功能包括？',
      content: '视频切换台是播控系统的核心设备之一，其主要功能包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '视频切换台具有多路视频信号切换、特效制作、画面监看、信号分配等功能，是播控系统的重要组成部分。',
      categoryName: '设备操作',
      profession: 'tv',
      options: [
        { content: '多路视频信号切换', isCorrect: true },
        { content: '视频特效制作', isCorrect: true },
        { content: '画面质量监看', isCorrect: true },
        { content: '音频信号处理', isCorrect: false }
      ]
    },

    // 应急处理
    {
      title: '播出过程中出现黑屏应如何处理？',
      content: '在播出过程中突然出现黑屏现象，播控员应该采取的第一步措施是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '出现黑屏时，应立即切换到备用信号源，确保播出不中断，然后再排查故障原因。',
      categoryName: '应急处理',
      profession: 'tv',
      options: [
        { content: '立即切换到备用信号源', isCorrect: true },
        { content: '重启播控设备', isCorrect: false },
        { content: '检查电源连接', isCorrect: false },
        { content: '联系技术人员', isCorrect: false }
      ]
    },
    {
      title: '停电时的应急处理流程是？',
      content: '播出过程中遇到停电，正确的应急处理流程应该是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'HARD',
      explanation: '停电应急处理：启动UPS→启动发电机→切换备用播出→通知相关部门。这个顺序确保播出连续性和设备安全。',
      categoryName: '应急处理',
      profession: 'tv',
      options: [
        { content: '启动UPS→启动发电机→切换备用播出→通知相关部门', isCorrect: true },
        { content: '通知相关部门→启动发电机→启动UPS→切换备用播出', isCorrect: false },
        { content: '切换备用播出→启动UPS→启动发电机→通知相关部门', isCorrect: false },
        { content: '启动发电机→启动UPS→通知相关部门→切换备用播出', isCorrect: false }
      ]
    },

    // 安全规范
    {
      title: '播控机房的温湿度要求是？',
      content: '为确保设备正常运行，播控机房的环境温湿度应控制在：',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '播控机房温度应控制在18-25℃，相对湿度控制在45%-65%，这样的环境有利于设备稳定运行和延长使用寿命。',
      categoryName: '安全规范',
      profession: 'tv',
      options: [
        { content: '温度18-25℃，湿度45%-65%', isCorrect: true },
        { content: '温度15-30℃，湿度30%-80%', isCorrect: false },
        { content: '温度20-28℃，湿度40%-70%', isCorrect: false },
        { content: '温度16-26℃，湿度35%-75%', isCorrect: false }
      ]
    },
    {
      title: '播控值班记录应包含哪些内容？',
      content: '播控员在值班期间需要详细记录工作情况，值班记录应包含：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      explanation: '播控值班记录应详细记录播出情况、设备状态、异常事件等，为后续工作提供参考。',
      categoryName: '安全规范',
      profession: 'tv',
      options: [
        { content: '播出节目时间和内容', isCorrect: true },
        { content: '设备运行状态', isCorrect: true },
        { content: '异常情况处理过程', isCorrect: true },
        { content: '个人生活安排', isCorrect: false }
      ]
    },
    {
      title: '信号监测的主要指标包括？',
      content: '播控系统信号监测需要关注的主要技术指标包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '信号监测主要关注视频电平、音频电平、色度、亮度等技术指标，确保播出质量。',
      categoryName: '设备操作',
      profession: 'tv',
      options: [
        { content: '视频电平', isCorrect: true },
        { content: '音频电平', isCorrect: true },
        { content: '色度饱和度', isCorrect: true },
        { content: '设备温度', isCorrect: false }
      ]
    },
    {
      title: '自动播出系统的优势是什么？',
      content: '相比人工播出，自动播出系统的主要优势包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'EASY',
      explanation: '自动播出系统具有精确度高、减少人为错误、提高效率、降低成本等优势。',
      categoryName: '基础知识',
      profession: 'tv',
      options: [
        { content: '播出时间精确', isCorrect: true },
        { content: '减少人为错误', isCorrect: true },
        { content: '提高工作效率', isCorrect: true },
        { content: '完全不需要人工监控', isCorrect: false }
      ]
    },
    {
      title: '播出事故的分类标准是什么？',
      content: '根据影响程度，播出事故通常分为：',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '播出事故按影响程度分为一般事故、较大事故、重大事故和特别重大事故四个等级。',
      categoryName: '应急处理',
      profession: 'tv',
      options: [
        { content: '一般、较大、重大、特别重大', isCorrect: true },
        { content: '轻微、一般、严重、特别严重', isCorrect: false },
        { content: '低级、中级、高级、特级', isCorrect: false },
        { content: '小型、中型、大型、超大型', isCorrect: false }
      ]
    }
  ]

  // 广播播控题目
  const radioQuestions = [
    {
      title: '广播播控系统与电视播控系统的主要区别是？',
      content: '广播播控系统在技术特点上与电视播控系统相比，主要区别在于：',
      type: 'SINGLE_CHOICE',
      difficulty: 'EASY',
      explanation: '广播播控系统主要处理音频信号，而电视播控系统需要同时处理音频和视频信号，因此广播系统相对简单但对音质要求更高。',
      categoryName: '基础知识',
      profession: 'radio',
      options: [
        { content: '主要处理音频信号，对音质要求更高', isCorrect: true },
        { content: '设备更复杂，技术要求更高', isCorrect: false },
        { content: '播出时间更长，全天候运行', isCorrect: false },
        { content: '覆盖范围更广，传输距离更远', isCorrect: false }
      ]
    },
    {
      title: 'FM调频广播的频率范围是？',
      content: '我国FM调频广播的频率范围是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'EASY',
      explanation: '我国FM调频广播频率范围为87.5-108MHz，这是国际标准频段，音质较好，抗干扰能力强。',
      categoryName: '基础知识',
      profession: 'radio',
      options: [
        { content: '87.5-108MHz', isCorrect: true },
        { content: '76-90MHz', isCorrect: false },
        { content: '88-108MHz', isCorrect: false },
        { content: '87-107MHz', isCorrect: false }
      ]
    },
    {
      title: '数字音频工作站的主要功能包括？',
      content: '数字音频工作站(DAW)在广播播控中的主要功能包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '数字音频工作站具有音频录制、编辑、混音、播出等多种功能，是现代广播播控的核心设备。',
      categoryName: '设备操作',
      profession: 'radio',
      options: [
        { content: '音频录制和编辑', isCorrect: true },
        { content: '多轨混音处理', isCorrect: true },
        { content: '自动播出控制', isCorrect: true },
        { content: '视频信号处理', isCorrect: false }
      ]
    },
    {
      title: '广播直播中出现杂音应如何处理？',
      content: '在广播直播过程中突然出现杂音，播控员应该：',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '出现杂音时应立即切换到备用音源，确保播出质量，然后排查杂音来源并及时处理。',
      categoryName: '应急处理',
      profession: 'radio',
      options: [
        { content: '立即切换到备用音源', isCorrect: true },
        { content: '调整音量大小', isCorrect: false },
        { content: '重启播控设备', isCorrect: false },
        { content: '暂停播出排查故障', isCorrect: false }
      ]
    },
    {
      title: 'AM调幅广播的频率范围是？',
      content: '我国AM调幅广播(中波)的频率范围是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'EASY',
      explanation: '我国AM调幅广播频率范围为531-1602kHz，传播距离远，夜间传播效果更好。',
      categoryName: '基础知识',
      profession: 'radio',
      options: [
        { content: '531-1602kHz', isCorrect: true },
        { content: '520-1610kHz', isCorrect: false },
        { content: '540-1600kHz', isCorrect: false },
        { content: '535-1605kHz', isCorrect: false }
      ]
    },
    {
      title: '音频压缩器的作用是什么？',
      content: '在广播播控系统中，音频压缩器的主要作用是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '音频压缩器用于控制音频动态范围，防止音量过大造成失真，保证播出音质稳定。',
      categoryName: '设备操作',
      profession: 'radio',
      options: [
        { content: '控制音频动态范围，防止失真', isCorrect: true },
        { content: '压缩音频文件大小', isCorrect: false },
        { content: '提高音频传输速度', isCorrect: false },
        { content: '增强音频信号强度', isCorrect: false }
      ]
    },
    {
      title: '广播节目播出中断的应急措施是？',
      content: '广播节目播出中断时，应立即采取的应急措施是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '播出中断时应立即启用应急播出系统，播放备用节目或应急广播，确保频率不断播。',
      categoryName: '应急处理',
      profession: 'radio',
      options: [
        { content: '启用应急播出系统', isCorrect: true },
        { content: '通知听众稍等', isCorrect: false },
        { content: '关闭发射机', isCorrect: false },
        { content: '联系节目制作部门', isCorrect: false }
      ]
    },
    {
      title: '广播发射机的功率等级分类？',
      content: '根据发射功率，广播发射机通常分为：',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '广播发射机按功率分为小功率(1kW以下)、中功率(1-10kW)、大功率(10kW以上)三个等级。',
      categoryName: '安全规范',
      profession: 'radio',
      options: [
        { content: '小功率、中功率、大功率', isCorrect: true },
        { content: '低功率、标准功率、高功率', isCorrect: false },
        { content: '微功率、常规功率、超功率', isCorrect: false },
        { content: '基础功率、增强功率、最大功率', isCorrect: false }
      ]
    }
  ]

  // 技术运维题目
  const techQuestions = [
    {
      title: '服务器日常维护的主要内容包括？',
      content: '播控系统服务器的日常维护工作主要包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '服务器日常维护包括：系统更新、性能监控、数据备份、安全检查等，确保系统稳定运行。',
      categoryName: '系统维护',
      profession: 'tech',
      options: [
        { content: '系统补丁更新', isCorrect: true },
        { content: '性能监控检查', isCorrect: true },
        { content: '数据定期备份', isCorrect: true },
        { content: '硬件设备清洁', isCorrect: false }
      ]
    },
    {
      title: '网络延迟过高的可能原因是？',
      content: '播控系统网络延迟过高，可能的原因包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'HARD',
      explanation: '网络延迟过高可能由带宽不足、网络拥塞、设备故障、路由配置等多种因素造成，需要逐一排查。',
      categoryName: '故障排除',
      profession: 'tech',
      options: [
        { content: '网络带宽不足', isCorrect: true },
        { content: '交换机故障', isCorrect: true },
        { content: '路由配置错误', isCorrect: true },
        { content: '电源电压不稳', isCorrect: false }
      ]
    },
    {
      title: '防火墙的主要作用是？',
      content: '在播控系统网络安全中，防火墙的主要作用是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'EASY',
      explanation: '防火墙主要用于控制网络访问，阻止未授权的网络连接，保护内部网络安全。',
      categoryName: '网络安全',
      profession: 'tech',
      options: [
        { content: '控制网络访问，阻止未授权连接', isCorrect: true },
        { content: '提高网络传输速度', isCorrect: false },
        { content: '增强信号传输质量', isCorrect: false },
        { content: '减少网络延迟', isCorrect: false }
      ]
    },
    {
      title: '广播电视技术标准中，高清电视的分辨率是？',
      content: '根据国家广播电视技术标准，高清电视(HDTV)的标准分辨率是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '高清电视标准分辨率为1920×1080像素，也称为1080p或Full HD，是目前主流的高清标准。',
      categoryName: '技术标准',
      profession: 'tech',
      options: [
        { content: '1920×1080', isCorrect: true },
        { content: '1280×720', isCorrect: false },
        { content: '1366×768', isCorrect: false },
        { content: '1440×900', isCorrect: false }
      ]
    },
    {
      title: '数据库备份的最佳实践是什么？',
      content: '播控系统数据库备份的最佳实践包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: '数据库备份应定期进行、多地存储、定期测试恢复，确保数据安全可靠。',
      categoryName: '系统维护',
      profession: 'tech',
      options: [
        { content: '定期自动备份', isCorrect: true },
        { content: '多地异地存储', isCorrect: true },
        { content: '定期测试恢复', isCorrect: true },
        { content: '只备份重要数据', isCorrect: false }
      ]
    },
    {
      title: '系统性能监控的关键指标包括？',
      content: '播控系统性能监控需要重点关注的指标包括：',
      type: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM',
      explanation: 'CPU使用率、内存占用、磁盘I/O、网络流量是系统性能监控的关键指标。',
      categoryName: '故障排除',
      profession: 'tech',
      options: [
        { content: 'CPU使用率', isCorrect: true },
        { content: '内存占用率', isCorrect: true },
        { content: '磁盘I/O性能', isCorrect: true },
        { content: '显示器亮度', isCorrect: false }
      ]
    },
    {
      title: '入侵检测系统(IDS)的作用是？',
      content: '在播控系统网络安全中，入侵检测系统的主要作用是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'HARD',
      explanation: '入侵检测系统用于实时监控网络流量，发现异常行为和潜在的安全威胁。',
      categoryName: '网络安全',
      profession: 'tech',
      options: [
        { content: '监控网络流量，发现异常行为', isCorrect: true },
        { content: '阻止所有外部访问', isCorrect: false },
        { content: '加密网络传输数据', isCorrect: false },
        { content: '提高网络传输速度', isCorrect: false }
      ]
    },
    {
      title: '4K超高清电视的标准分辨率是？',
      content: '根据国际标准，4K超高清电视(UHD)的分辨率是：',
      type: 'SINGLE_CHOICE',
      difficulty: 'EASY',
      explanation: '4K超高清电视标准分辨率为3840×2160像素，是高清电视分辨率的4倍。',
      categoryName: '技术标准',
      profession: 'tech',
      options: [
        { content: '3840×2160', isCorrect: true },
        { content: '4096×2160', isCorrect: false },
        { content: '3840×2048', isCorrect: false },
        { content: '4000×2000', isCorrect: false }
      ]
    }
  ]

  // 合并所有题目
  const allQuestions = [...tvQuestions, ...radioQuestions, ...techQuestions]

  // 添加题目到数据库
  for (const questionData of allQuestions) {
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

  console.log('题目添加完成！')
}

addQuestions()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
