"use client"

import {
  Search,
  FileText,
  Clock,
  ArrowRight,
  ChevronRight,
  Shield,
  AlertTriangle,
  Zap,
  ChevronDown,
  BookOpen,
} from "lucide-react"
import { useState } from "react"

export default function StandardsScreen() {
  const [selectedCategory, setSelectedCategory] = useState("tv")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const categoryLabels = {
    tv: "电视播控",
    radio: "广播播控",
    tech: "技术运维",
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#4ade80] to-[#22c55e] flex items-center justify-center shadow-md">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#22c55e] to-[#4ade80] bg-clip-text text-transparent">
            操作规范
          </h1>
        </div>
      </header>

      <div className="flex flex-col space-y-4">
        <div className="relative w-full">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white border border-[#4ade80]/30 rounded-xl px-4 py-3 text-left flex items-center justify-between shadow-sm hover:border-[#4ade80]/50 transition-colors"
          >
            <span className="text-gray-800 font-medium">
              {categoryLabels[selectedCategory as keyof typeof categoryLabels]}
            </span>
            <ChevronDown
              className={`h-5 w-5 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
              <button
                onClick={() => {
                  setSelectedCategory("tv")
                  setIsDropdownOpen(false)
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${selectedCategory === "tv" ? "text-[#4ade80] font-medium" : "text-gray-800"}`}
              >
                电视播控
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("radio")
                  setIsDropdownOpen(false)
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${selectedCategory === "radio" ? "text-[#4ade80] font-medium" : "text-gray-800"}`}
              >
                广播播控
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("tech")
                  setIsDropdownOpen(false)
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${selectedCategory === "tech" ? "text-[#4ade80] font-medium" : "text-gray-800"}`}
              >
                技术运维
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-[#4ade80] h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <input
            type="text"
            placeholder="搜索操作规范..."
            className="w-full bg-white border border-[#4ade80]/20 rounded-xl pl-10 sm:pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4ade80] text-gray-800 placeholder-gray-400 shadow-sm text-sm sm:text-base"
          />
        </div>
      </div>

      {selectedCategory === "tv" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[#22c55e] to-[#4ade80] bg-clip-text text-transparent">
              电视播控规范
            </h2>
            <button className="text-[#4ade80] flex items-center text-xs sm:text-sm">
              查看全部
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#4ade80]/10 hover:border-[#4ade80]/30 transition-colors group shadow-sm hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-[#4ade80] to-[#22c55e] w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-md group-hover:shadow-lg transition-shadow">
                  <FileText className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-xl mb-0.5 sm:mb-1 text-gray-800">电视播控基础操作规范</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">最后更新: 2025-06-12</p>
                </div>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#4ade80]/10 flex items-center justify-center group-hover:bg-[#4ade80]/20 transition-colors">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#4ade80]" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#0ea5e9]/10 hover:border-[#0ea5e9]/30 transition-colors group shadow-sm hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-[#0ea5e9] to-[#22d3ee] w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-md group-hover:shadow-lg transition-shadow">
                  <Shield className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-xl mb-0.5 sm:mb-1 text-gray-800">电视播出安全操作指南</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">最后更新: 2025-05-20</p>
                </div>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center group-hover:bg-[#0ea5e9]/20 transition-colors">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#0ea5e9]" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#4ade80]/10 hover:border-[#4ade80]/30 transition-colors group shadow-sm hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-[#4ade80] to-[#22c55e] w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-md group-hover:shadow-lg transition-shadow">
                  <AlertTriangle className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-xl mb-0.5 sm:mb-1 text-gray-800">
                    电视播出紧急情况处理流程
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm">最后更新: 2025-06-05</p>
                </div>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#4ade80]/10 flex items-center justify-center group-hover:bg-[#4ade80]/20 transition-colors">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#4ade80]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCategory === "radio" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] bg-clip-text text-transparent">
              广播播控规范
            </h2>
            <button className="text-[#0ea5e9] flex items-center text-xs sm:text-sm">
              查看全部
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#0ea5e9]/10 hover:border-[#0ea5e9]/30 transition-colors group shadow-sm hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-[#0ea5e9] to-[#22d3ee] w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-md group-hover:shadow-lg transition-shadow">
                  <BookOpen className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-xl mb-0.5 sm:mb-1 text-gray-800">广播播控基础操作规范</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">最后更新: 2025-05-18</p>
                </div>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center group-hover:bg-[#0ea5e9]/20 transition-colors">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#0ea5e9]" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#0ea5e9]/10 hover:border-[#0ea5e9]/30 transition-colors group shadow-sm hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-[#0ea5e9] to-[#22d3ee] w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-md group-hover:shadow-lg transition-shadow">
                  <Clock className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-xl mb-0.5 sm:mb-1 text-gray-800">广播设备维护规范</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">最后更新: 2025-05-22</p>
                </div>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center group-hover:bg-[#0ea5e9]/20 transition-colors">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#0ea5e9]" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#0ea5e9]/10 hover:border-[#0ea5e9]/30 transition-colors group shadow-sm hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-[#0ea5e9] to-[#22d3ee] w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-md group-hover:shadow-lg transition-shadow">
                  <AlertTriangle className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-xl mb-0.5 sm:mb-1 text-gray-800">广播播出应急预案</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">最后更新: 2025-06-15</p>
                </div>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center group-hover:bg-[#0ea5e9]/20 transition-colors">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#0ea5e9]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCategory === "tech" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">
              技术运维规范
            </h2>
            <button className="text-[#f59e0b] flex items-center text-xs sm:text-sm">
              查看全部
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#f59e0b]/10 hover:border-[#f59e0b]/30 transition-colors group shadow-sm hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-[#f59e0b] to-[#d97706] w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-md group-hover:shadow-lg transition-shadow">
                  <Shield className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-xl mb-0.5 sm:mb-1 text-gray-800">技术设备维护手册</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">最后更新: 2025-06-05</p>
                </div>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f59e0b]/10 flex items-center justify-center group-hover:bg-[#f59e0b]/20 transition-colors">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#f59e0b]" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#f59e0b]/10 hover:border-[#f59e0b]/30 transition-colors group shadow-sm hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-[#f59e0b] to-[#d97706] w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-md group-hover:shadow-lg transition-shadow">
                  <Zap className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-xl mb-0.5 sm:mb-1 text-gray-800">系统故障排查指南</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">最后更新: 2025-06-10</p>
                </div>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f59e0b]/10 flex items-center justify-center group-hover:bg-[#f59e0b]/20 transition-colors">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#f59e0b]" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#f59e0b]/10 hover:border-[#f59e0b]/30 transition-colors group shadow-sm hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-[#f59e0b] to-[#d97706] w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-md group-hover:shadow-lg transition-shadow">
                  <FileText className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-xl mb-0.5 sm:mb-1 text-gray-800">设备巡检标准流程</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">最后更新: 2025-05-28</p>
                </div>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f59e0b]/10 flex items-center justify-center group-hover:bg-[#f59e0b]/20 transition-colors">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#f59e0b]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

