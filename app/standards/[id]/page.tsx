'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Tag, 
  User,
  Download,
  Share2,
  BookOpen
} from 'lucide-react'

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

export default function StandardDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [standard, setStandard] = useState<Standard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchStandard(params.id as string)
    }
  }, [params.id])

  const fetchStandard = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/standards/${id}`)
      if (response.ok) {
        const data = await response.json()
        setStandard(data.standard)
      } else {
        console.error('获取操作规范失败')
      }
    } catch (error) {
      console.error('获取操作规范失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getProfessionLabel = (profession: string) => {
    const labels = {
      tv: '电视播控',
      radio: '广播播控',
      tech: '技术运维'
    }
    return labels[profession as keyof typeof labels] || profession
  }

  const getProfessionColor = (profession: string) => {
    const colors = {
      tv: 'from-[#22c55e] to-[#4ade80]',
      radio: 'from-[#0284c7] to-[#0ea5e9]',
      tech: 'from-[#f59e0b] to-[#d97706]'
    }
    return colors[profession as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ade80]"></div>
      </div>
    )
  }

  if (!standard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">文档不存在</h2>
          <p className="text-gray-500 mb-6">您访问的操作规范文档不存在或已被删除</p>
          <button
            onClick={() => router.back()}
            className="bg-[#4ade80] text-white px-6 py-2 rounded-lg hover:bg-[#22c55e] transition-colors"
          >
            返回上一页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                返回
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-800 truncate">
                {standard.title}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <Share2 className="h-5 w-5 mr-1" />
                分享
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <Download className="h-5 w-5 mr-1" />
                下载
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 文档内容 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* 文档头部 */}
              <div className="p-6 sm:p-8 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                      {standard.title}
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {standard.description}
                    </p>
                  </div>
                  <div className="ml-6">
                    <div className="bg-gradient-to-br from-[#4ade80] to-[#22c55e] w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    更新时间: {formatDate(standard.updatedAt)}
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    版本: {standard.version}
                  </div>
                </div>
              </div>

              {/* 文档正文 */}
              <div className="p-6 sm:p-8">
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                  dangerouslySetInnerHTML={{ 
                    __html: standard.content.replace(/\n/g, '<br>') 
                  }}
                />
              </div>
            </div>
          </div>

          {/* 侧边栏信息 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">文档信息</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">专业方向</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getProfessionColor(standard.profession)}`}>
                      {getProfessionLabel(standard.profession)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">文档分类</label>
                  <p className="mt-1 text-gray-900">{standard.category}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">创建时间</label>
                  <p className="mt-1 text-gray-900">{formatDate(standard.createdAt)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">最后更新</label>
                  <p className="mt-1 text-gray-900">{formatDate(standard.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
