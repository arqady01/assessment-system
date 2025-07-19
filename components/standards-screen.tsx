"use client"

import {
  Search,
  Clock,
  ArrowRight,
  ChevronRight,
  Shield,
  AlertTriangle,
  Zap,
  ChevronDown,
  BookOpen,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Standard {
  id: string
  title: string
  description: string
  content: string
  profession: string
  category: string
  version: string
  createdAt: string
  updatedAt: string
}

export default function StandardsScreen() {
  const [selectedCategory, setSelectedCategory] = useState("tv")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [standards, setStandards] = useState<Standard[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const categoryLabels = {
    tv: "电视播控",
    radio: "广播播控",
    tech: "技术运维",
  }

  // 获取操作规范数据
  useEffect(() => {
    fetchStandards()
  }, [selectedCategory])

  const fetchStandards = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/standards?profession=${selectedCategory}`)
      if (response.ok) {
        const data = await response.json()
        setStandards(data.standards || [])
      }
    } catch (error) {
      console.error('获取操作规范失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 处理文档点击
  const handleDocumentClick = (standardId: string) => {
    router.push(`/standards/${standardId}`)
  }

  // 过滤搜索结果
  const filteredStandards = standards.filter(standard =>
    standard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    standard.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 获取图标和颜色
  const getIconAndColor = (category: string, index: number) => {
    const icons = [BookOpen, Shield, AlertTriangle, BookOpen, Zap]
    const colors = [
      { from: '#4ade80', to: '#22c55e', bg: '#4ade80' },
      { from: '#0ea5e9', to: '#22d3ee', bg: '#0ea5e9' },
      { from: '#f59e0b', to: '#d97706', bg: '#f59e0b' },
      { from: '#8b5cf6', to: '#a855f7', bg: '#8b5cf6' },
      { from: '#ef4444', to: '#dc2626', bg: '#ef4444' }
    ]

    const IconComponent = icons[index % icons.length]
    const color = colors[index % colors.length]

    return { IconComponent, color }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#4ade80]/20 rounded-xl pl-10 sm:pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4ade80] text-gray-800 placeholder-gray-400 shadow-sm text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black">
            {categoryLabels[selectedCategory as keyof typeof categoryLabels]}规范
          </h2>
          <button className="text-black flex items-center text-xs sm:text-sm">
            查看全部
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4ade80]"></div>
          </div>
        ) : filteredStandards.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无操作规范文档</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredStandards.map((standard, index) => {
              const { IconComponent, color } = getIconAndColor(standard.category, index)
              return (
                <div
                  key={standard.id}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 hover:border-gray-200 transition-colors group shadow-sm hover:shadow-md cursor-pointer"
                  onClick={() => handleDocumentClick(standard.id)}
                >
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mr-4 sm:mr-6 shadow-md group-hover:shadow-lg transition-shadow"
                      style={{
                        background: `linear-gradient(to bottom right, ${color.from}, ${color.to})`
                      }}
                    >
                      <IconComponent className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base sm:text-xl mb-0.5 sm:mb-1 text-gray-800">
                        {standard.title}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        最后更新: {formatDate(standard.updatedAt)}
                      </p>
                    </div>
                    <button
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors"
                      style={{ backgroundColor: `${color.bg}10` }}
                    >
                      <ArrowRight
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        style={{ color: color.bg }}
                      />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>




    </div>
  )
}

