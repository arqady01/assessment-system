"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import QuestionModal from "./QuestionModal"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  BookOpen,
  CheckCircle,
  XCircle
} from "lucide-react"

interface Question {
  id: string
  title: string
  content: string
  type: string
  difficulty: string
  explanation?: string
  category: {
    id: string
    name: string
    profession: string
  }
  options: Array<{
    id: string
    content: string
    isCorrect: boolean
  }>
  _count: {
    examResults: number
    favorites: number
  }
}

interface Category {
  id: string
  name: string
  profession: string
}

export default function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    fetchQuestions()
    fetchCategories()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions')
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
      }
    } catch (error) {
      console.error('获取题目失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  const deleteQuestion = async (id: string) => {
    if (!confirm('确定要删除这个题目吗？')) return

    try {
      const response = await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setQuestions(questions.filter(q => q.id !== id))
        alert('删除成功')
      } else {
        alert('删除失败')
      }
    } catch (error) {
      alert('删除失败')
    }
  }

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || question.category.id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'text-green-600 bg-green-100'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
      case 'HARD': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return '简单'
      case 'MEDIUM': return '中等'
      case 'HARD': return '困难'
      default: return '未知'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'SINGLE_CHOICE': return '单选题'
      case 'MULTIPLE_CHOICE': return '多选题'
      case 'TRUE_FALSE': return '判断题'
      case 'FILL_BLANK': return '填空题'
      default: return '未知'
    }
  }

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
          <h2 className="text-2xl font-bold text-gray-900">题目管理</h2>
          <p className="text-gray-600 mt-1">管理系统中的所有题目</p>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-5 w-5" />
          <span>添加题目</span>
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
                placeholder="搜索题目..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">所有分类</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            题目列表 ({filteredQuestions.length})
          </h3>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>暂无题目</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                className="p-6 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {question.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
                        {getDifficultyText(question.difficulty)}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                        {getTypeText(question.type)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {question.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>分类: {question.category.name}</span>
                      <span>答题次数: {question._count.examResults}</span>
                      <span>收藏次数: {question._count.favorites}</span>
                      <span>选项数: {question.options.length}</span>
                    </div>

                    {/* Options Preview */}
                    <div className="mt-3 space-y-1">
                      {question.options.slice(0, 2).map((option, idx) => (
                        <div key={option.id} className="flex items-center space-x-2 text-sm">
                          {option.isCorrect ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-300" />
                          )}
                          <span className={option.isCorrect ? 'text-green-700 font-medium' : 'text-gray-600'}>
                            {option.content}
                          </span>
                        </div>
                      ))}
                      {question.options.length > 2 && (
                        <div className="text-xs text-gray-400">
                          还有 {question.options.length - 2} 个选项...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <motion.button
                      onClick={() => setEditingQuestion(question)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => deleteQuestion(question.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || editingQuestion) && (
          <QuestionModal
            question={editingQuestion}
            categories={categories}
            onClose={() => {
              setShowCreateModal(false)
              setEditingQuestion(null)
            }}
            onSave={() => {
              fetchQuestions()
              setShowCreateModal(false)
              setEditingQuestion(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
