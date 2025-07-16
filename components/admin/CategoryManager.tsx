"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import CategoryModal from "./CategoryModal"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  FolderOpen,
  BookOpen,
  Zap,
  Shield,
  Flame,
  Award,
  Settings,
  Users
} from "lucide-react"

interface Category {
  id: string
  name: string
  description: string
  profession: string
  color: string
  icon: string
  createdAt: string
  _count: {
    questions: number
  }
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProfession, setSelectedProfession] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('获取分类失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('确定要删除这个分类吗？')) return

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        setCategories(categories.filter(c => c.id !== id))
        alert('删除成功')
      } else {
        alert(data.error || '删除失败')
      }
    } catch (error) {
      alert('删除失败')
    }
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProfession = !selectedProfession || category.profession === selectedProfession
    return matchesSearch && matchesProfession
  })

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      BookOpen,
      Zap,
      Shield,
      Flame,
      Award,
      Settings,
      Users,
      FolderOpen
    }
    return icons[iconName] || BookOpen
  }

  const getProfessionText = (profession: string) => {
    switch (profession) {
      case 'tv': return '电视播控'
      case 'radio': return '广播播控'
      case 'tech': return '技术运维'
      default: return profession
    }
  }

  const professions = [
    { value: 'tv', label: '电视播控' },
    { value: 'radio', label: '广播播控' },
    { value: 'tech', label: '技术运维' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">分类管理</h2>
          <p className="text-gray-600 mt-1">管理题目分类和专业方向</p>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-emerald-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-5 w-5" />
          <span>添加分类</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索分类..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">所有专业</option>
              {professions.map((profession) => (
                <option key={profession.value} value={profession.value}>
                  {profession.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            分类列表 ({filteredCategories.length})
          </h3>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>暂无分类</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredCategories.map((category, index) => {
              const IconComponent = getIconComponent(category.icon)
              
              return (
                <motion.div
                  key={category.id}
                  className="group bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: category.color + '20', color: category.color }}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        onClick={() => setEditingCategory(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => deleteCategory(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {category.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {getProfessionText(category.profession)}
                      </p>
                    </div>

                    {category.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-500">
                        {category._count.questions} 个题目
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || editingCategory) && (
          <CategoryModal
            category={editingCategory}
            onClose={() => {
              setShowCreateModal(false)
              setEditingCategory(null)
            }}
            onSave={() => {
              fetchCategories()
              setShowCreateModal(false)
              setEditingCategory(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
