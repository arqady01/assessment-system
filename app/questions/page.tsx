"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Star, 
  Filter,
  ChevronRight,
  Play,
  CheckCircle,
  AlertCircle,
  Zap
} from "lucide-react"

interface Question {
  id: string
  title: string
  content: string
  type: string
  difficulty: string
  category: {
    id: string
    name: string
    color: string
  }
  _count: {
    examResults: number
    favorites: number
  }
}

export default function QuestionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoryId')
  const profession = searchParams.get('profession')
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<any>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")

  // 获取题目列表
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const params = new URLSearchParams()
        if (categoryId) params.append('categoryId', categoryId)
        if (profession) params.append('profession', profession)
        if (selectedDifficulty) params.append('difficulty', selectedDifficulty)
        
        const response = await fetch(`/api/questions?${params.toString()}`)
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

    fetchQuestions()
  }, [categoryId, profession, selectedDifficulty])

  // 获取分类信息
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return
      
      try {
        const response = await fetch(`/api/categories/${categoryId}`)
        if (response.ok) {
          const data = await response.json()
          setCategory(data.category)
        }
      } catch (error) {
        console.error('获取分类信息失败:', error)
      }
    }

    fetchCategory()
  }, [categoryId])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'HARD':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return '简单'
      case 'MEDIUM':
        return '中等'
      case 'HARD':
        return '困难'
      default:
        return difficulty
    }
  }

  const handleQuestionClick = (questionId: string) => {
    router.push(`/questions/${questionId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载题目中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Header */}
        <motion.div 
          className="flex items-center space-x-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </motion.button>
          
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {category?.name || '题目练习'}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              共 {questions.length} 道题目
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">所有难度</option>
              <option value="EASY">简单</option>
              <option value="MEDIUM">中等</option>
              <option value="HARD">困难</option>
            </select>
          </div>
        </motion.div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.length === 0 ? (
            <motion.div 
              className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无题目</h3>
              <p className="text-gray-500">该分类下暂时没有题目，请选择其他分类</p>
            </motion.div>
          ) : (
            questions.map((question, index) => (
              <motion.div
                key={question.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuestionClick(question.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
                        {getDifficultyLabel(question.difficulty)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {question.type === 'SINGLE_CHOICE' ? '单选题' : 
                         question.type === 'MULTIPLE_CHOICE' ? '多选题' : '判断题'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {question.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {question.content}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>{question._count.favorites} 收藏</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>{question._count.examResults} 次练习</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors"
                    whileHover={{ rotate: 90 }}
                  >
                    <ChevronRight className="h-5 w-5 text-blue-600" />
                  </motion.div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
