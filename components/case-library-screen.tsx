import { Search, Filter, BookOpen, Star, ChevronRight, Settings, Zap, Shield, Monitor, Cpu, HardDrive } from "lucide-react"
import { useState } from "react"
import CaseDetailScreen from "./case-detail-screen"

export default function CaseLibraryScreen() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)

  // 如果选中了案例，显示详情页面
  if (selectedCaseId) {
    return (
      <CaseDetailScreen
        caseId={selectedCaseId}
        onBack={() => setSelectedCaseId(null)}
      />
    )
  }
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
            案例库
          </h1>
        </div>
        <button className="bg-white hover:bg-gray-50 text-[#0ea5e9] p-2 sm:p-3 rounded-full text-sm font-medium border border-[#0ea5e9]/30 shadow-sm transition-colors">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </header>

      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="text-[#0ea5e9] h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <input
          type="text"
          placeholder="搜索案例..."
          className="w-full bg-white border border-[#0ea5e9]/20 rounded-xl pl-10 sm:pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] text-gray-800 placeholder-gray-400 shadow-sm text-sm sm:text-base"
        />
      </div>

      <div className="flex overflow-x-auto space-x-2 sm:space-x-3 py-2 -mx-4 px-4 scrollbar-hide">
        <button className="bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm whitespace-nowrap shadow-md">
          全部
        </button>
        <button className="bg-white hover:bg-gray-50 border border-[#0ea5e9]/20 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm whitespace-nowrap shadow-sm transition-colors">
          经典案例
        </button>
        <button className="bg-white hover:bg-gray-50 border border-[#0ea5e9]/20 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm whitespace-nowrap shadow-sm transition-colors">
          常见问题
        </button>
        <button className="bg-white hover:bg-gray-50 border border-[#0ea5e9]/20 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm whitespace-nowrap shadow-sm transition-colors">
          疑难解析
        </button>
        <button className="bg-white hover:bg-gray-50 border border-[#0ea5e9]/20 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm whitespace-nowrap shadow-sm transition-colors">
          最新案例
        </button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div
          onClick={() => setSelectedCaseId("1")}
          className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#0ea5e9]/10 hover:border-[#0ea5e9]/30 transition-colors group shadow-sm hover:shadow-md cursor-pointer"
        >
          <div className="h-40 sm:h-56 bg-gradient-to-br from-[#0ea5e9] to-[#22d3ee]/70 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/circuit-board.svg')] opacity-10" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
              <HardDrive className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
            </div>
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 backdrop-blur-sm text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md">
              经典案例
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
              <h3 className="text-lg sm:text-2xl font-bold text-white">设备故障诊断与排除</h3>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm text-gray-500">发布于 2025-06-15</span>
              <div className="flex items-center text-[#0ea5e9]">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-[#0ea5e9] stroke-none mr-1" />
                <span className="text-xs sm:text-sm">4.8</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
              本案例详细分析了一次复杂设备故障的诊断过程，包括初步判断、测试方法和最终解决方案。通过系统化的故障排查流程，提高了维修效率和准确率。
            </p>
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#0ea5e9]/10 text-[#0ea5e9] text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#0ea5e9]/10">
                  设备维护
                </span>
                <span className="bg-[#0ea5e9]/10 text-[#0ea5e9] text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#0ea5e9]/10">
                  故障排除
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedCaseId("1")
                }}
                className="text-[#0ea5e9] font-medium flex items-center text-xs sm:text-sm hover:text-[#0284c7] transition-colors"
              >
                查看详情
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        <div
          onClick={() => setSelectedCaseId("2")}
          className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#4ade80]/10 hover:border-[#4ade80]/30 transition-colors group shadow-sm hover:shadow-md cursor-pointer"
        >
          <div className="h-40 sm:h-56 bg-gradient-to-br from-[#4ade80] to-[#22c55e]/70 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/flow-pattern.svg')] opacity-10" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
              <Settings className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
            </div>
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 backdrop-blur-sm text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md">
              最新案例
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
              <h3 className="text-lg sm:text-2xl font-bold text-white">操作流程优化实践</h3>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm text-gray-500">发布于 2025-06-10</span>
              <div className="flex items-center text-[#4ade80]">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-[#4ade80] stroke-none mr-1" />
                <span className="text-xs sm:text-sm">4.5</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
              通过对现有操作流程的分析和改进，提高了工作效率并减少了错误率，本案例详细记录了整个优化过程和实施方案，为类似场景提供参考。
            </p>
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#4ade80]/10 text-[#4ade80] text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#4ade80]/10">
                  流程优化
                </span>
                <span className="bg-[#4ade80]/10 text-[#4ade80] text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#4ade80]/10">
                  效率提升
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedCaseId("2")
                }}
                className="text-[#4ade80] font-medium flex items-center text-xs sm:text-sm hover:text-[#22c55e] transition-colors"
              >
                查看详情
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* 第三个案例 - 安全监控系统 */}
        <div
          onClick={() => setSelectedCaseId("1")}
          className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#f59e0b]/10 hover:border-[#f59e0b]/30 transition-colors group shadow-sm hover:shadow-md cursor-pointer"
        >
          <div className="h-40 sm:h-56 bg-gradient-to-br from-[#f59e0b] to-[#d97706]/70 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/security-pattern.svg')] opacity-10" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
              <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
            </div>
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 backdrop-blur-sm text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md">
              安全案例
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
              <h3 className="text-lg sm:text-2xl font-bold text-white">播出安全监控系统升级</h3>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm text-gray-500">发布于 2025-05-25</span>
              <div className="flex items-center text-[#f59e0b]">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-[#f59e0b] stroke-none mr-1" />
                <span className="text-xs sm:text-sm">4.7</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
              详细介绍了播出安全监控系统的升级改造过程，包括新增的实时监控功能、预警机制和应急响应流程，有效提升了播出安全保障能力。
            </p>
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#f59e0b]/10 text-[#f59e0b] text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#f59e0b]/10">
                  安全监控
                </span>
                <span className="bg-[#f59e0b]/10 text-[#f59e0b] text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#f59e0b]/10">
                  系统升级
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedCaseId("1")
                }}
                className="text-[#f59e0b] font-medium flex items-center text-xs sm:text-sm hover:text-[#d97706] transition-colors"
              >
                查看详情
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* 第四个案例 - 网络优化 */}
        <div
          onClick={() => setSelectedCaseId("2")}
          className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#8b5cf6]/10 hover:border-[#8b5cf6]/30 transition-colors group shadow-sm hover:shadow-md cursor-pointer"
        >
          <div className="h-40 sm:h-56 bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]/70 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/network-pattern.svg')] opacity-10" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
              <Monitor className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
            </div>
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 backdrop-blur-sm text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md">
              技术案例
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
              <h3 className="text-lg sm:text-2xl font-bold text-white">网络传输优化方案</h3>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm text-gray-500">发布于 2025-06-01</span>
              <div className="flex items-center text-[#8b5cf6]">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-[#8b5cf6] stroke-none mr-1" />
                <span className="text-xs sm:text-sm">4.6</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
              针对网络传输延迟和丢包问题，制定了综合优化方案，通过调整网络参数、优化传输协议和增加冗余链路，显著提升了传输质量。
            </p>
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#8b5cf6]/10 text-[#8b5cf6] text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#8b5cf6]/10">
                  网络优化
                </span>
                <span className="bg-[#8b5cf6]/10 text-[#8b5cf6] text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#8b5cf6]/10">
                  传输技术
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedCaseId("2")
                }}
                className="text-[#8b5cf6] font-medium flex items-center text-xs sm:text-sm hover:text-[#7c3aed] transition-colors"
              >
                查看详情
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* 第五个案例 - 应急处理 */}
        <div
          onClick={() => setSelectedCaseId("1")}
          className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#ef4444]/10 hover:border-[#ef4444]/30 transition-colors group shadow-sm hover:shadow-md cursor-pointer"
        >
          <div className="h-40 sm:h-56 bg-gradient-to-br from-[#ef4444] to-[#dc2626]/70 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/emergency-pattern.svg')] opacity-10" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
              <Zap className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
            </div>
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 backdrop-blur-sm text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md">
              应急案例
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
              <h3 className="text-lg sm:text-2xl font-bold text-white">突发断电应急处理</h3>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm text-gray-500">发布于 2025-05-30</span>
              <div className="flex items-center text-[#ef4444]">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-[#ef4444] stroke-none mr-1" />
                <span className="text-xs sm:text-sm">4.9</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
              记录了一次突发断电事故的完整应急处理过程，从故障发现到快速切换备用电源，再到恢复正常播出，整个过程仅用时3分钟，展现了优秀的应急响应能力。
            </p>
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#ef4444]/10 text-[#ef4444] text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#ef4444]/10">
                  应急处理
                </span>
                <span className="bg-[#ef4444]/10 text-[#ef4444] text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#ef4444]/10">
                  断电故障
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedCaseId("1")
                }}
                className="text-[#ef4444] font-medium flex items-center text-xs sm:text-sm hover:text-[#dc2626] transition-colors"
              >
                查看详情
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* 第六个案例 - 系统维护 */}
        <div
          onClick={() => setSelectedCaseId("2")}
          className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#06b6d4]/10 hover:border-[#06b6d4]/30 transition-colors group shadow-sm hover:shadow-md cursor-pointer"
        >
          <div className="h-40 sm:h-56 bg-gradient-to-br from-[#06b6d4] to-[#0891b2]/70 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/maintenance-pattern.svg')] opacity-10" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
              <Cpu className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
            </div>
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 backdrop-blur-sm text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md">
              维护案例
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
              <h3 className="text-lg sm:text-2xl font-bold text-white">系统定期维护实践</h3>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="text-xs sm:text-sm text-gray-500">发布于 2025-06-08</span>
              <div className="flex items-center text-[#06b6d4]">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-[#06b6d4] stroke-none mr-1" />
                <span className="text-xs sm:text-sm">4.4</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
              分享了系统定期维护的最佳实践，包括维护计划制定、维护流程标准化、维护记录管理等方面，为建立完善的维护体系提供了宝贵经验。
            </p>
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#06b6d4]/10 text-[#06b6d4] text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#06b6d4]/10">
                  系统维护
                </span>
                <span className="bg-[#06b6d4]/10 text-[#06b6d4] text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#06b6d4]/10">
                  最佳实践
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedCaseId("2")
                }}
                className="text-[#06b6d4] font-medium flex items-center text-xs sm:text-sm hover:text-[#0891b2] transition-colors"
              >
                查看详情
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

