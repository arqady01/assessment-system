'use client'

import { ArrowLeft, Star, Calendar, Tag, User, Clock, Download, Share2, Heart, MessageCircle, ThumbsUp, Eye, Bookmark, Printer, ExternalLink, ChevronDown, ChevronUp, Filter, Search, TrendingUp, Award, Target, CheckCircle } from "lucide-react"
import { MotionDiv } from "@/lib/motion-wrapper"
import { useState, useEffect } from "react"

// 案例详情页面属性接口
interface CaseDetailProps {
  caseId: string
  onBack: () => void
}

// 评论数据接口
interface Comment {
  id: string
  author: string
  avatar?: string
  content: string
  timestamp: string
  likes: number
  replies?: Comment[]
  isLiked?: boolean
}

// 相关案例接口
interface RelatedCase {
  id: string
  title: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  readTime: string
  rating: number
  thumbnail?: string
}

// 学习进度接口
interface LearningProgress {
  currentStep: number
  totalSteps: number
  completedSections: string[]
  timeSpent: number
  lastAccessed: string
}

// 案例统计接口
interface CaseStats {
  views: number
  likes: number
  bookmarks: number
  shares: number
  comments: number
  difficulty: number
  completionRate: number
}

// 模拟评论数据
const mockComments: Comment[] = [
  {
    id: "1",
    author: "李技术员",
    content: "这个案例分析得很详细，特别是故障排查的步骤很有参考价值。我们遇到类似问题时就是按照这个流程解决的。",
    timestamp: "2025-07-15 14:30",
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: "1-1",
        author: "张工程师",
        content: "谢谢认可！这个流程是我们团队多年经验的总结，希望对大家有帮助。",
        timestamp: "2025-07-15 15:45",
        likes: 5,
        isLiked: true
      }
    ]
  },
  {
    id: "2",
    author: "王主管",
    content: "建议在案例中增加一些预防措施的说明，这样可以减少类似故障的发生。",
    timestamp: "2025-07-14 09:20",
    likes: 8,
    isLiked: false
  },
  {
    id: "3",
    author: "刘工程师",
    content: "第三步的测试方法很实用，我们已经在实际工作中应用了，效果不错。",
    timestamp: "2025-07-13 16:10",
    likes: 15,
    isLiked: true
  }
]

// 相关案例推荐数据
const relatedCases: RelatedCase[] = [
  {
    id: "2",
    title: "网络设备配置优化",
    category: "技术案例",
    difficulty: "medium",
    readTime: "12分钟",
    rating: 4.6
  },
  {
    id: "3",
    title: "系统性能监控与调优",
    category: "运维案例",
    difficulty: "hard",
    readTime: "20分钟",
    rating: 4.9
  },
  {
    id: "4",
    title: "安全漏洞修复实践",
    category: "安全案例",
    difficulty: "medium",
    readTime: "18分钟",
    rating: 4.7
  },
  {
    id: "5",
    title: "数据备份策略制定",
    category: "管理案例",
    difficulty: "easy",
    readTime: "10分钟",
    rating: 4.5
  }
]

