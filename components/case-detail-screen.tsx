'use client'

import { ArrowLeft, Star, Calendar, Tag, User, Clock, BookOpen, Download, Share2, Heart } from "lucide-react"
import { motion } from "framer-motion"

interface CaseDetailProps {
  caseId: string
  onBack: () => void
}

// 模拟案例数据
const caseData = {
  "1": {
    title: "设备故障诊断与排除",
    category: "经典案例",
    publishDate: "2025-06-15",
    rating: 4.8,
    author: "技术部 - 张工程师",
    readTime: "15分钟",
    tags: ["设备维护", "故障排除"],
    color: "#0ea5e9",
    icon: "HardDrive",
    summary: "本案例详细分析了一次复杂设备故障的诊断过程，包括初步判断、测试方法和最终解决方案。通过系统化的故障排查流程，提高了维修效率和准确率。",
    content: `
## 案例背景

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
  }
}

export default function CaseDetailScreen({ caseId, onBack }: CaseDetailProps) {
  const caseInfo = caseData[caseId as keyof typeof caseData] || caseData["1"]

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gray-50"
    >
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回案例库
            </button>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-500 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-green-500 transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 案例内容 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 案例头部信息 */}
        <motion.div 
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
        </motion.div>

        {/* 案例正文 */}
        <motion.div 
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
        </motion.div>
      </div>
    </motion.div>
  )
}
