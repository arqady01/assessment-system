"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  HelpCircle
} from "lucide-react"

interface Option {
  id: string
  content: string
  isSelected?: boolean
}

interface Question {
  id: string
  title: string
  content: string
  type: string
  difficulty: string
  explanation: string
  category: {
    id: string
    name: string
    color: string
  }
  options: Option[]
}

export default function QuestionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const questionId = params.id as string
  
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  // 获取题目详情
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`/api/questions/${questionId}`)
        if (response.ok) {
          const data = await response.json()
          setQuestion(data.question)
        }
      } catch (error) {
        console.error('获取题目失败:', error)
      } finally {
        setLoading(false)
      }
    }

    if (questionId) {
      fetchQuestion()
    }
  }, [questionId])

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return

    if (question?.type === 'SINGLE_CHOICE') {
      setSelectedOptions([optionId])
    } else if (question?.type === 'MULTIPLE_CHOICE') {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId))
      } else {
        setSelectedOptions([...selectedOptions, optionId])
      }
    } else if (question?.type === 'TRUE_FALSE') {
      setSelectedOptions([optionId])
    }
  }

  const handleSubmit = async () => {
    if (!question || selectedOptions.length === 0) return

    try {
      const response = await fetch(`/api/questions/${questionId}/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedOptions,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsCorrect(data.isCorrect)
        setIsSubmitted(true)
        setShowExplanation(true)

        // 记录答题结果
        await fetch(`/api/questions/${questionId}/result`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isCorrect: data.isCorrect,
            selectedOptions,
          }),
        })
      }
    } catch (error) {
      console.error('提交答案失败:', error)
    }
  }

  const handleNextQuestion = async () => {
    try {
      const response = await fetch(`/api/questions/next?currentId=${questionId}&categoryId=${question?.category.id}`)
      if (response.ok) {
        const data = await response.json()
        if (data.nextQuestion) {
          router.push(`/questions/${data.nextQuestion.id}`)
          // 重置状态
          setSelectedOptions([])
          setIsSubmitted(false)
          setIsCorrect(false)
          setShowExplanation(false)
        } else {
          // 没有下一题，返回列表
          router.push(`/questions?categoryId=${question?.category.id}`)
        }
      }
    } catch (error) {
      console.error('获取下一题失败:', error)
    }
  }

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

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">题目不存在</h2>
          <p className="text-gray-600 mb-6">无法找到该题目，可能已被删除或您没有访问权限</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            返回上一页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
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
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-gray-900">
                {question.category.name}
              </h1>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
                {getDifficultyLabel(question.difficulty)}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1">
              {question.type === 'SINGLE_CHOICE' ? '单选题' : 
               question.type === 'MULTIPLE_CHOICE' ? '多选题' : '判断题'}
            </p>
          </div>
          
          <motion.button
            className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bookmark className="h-5 w-5 text-gray-600" />
          </motion.button>
        </motion.div>

        {/* Question Content */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {question.title}
          </h2>
          <p className="text-gray-700 mb-6">
            {question.content}
          </p>
          
          <div className="space-y-3">
            {question.options.map((option) => (
              <motion.div
                key={option.id}
                className={`p-4 rounded-xl border ${
                  selectedOptions.includes(option.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${
                  isSubmitted && selectedOptions.includes(option.id) && isCorrect
                    ? 'bg-green-50 border-green-500'
                    : isSubmitted && selectedOptions.includes(option.id) && !isCorrect
                    ? 'bg-red-50 border-red-500'
                    : ''
                } cursor-pointer transition-all duration-200`}
                whileHover={!isSubmitted ? { scale: 1.01 } : {}}
                whileTap={!isSubmitted ? { scale: 0.99 } : {}}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className="flex items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    selectedOptions.includes(option.id)
                      ? isSubmitted
                        ? isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isSubmitted ? (
                      selectedOptions.includes(option.id) ? (
                        isCorrect ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )
                      ) : (
                        <span className="text-xs">{String.fromCharCode(65 + question.options.indexOf(option))}</span>
                      )
                    ) : (
                      <span className="text-xs">{String.fromCharCode(65 + question.options.indexOf(option))}</span>
                    )}
                  </div>
                  <span className="text-gray-700">{option.content}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Explanation */}
        {isSubmitted && showExplanation && (
          <motion.div
            className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 ${
              isCorrect ? 'border-green-200' : 'border-red-200'
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="flex items-center space-x-3 mb-4">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <h3 className="text-lg font-semibold text-green-700">回答正确</h3>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-700">回答错误</h3>
                </>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">解析</h4>
              <p className="text-gray-700">{question.explanation}</p>
            </div>
            
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm">有用</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
                  <ThumbsDown className="h-4 w-4" />
                  <span className="text-sm">无用</span>
                </button>
              </div>
              
              <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors">
                <HelpCircle className="h-4 w-4" />
                <span className="text-sm">报告问题</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          className="flex justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOptions.length === 0}
              className={`w-full py-4 rounded-2xl font-medium text-white ${
                selectedOptions.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              提交答案
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full py-4 rounded-2xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>下一题</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