// 扩展的案例数据
const caseData = {
  "1": {
    title: "设备故障诊断与排除",
    category: "经典案例",
    publishDate: "2025-06-15",
    rating: 4.8,
    author: "技术部 - 张工程师",
    authorTitle: "高级工程师",
    authorExperience: "10年",
    readTime: "15分钟",
    difficulty: "medium",
    tags: ["设备维护", "故障排除", "系统诊断", "技术分析"],
    color: "#0ea5e9",
    icon: "HardDrive",
    summary: "本案例详细分析了一次复杂设备故障的诊断过程，包括初步判断、测试方法和最终解决方案。通过系统化的故障排查流程，提高了维修效率和准确率。",
    stats: {
      views: 2847,
      likes: 156,
      bookmarks: 89,
      shares: 23,
      comments: 45,
      difficulty: 3,
      completionRate: 87
    } as CaseStats,
    learningObjectives: [
      "掌握系统化的故障诊断方法",
      "学会使用专业测试工具",
      "理解设备运行原理",
      "培养问题分析能力"
    ],
    prerequisites: [
      "基础电子知识",
      "设备操作经验",
      "安全操作规范"
    ],
    keyPoints: [
      "故障现象观察与记录",
      "系统化排查流程",
      "测试工具的正确使用",
      "解决方案的验证"
    ],
    content: `
## 案例背景

### 故障发生环境
本次故障发生在某大型企业的核心生产环境中，涉及关键业务系统的正常运行。故障设备为主要的网络交换设备，承担着整个生产网络的数据交换任务。

### 故障影响范围
- **业务影响**：影响了约200个工作站的网络连接
- **时间影响**：故障持续时间约4小时
- **经济影响**：预估造成生产损失约50万元
- **人员影响**：涉及技术、生产、管理等多个部门

### 故障发现过程
故障最初由生产部门反馈网络连接异常开始，随后IT部门接到多个类似报告。通过初步排查发现问题集中在核心交换设备上。

## 详细分析过程

### 第一阶段：问题定位
1. **现象收集**
   - 网络连接间歇性中断
   - 数据传输速度明显下降
   - 部分端口指示灯异常闪烁
   - 设备温度略高于正常值

2. **初步判断**
   - 排除软件配置问题
   - 排除外部网络干扰
   - 初步怀疑硬件故障

3. **工具准备**
   - 网络测试仪
   - 万用表
   - 示波器
   - 备用设备

### 第二阶段：深入检测
1. **端口测试**
   使用专业网络测试仪对所有端口进行逐一测试，发现端口1-8存在信号异常。

2. **电路检测**
   使用万用表检测相关电路，发现供电模块存在电压波动。

3. **信号分析**
   通过示波器分析数字信号，确认信号质量下降。

### 第三阶段：根因分析
经过详细检测，最终确定故障原因为：
- 主要原因：供电模块老化导致电压不稳
- 次要原因：散热系统效率下降
- 诱发因素：近期环境温度升高

## 解决方案实施

### 应急处理
1. **临时措施**
   - 启用备用设备维持关键业务
   - 调整网络拓扑减少负载
   - 加强设备散热

2. **风险控制**
   - 制定回退方案
   - 准备应急通讯方式
   - 通知相关部门

### 根本解决
1. **硬件更换**
   - 更换故障供电模块
   - 升级散热系统
   - 检查相关连接线路

2. **系统优化**
   - 调整设备配置参数
   - 优化网络负载分配
   - 建立监控告警机制

3. **测试验证**
   - 功能测试：验证所有端口正常工作
   - 性能测试：确认网络性能恢复正常
   - 稳定性测试：连续运行24小时无异常

## 预防措施

### 定期维护
1. **硬件检查**
   - 每月检查设备运行状态
   - 每季度清洁散热系统
   - 每半年检测电源模块

2. **软件维护**
   - 定期更新固件版本
   - 优化配置参数
   - 备份配置文件

### 监控体系
1. **实时监控**
   - 设备运行状态监控
   - 网络性能监控
   - 环境参数监控

2. **告警机制**
   - 设置合理的告警阈值
   - 建立多级告警体系
   - 确保告警及时响应

### 应急预案
1. **人员准备**
   - 建立24小时值班制度
   - 培训应急处理技能
   - 明确责任分工

2. **设备准备**
   - 储备关键备件
   - 准备备用设备
   - 维护应急工具

## 经验总结

### 成功要素
1. **系统化方法**：采用标准化的故障诊断流程
2. **团队协作**：多部门协调配合
3. **工具支持**：使用专业测试设备
4. **经验积累**：借鉴以往类似案例

### 改进建议
1. **预防为主**：加强日常维护和监控
2. **快速响应**：建立更完善的应急机制
3. **知识共享**：建立故障案例库
4. **技能提升**：定期开展技术培训

### 推广价值
本案例的诊断方法和解决思路可以推广应用到类似的网络设备故障处理中，具有较强的实用性和指导意义。

## 技术要点详解

### 故障诊断方法论
1. **观察法**：通过观察设备外观、指示灯状态等获取初步信息
2. **测试法**：使用专业工具进行定量测试
3. **替换法**：通过替换可疑部件确认故障点
4. **分析法**：结合理论知识分析故障原因

### 测试工具使用技巧
1. **网络测试仪**
   - 正确连接测试线缆
   - 选择合适的测试模式
   - 解读测试结果数据

2. **万用表**
   - 安全操作规程
   - 测量精度要求
   - 数据记录方法

3. **示波器**
   - 信号捕获技巧
   - 波形分析方法
   - 参数设置要点

### 维修安全注意事项
1. **人身安全**
   - 断电操作
   - 防静电措施
   - 使用防护设备

2. **设备安全**
   - 正确的拆装顺序
   - 防止二次损坏
   - 保护重要数据

3. **环境安全**
   - 工作区域整洁
   - 工具摆放有序
   - 废料正确处理

2025年6月某日上午，播控中心接到报告，主要播出设备出现异常，信号质量下降，存在播出中断风险。技术人员需要快速定位问题并解决。

## 故障现象

1. **信号质量异常**：输出信号出现间歇性噪声
2. **设备温度升高**：核心处理单元温度超过正常范围
3. **系统响应缓慢**：操作界面反应迟钝

## 诊断过程

### 第一步：初步检查
- 检查设备外观，发现散热风扇运转异常
- 查看系统日志，发现多条温度报警记录
- 测试各个接口连接状态

### 第二步：深入分析
- 使用专业测试仪器检测信号质量
- 分析温度传感器数据变化趋势
- 检查电源供应稳定性

### 第三步：问题定位
经过系统性排查，确定问题根源：
1. 散热系统故障导致设备过热
2. 过热引起处理器性能下降
3. 性能下降影响信号处理质量

## 解决方案

### 紧急处理
1. **立即启动备用设备**，确保播出不中断
2. **降低设备负载**，减少发热量
3. **加强通风**，临时改善散热条件

### 根本解决
1. **更换故障风扇**：选用高性能静音风扇
2. **清理散热器**：彻底清除灰尘积累
3. **优化散热设计**：增加散热片面积
4. **升级监控系统**：增加温度预警功能

## 实施效果

- **故障排除时间**：从发现到解决仅用时2小时
- **设备温度**：恢复到正常范围（45-55°C）
- **信号质量**：完全恢复，无噪声干扰
- **系统稳定性**：连续运行30天无故障

## 经验总结

### 成功要素
1. **快速响应**：建立了完善的故障报告机制
2. **系统诊断**：采用标准化的故障排查流程
3. **备用方案**：确保了播出安全的连续性
4. **根本解决**：不仅解决当前问题，还预防了类似故障

### 改进措施
1. **预防性维护**：制定定期清洁和检查计划
2. **监控升级**：增加更多传感器和预警机制
3. **培训加强**：提升技术人员故障诊断能力
4. **文档完善**：建立详细的故障处理知识库

## 适用场景

本案例的诊断方法和解决思路适用于：
- 各类播控设备故障排查
- 散热相关的设备问题
- 信号质量异常的处理
- 紧急故障的应急响应

## 相关资料

- 设备维护手册 v2.1
- 故障诊断流程图
- 温度监控系统说明书
- 应急响应预案
    `
  },
  "2": {
    title: "操作流程优化实践",
    category: "最新案例", 
    publishDate: "2025-06-10",
    rating: 4.5,
    author: "运维部 - 李主管",
    readTime: "12分钟",
    tags: ["流程优化", "效率提升"],
    color: "#4ade80",
    icon: "Settings",
    summary: "通过对现有操作流程的分析和改进，提高了工作效率并减少了错误率，本案例详细记录了整个优化过程和实施方案，为类似场景提供参考。",
    content: `
## 项目背景

随着业务量的增长，原有的操作流程已经无法满足高效工作的需求，需要对现有流程进行系统性优化。

## 现状分析

### 存在问题
1. 操作步骤繁琐，耗时较长
2. 人工操作容易出错
3. 流程不够标准化
4. 缺乏有效的质量控制

### 数据统计
- 平均操作时间：45分钟
- 错误率：8.5%
- 返工率：12%
- 人员满意度：65%

## 优化方案

### 流程简化
1. **合并重复步骤**：将相似操作合并处理
2. **自动化改进**：引入自动化工具减少人工操作
3. **标准化模板**：制定统一的操作模板
4. **质量检查点**：在关键节点增加质量控制

### 技术支持
1. **工具升级**：采用更先进的操作工具
2. **系统集成**：打通各个系统间的数据流
3. **界面优化**：改进用户操作界面
4. **培训加强**：提升操作人员技能水平

## 实施过程

### 第一阶段：试点实施
- 选择典型场景进行试点
- 收集反馈意见
- 调整优化方案

### 第二阶段：全面推广
- 制定详细的实施计划
- 组织全员培训
- 建立监督机制

### 第三阶段：持续改进
- 定期评估效果
- 收集改进建议
- 不断完善流程

## 实施效果

### 效率提升
- 操作时间缩短至25分钟（减少44%）
- 错误率降低至3.2%（减少62%）
- 返工率降低至4%（减少67%）
- 人员满意度提升至85%

### 质量改善
- 操作标准化程度大幅提升
- 质量控制更加有效
- 问题发现和解决更及时

## 经验分享

### 关键成功因素
1. **领导支持**：获得管理层的充分支持
2. **全员参与**：调动所有相关人员的积极性
3. **循序渐进**：采用分阶段实施的策略
4. **持续改进**：建立长效的改进机制

### 注意事项
1. **充分调研**：深入了解现状和需求
2. **风险控制**：制定应急预案
3. **培训到位**：确保人员能力匹配
4. **监督检查**：建立有效的监督机制
    `
  },
  "security-incident": {
    title: "网络安全事件应急响应",
    category: "安全案例",
    publishDate: "2025-06-20",
    rating: 4.9,
    author: "安全部 - 李专家",
    authorTitle: "网络安全专家",
    authorExperience: "15年",
    readTime: "25分钟",
    difficulty: "hard",
    tags: ["网络安全", "应急响应", "事件处理", "风险控制"],
    color: "#dc2626",
    icon: "Shield",
    summary: "本案例记录了一次重大网络安全事件的完整应急响应过程，从事件发现、影响评估、应急处置到事后分析的全流程管理。",
    stats: {
      views: 3521,
      likes: 234,
      bookmarks: 156,
      shares: 67,
      comments: 89,
      difficulty: 4,
      completionRate: 76
    } as CaseStats,
    learningObjectives: [
      "掌握网络安全事件应急响应流程",
      "学会快速评估安全事件影响范围",
      "理解安全事件处置的关键步骤",
      "培养安全风险管控能力"
    ],
    prerequisites: [
      "网络安全基础知识",
      "系统管理经验",
      "应急响应理论基础"
    ],
    keyPoints: [
      "事件发现与报告机制",
      "影响范围快速评估",
      "应急响应团队协调",
      "证据保全与分析"
    ],
    content: `
## 事件背景

### 事件概述
2025年6月某日凌晨2:30，公司安全监控系统发现异常网络流量，经初步分析疑似遭受APT攻击。攻击者试图通过钓鱼邮件获取员工凭据，进而渗透内网系统。

### 影响评估
- **系统影响**：涉及邮件系统、文件服务器、数据库系统
- **数据风险**：可能涉及客户信息、财务数据、技术资料
- **业务影响**：部分业务系统暂停服务
- **时间窗口**：攻击持续约6小时

### 发现过程
1. **自动告警**：SIEM系统检测到异常登录行为
2. **人工确认**：安全分析师验证告警真实性
3. **初步分析**：确认为针对性攻击
4. **启动应急**：激活安全事件应急响应流程

## 应急响应流程

### 第一阶段：事件确认与分级
1. **事件确认**
   - 收集告警信息
   - 分析攻击特征
   - 确认攻击真实性
   - 评估攻击复杂度

2. **事件分级**
   根据公司安全事件分级标准，将此次事件定级为"重大安全事件"：
   - 涉及核心业务系统
   - 可能造成数据泄露
   - 影响范围较大
   - 需要高级别响应

3. **团队组建**
   - 事件指挥官：安全总监
   - 技术负责人：高级安全工程师
   - 业务联络人：各部门代表
   - 外部支持：安全厂商专家

### 第二阶段：遏制与隔离
1. **网络隔离**
   - 隔离受影响的网络段
   - 阻断可疑外联通信
   - 加强边界防护
   - 监控横向移动

2. **系统加固**
   - 强制密码重置
   - 禁用可疑账户
   - 更新安全策略
   - 部署临时防护措施

3. **证据保全**
   - 保存系统日志
   - 镜像关键磁盘
   - 记录网络流量
   - 截图保存现场

### 第三阶段：根除与恢复
1. **威胁清除**
   - 查杀恶意软件
   - 清理后门程序
   - 修复系统漏洞
   - 更新安全补丁

2. **系统恢复**
   - 从备份恢复数据
   - 重建受损系统
   - 验证系统完整性
   - 恢复业务服务

3. **安全验证**
   - 全面安全扫描
   - 渗透测试验证
   - 监控异常行为
   - 确认威胁清除

### 第四阶段：事后分析
1. **攻击路径分析**
   - 梳理攻击时间线
   - 分析攻击技术手段
   - 识别攻击者意图
   - 评估损失程度

2. **安全改进**
   - 修复安全漏洞
   - 完善防护体系
   - 优化监控规则
   - 加强人员培训

## 技术分析详解

### 攻击技术分析
1. **初始入侵**
   - 钓鱼邮件投递
   - 恶意附件执行
   - 凭据窃取
   - 权限提升

2. **横向移动**
   - 内网侦察
   - 漏洞利用
   - 权限扩展
   - 持久化驻留

3. **数据窃取**
   - 敏感数据定位
   - 数据打包压缩
   - 隐蔽外传通道
   - 痕迹清理

### 防护技术应用
1. **检测技术**
   - 行为分析
   - 异常检测
   - 威胁情报
   - 机器学习

2. **防护技术**
   - 端点防护
   - 网络隔离
   - 访问控制
   - 数据加密

3. **响应技术**
   - 自动化响应
   - 威胁狩猎
   - 取证分析
   - 恢复重建

## 管理流程优化

### 组织架构
1. **应急响应团队**
   - 指挥决策层
   - 技术执行层
   - 业务协调层
   - 外部支持层

2. **职责分工**
   - 明确角色定位
   - 细化工作职责
   - 建立汇报机制
   - 确保协调配合

### 流程标准化
1. **响应流程**
   - 标准化操作步骤
   - 明确时间要求
   - 规范文档记录
   - 建立检查机制

2. **沟通机制**
   - 内部沟通渠道
   - 外部通报流程
   - 媒体应对策略
   - 客户告知方案

### 能力建设
1. **人员培训**
   - 定期应急演练
   - 技能培训提升
   - 经验交流分享
   - 认证资质获取

2. **工具平台**
   - 应急响应平台
   - 威胁情报系统
   - 取证分析工具
   - 协作沟通工具

## 经验教训总结

### 成功经验
1. **快速响应**：在事件发生后30分钟内启动应急响应
2. **有效协调**：各部门密切配合，信息共享及时
3. **技术支撑**：专业工具和技术手段发挥关键作用
4. **外部支持**：及时引入外部专业力量

### 改进方向
1. **预防能力**：加强员工安全意识培训
2. **检测能力**：优化安全监控规则和算法
3. **响应能力**：完善应急响应流程和工具
4. **恢复能力**：提升业务连续性保障水平

### 推广价值
本案例展示了完整的网络安全事件应急响应流程，对于建立和完善企业安全应急响应体系具有重要参考价值。

## 法律合规考虑

### 合规要求
1. **数据保护法规**
   - 个人信息保护
   - 数据泄露通报
   - 监管部门报告
   - 用户权益保障

2. **行业标准**
   - 等级保护要求
   - 行业安全标准
   - 国际标准对标
   - 最佳实践参考

### 责任界定
1. **内部责任**
   - 管理责任
   - 技术责任
   - 操作责任
   - 监督责任

2. **外部责任**
   - 供应商责任
   - 合作伙伴责任
   - 第三方服务责任
   - 监管合规责任
    `
  },
  "process-optimization": {
    title: "业务流程优化实践",
    category: "管理案例",
    publishDate: "2025-06-25",
    rating: 4.7,
    author: "运营部 - 王经理",
    authorTitle: "运营总监",
    authorExperience: "12年",
    readTime: "18分钟",
    difficulty: "medium",
    tags: ["流程优化", "效率提升", "管理创新", "数字化转型"],
    color: "#059669",
    icon: "TrendingUp",
    summary: "本案例详细介绍了某企业业务流程数字化改造的完整过程，通过流程梳理、系统集成、自动化改造等手段，显著提升了业务效率。",
    stats: {
      views: 2156,
      likes: 128,
      bookmarks: 76,
      shares: 34,
      comments: 52,
      difficulty: 3,
      completionRate: 91
    } as CaseStats,
    learningObjectives: [
      "掌握业务流程分析方法",
      "学会流程优化设计思路",
      "理解数字化转型要点",
      "培养项目管理能力"
    ],
    prerequisites: [
      "业务流程基础知识",
      "项目管理经验",
      "数字化工具了解"
    ],
    keyPoints: [
      "现状分析与问题识别",
      "流程重新设计",
      "技术方案选择",
      "变革管理实施"
    ],
    content: `
## 项目背景

### 业务现状
公司原有的订单处理流程涉及多个部门，包括销售、财务、仓储、物流等，整个流程耗时长、效率低，客户满意度不高。

### 主要问题
1. **流程冗长**：从订单接收到发货需要5-7个工作日
2. **信息孤岛**：各部门系统独立，数据不互通
3. **人工操作多**：大量重复性手工操作
4. **错误率高**：人工处理容易出错
5. **可视化差**：无法实时跟踪订单状态

### 改进目标
- 缩短订单处理时间至2-3个工作日
- 减少人工操作环节50%以上
- 降低订单错误率至1%以下
- 提升客户满意度至95%以上
- 建立全流程可视化监控

## 分析诊断阶段

### 现状调研
1. **流程梳理**
   - 绘制现有流程图
   - 识别关键节点
   - 分析时间消耗
   - 找出瓶颈环节

2. **数据收集**
   - 订单处理时间统计
   - 各环节耗时分析
   - 错误类型统计
   - 客户投诉分析

3. **系统现状**
   - 现有系统清单
   - 系统功能分析
   - 集成现状评估
   - 技术架构梳理

### 问题根因分析
1. **流程层面**
   - 审批环节过多
   - 部门间协调不畅
   - 标准化程度低
   - 异常处理机制不完善

2. **系统层面**
   - 系统间缺乏集成
   - 数据标准不统一
   - 自动化程度低
   - 实时性不足

3. **管理层面**
   - 绩效考核不合理
   - 培训体系不完善
   - 变革意识不强
   - 协作文化缺失

## 解决方案设计

### 流程重设计
1. **简化流程**
   - 合并相似环节
   - 减少审批层级
   - 并行处理优化
   - 异常流程标准化

2. **角色重定义**
   - 明确岗位职责
   - 优化人员配置
   - 建立协作机制
   - 设计激励措施

3. **标准化建设**
   - 制定操作标准
   - 建立质量标准
   - 设计考核标准
   - 完善培训标准

### 技术方案
1. **系统集成**
   - 建立统一数据平台
   - 实现系统间互联
   - 统一用户界面
   - 建立主数据管理

2. **流程自动化**
   - 自动订单分配
   - 智能库存检查
   - 自动发货通知
   - 异常自动预警

3. **移动化支持**
   - 移动端审批
   - 实时状态查询
   - 移动端操作
   - 消息推送通知

### 实施策略
1. **分阶段实施**
   - 第一阶段：核心流程优化
   - 第二阶段：系统集成实现
   - 第三阶段：移动化扩展
   - 第四阶段：智能化升级

2. **试点推广**
   - 选择典型业务试点
   - 验证方案可行性
   - 收集反馈意见
   - 完善解决方案

## 实施过程管理

### 项目组织
1. **项目团队**
   - 项目经理：统筹协调
   - 业务专家：需求分析
   - 技术专家：方案实现
   - 用户代表：测试验收

2. **治理结构**
   - 项目指导委员会
   - 项目管理办公室
   - 专业工作小组
   - 用户支持团队

### 变革管理
1. **沟通策略**
   - 高层支持表态
   - 全员宣贯培训
   - 定期进展通报
   - 成功案例分享

2. **培训计划**
   - 管理层培训
   - 操作人员培训
   - 系统使用培训
   - 持续改进培训

3. **激励措施**
   - 绩效考核调整
   - 奖励机制设计
   - 职业发展规划
   - 团队建设活动

### 风险控制
1. **技术风险**
   - 系统兼容性风险
   - 数据迁移风险
   - 性能稳定性风险
   - 安全保障风险

2. **业务风险**
   - 业务中断风险
   - 用户接受度风险
   - 流程适应性风险
   - 绩效下降风险

3. **管理风险**
   - 资源投入风险
   - 进度延期风险
   - 成本超支风险
   - 变革阻力风险

## 效果评估

### 量化指标
1. **效率指标**
   - 订单处理时间：从5-7天缩短至2-3天
   - 人工操作减少：减少60%
   - 处理能力提升：提升80%
   - 系统响应时间：平均2秒内

2. **质量指标**
   - 订单错误率：从5%降至0.8%
   - 客户投诉率：减少70%
   - 数据准确率：提升至99.5%
   - 系统可用性：达到99.9%

3. **成本指标**
   - 人力成本：节省30%
   - 运营成本：降低25%
   - IT维护成本：减少40%
   - 总体ROI：达到300%

### 定性效果
1. **用户体验**
   - 操作更加便捷
   - 信息更加透明
   - 响应更加及时
   - 服务更加专业

2. **管理效果**
   - 决策更加科学
   - 监控更加实时
   - 协调更加顺畅
   - 创新更加活跃

## 持续改进

### 监控机制
1. **实时监控**
   - 关键指标监控
   - 异常情况预警
   - 性能趋势分析
   - 用户满意度跟踪

2. **定期评估**
   - 月度效果评估
   - 季度深度分析
   - 年度全面回顾
   - 持续改进计划

### 优化升级
1. **功能优化**
   - 用户反馈收集
   - 功能需求分析
   - 优化方案设计
   - 迭代升级实施

2. **技术升级**
   - 新技术跟踪
   - 技术可行性评估
   - 升级方案制定
   - 平滑迁移实施

## 推广应用

### 经验总结
1. **成功要素**
   - 高层强力支持
   - 全员积极参与
   - 技术方案合理
   - 实施策略得当

2. **关键环节**
   - 需求分析要充分
   - 方案设计要合理
   - 实施过程要可控
   - 效果评估要客观

### 推广策略
1. **内部推广**
   - 其他业务流程
   - 其他业务部门
   - 其他分支机构
   - 其他关联企业

2. **外部分享**
   - 行业交流分享
   - 最佳实践发布
   - 标杆案例展示
   - 咨询服务输出
    `
  }
}

export default function CaseDetailScreen({ caseId, onBack }: CaseDetailProps) {
  // 状态管理
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showRelated, setShowRelated] = useState(false)
  const [currentSection, setCurrentSection] = useState('content')
  const [readingProgress, setReadingProgress] = useState(0)
  const [fontSize, setFontSize] = useState('medium')
  const [darkMode, setDarkMode] = useState(false)
  const [showPrintPreview, setShowPrintPreview] = useState(false)
  const [expandedComments, setExpandedComments] = useState<string[]>([])
  const [newComment, setNewComment] = useState('')
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({})
  const [viewCount, setViewCount] = useState(0)
  const [learningProgress, setLearningProgress] = useState<LearningProgress>({
    currentStep: 1,
    totalSteps: 5,
    completedSections: [],
    timeSpent: 0,
    lastAccessed: new Date().toISOString()
  })

  // 获取案例数据，添加默认stats
  const caseInfo = caseData[caseId as keyof typeof caseData] || {
    ...caseData["1"],
    stats: {
      views: 1234,
      likes: 56,
      bookmarks: 23,
      shares: 12,
      comments: 18,
      difficulty: 2,
      completionRate: 85
    } as CaseStats
  }

  // 模拟用户交互数据
  const [userStats, setUserStats] = useState({
    totalCasesRead: 23,
    totalTimeSpent: 145, // 分钟
    favoriteCategories: ['技术案例', '安全案例'],
    recentActivity: [
      { action: '阅读案例', case: '设备故障诊断', time: '2小时前' },
      { action: '收藏案例', case: '网络安全响应', time: '1天前' },
      { action: '评论案例', case: '流程优化实践', time: '2天前' }
    ]
  })

  // 页面加载效果
  useEffect(() => {
    // 模拟页面访问统计
    setViewCount(prev => prev + 1)

    // 模拟阅读进度跟踪
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 交互处理函数
  const handleLike = () => {
    setIsLiked(!isLiked)
    // 这里可以调用API更新点赞状态
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // 这里可以调用API更新收藏状态
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: caseInfo.title,
        text: caseInfo.summary,
        url: window.location.href
      })
    } else {
      // 降级处理：复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }

  const handlePrint = () => {
    setShowPrintPreview(true)
    setTimeout(() => {
      window.print()
      setShowPrintPreview(false)
    }, 100)
  }

  const handleCommentLike = (commentId: string) => {
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }

  const handleCommentExpand = (commentId: string) => {
    setExpandedComments(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    )
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      // 这里可以调用API添加评论
      console.log('添加评论:', newComment)
      setNewComment('')
    }
  }

  // 渲染评论组件
  const renderComments = () => (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
          讨论区 ({mockComments.length})
        </h3>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
        >
          {showComments ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showComments ? '收起' : '展开'}
        </button>
      </div>

      {showComments && (
        <div className="space-y-4">
          {/* 添加评论 */}
          <div className="border-b border-gray-200 pb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="分享你的想法..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                发表评论
              </button>
            </div>
          </div>

          {/* 评论列表 */}
          {mockComments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    <span className="text-sm text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <button
                      onClick={() => handleCommentLike(comment.id)}
                      className={`flex items-center space-x-1 ${
                        commentLikes[comment.id] ? 'text-red-600' : 'text-gray-500'
                      } hover:text-red-600`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.likes + (commentLikes[comment.id] ? 1 : 0)}</span>
                    </button>
                    {comment.replies && comment.replies.length > 0 && (
                      <button
                        onClick={() => handleCommentExpand(comment.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {expandedComments.includes(comment.id) ? '收起回复' : `查看回复 (${comment.replies.length})`}
                      </button>
                    )}
                  </div>

                  {/* 回复 */}
                  {comment.replies && expandedComments.includes(comment.id) && (
                    <div className="mt-3 ml-4 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900 text-sm">{reply.author}</span>
                              <span className="text-xs text-gray-500">{reply.timestamp}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MotionDiv>
  )

  // 渲染相关推荐组件
  const renderRelatedCases = () => (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
          相关推荐
        </h3>
        <button
          onClick={() => setShowRelated(!showRelated)}
          className="text-green-600 hover:text-green-700 flex items-center text-sm"
        >
          {showRelated ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showRelated ? '收起' : '展开'}
        </button>
      </div>

      {showRelated && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedCases.map((relatedCase) => (
            <div
              key={relatedCase.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{relatedCase.title}</h4>
                <span className={`px-2 py-1 rounded text-xs ${
                  relatedCase.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  relatedCase.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {relatedCase.difficulty === 'easy' ? '简单' :
                   relatedCase.difficulty === 'medium' ? '中等' : '困难'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{relatedCase.category}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {relatedCase.readTime}
                </span>
                <span className="flex items-center">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  {relatedCase.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </MotionDiv>
  )

  return (
    <MotionDiv
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gray-50"
    >
      {/* 增强的头部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* 主导航栏 */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              返回案例库
            </button>

            {/* 功能按钮组 */}
            <div className="flex items-center space-x-2">
              {/* 点赞按钮 */}
              <button
                onClick={handleLike}
                className={`p-2 rounded-lg transition-colors ${
                  isLiked ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                }`}
                title="点赞"
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              {/* 收藏按钮 */}
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked ? 'text-yellow-500 bg-yellow-50' : 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50'
                }`}
                title="收藏"
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              {/* 分享按钮 */}
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="分享"
              >
                <Share2 className="h-5 w-5" />
              </button>

              {/* 打印按钮 */}
              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                title="打印"
              >
                <Printer className="h-5 w-5" />
              </button>

              {/* 外部链接 */}
              <button
                className="p-2 text-gray-600 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                title="在新窗口打开"
              >
                <ExternalLink className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 阅读进度条 */}
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
          </div>

          {/* 案例统计信息 */}
          <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {(caseInfo as any).stats?.views?.toLocaleString() || '1,234'} 阅读
              </span>
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {(caseInfo as any).stats?.likes || 56} 点赞
              </span>
              <span className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {(caseInfo as any).stats?.comments || 18} 评论
              </span>
              <span className="flex items-center">
                <Bookmark className="h-4 w-4 mr-1" />
                {(caseInfo as any).stats?.bookmarks || 23} 收藏
              </span>
            </div>

            {/* 阅读设置 */}
            <div className="flex items-center space-x-2">
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="small">小字体</option>
                <option value="medium">中字体</option>
                <option value="large">大字体</option>
              </select>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-1 text-gray-600 hover:text-gray-900 rounded"
                title="切换主题"
              >
                {darkMode ? '🌞' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 案例内容 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 学习进度指示器 */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              学习进度
            </h3>
            <span className="text-sm text-blue-700">
              {learningProgress.currentStep} / {learningProgress.totalSteps} 完成
            </span>
          </div>

          <div className="w-full bg-blue-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(learningProgress.currentStep / learningProgress.totalSteps) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: learningProgress.totalSteps }, (_, i) => (
              <div
                key={i}
                className={`text-center p-2 rounded-lg text-sm ${
                  i < learningProgress.currentStep
                    ? 'bg-blue-600 text-white'
                    : i === learningProgress.currentStep
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-600'
                    : 'bg-white text-gray-500'
                }`}
              >
                {i < learningProgress.currentStep && <CheckCircle className="h-4 w-4 mx-auto mb-1" />}
                步骤 {i + 1}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-blue-700">
            <span>已学习时间: {Math.floor(learningProgress.timeSpent / 60)}分钟</span>
            <span>最后访问: {new Date(learningProgress.lastAccessed).toLocaleDateString()}</span>
          </div>
        </MotionDiv>

        {/* 案例头部信息 */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-100"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: caseInfo.color }}
                >
                  {caseInfo.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {caseInfo.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {caseInfo.summary}
              </p>
            </div>
          </div>

          {/* 案例元信息 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="text-sm">{caseInfo.publishDate}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <User className="h-5 w-5 mr-2" />
              <span className="text-sm">{caseInfo.author}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span className="text-sm">{caseInfo.readTime}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-2 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{caseInfo.rating}</span>
            </div>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mt-6">
            {caseInfo.tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </MotionDiv>

        {/* 案例正文 */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: caseInfo.content.replace(/\n/g, '<br>').replace(/## /g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900">').replace(/### /g, '<h3 class="text-xl font-semibold mt-6 mb-3 text-gray-800">').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/- /g, '• ')
              }}
            />
          </div>
        </MotionDiv>

        {/* 案例统计和互动区域 */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            案例数据分析
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {(caseInfo as any).stats?.views?.toLocaleString() || '2,847'}
              </div>
              <div className="text-sm text-blue-700 mt-1">总阅读量</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {(caseInfo as any).stats?.completionRate || 87}%
              </div>
              <div className="text-sm text-green-700 mt-1">完成率</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {(caseInfo as any).stats?.likes || 156}
              </div>
              <div className="text-sm text-purple-700 mt-1">点赞数</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {(caseInfo as any).stats?.difficulty || 3}/5
              </div>
              <div className="text-sm text-orange-700 mt-1">难度评级</div>
            </div>
          </div>

          {/* 用户反馈区域 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">用户反馈</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">5.0</span>
                </div>
                <p className="text-sm text-gray-700">"内容详实，步骤清晰，很有实用价值！"</p>
                <p className="text-xs text-gray-500 mt-2">- 技术工程师 李明</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                  <span className="ml-2 text-sm text-gray-600">4.0</span>
                </div>
                <p className="text-sm text-gray-700">"案例分析透彻，建议增加更多实际操作截图。"</p>
                <p className="text-xs text-gray-500 mt-2">- 运维专员 张华</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">5.0</span>
                </div>
                <p className="text-sm text-gray-700">"非常实用的案例，已经在实际工作中应用了。"</p>
                <p className="text-xs text-gray-500 mt-2">- 系统管理员 王强</p>
              </div>
            </div>
          </div>
        </MotionDiv>

        {/* 评论区域 */}
        {renderComments()}

        {/* 相关推荐 */}
        <div className="mt-8">
          {renderRelatedCases()}
        </div>

        {/* 学习建议和下一步 */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border border-green-100 mt-8"
        >
          <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            学习建议与下一步
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-3">巩固练习</h4>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  <span className="text-sm">重复案例中的关键步骤</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  <span className="text-sm">在模拟环境中进行实践</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  <span className="text-sm">记录学习笔记和心得</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-green-800 mb-3">进阶学习</h4>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start">
                  <Target className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  <span className="text-sm">学习相关的高级技术</span>
                </li>
                <li className="flex items-start">
                  <Target className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  <span className="text-sm">参与实际项目应用</span>
                </li>
                <li className="flex items-start">
                  <Target className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                  <span className="text-sm">分享经验给其他同事</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-green-900">继续学习路径</h5>
                <p className="text-sm text-green-700 mt-1">基于你的学习进度，我们推荐以下内容</p>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                查看推荐
              </button>
            </div>
          </div>
        </MotionDiv>

        {/* 页脚信息 */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <span>最后更新: {caseInfo.publishDate}</span>
            <span>•</span>
            <span>阅读时长: {caseInfo.readTime}</span>
            <span>•</span>
            <span>案例编号: {caseId}</span>
          </div>
          <div className="mt-4 text-xs">
            <p>本案例内容仅供学习参考，实际应用时请结合具体情况进行调整</p>
          </div>
        </div>
      </div>
    </MotionDiv>
  )
}
