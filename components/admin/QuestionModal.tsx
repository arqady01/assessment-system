"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Plus, Trash2, CheckCircle } from "lucide-react"

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
  }
  options: Array<{
    id: string
    content: string
    isCorrect: boolean
  }>
}

interface Category {
  id: string
  name: string
  profession: string
}

interface QuestionModalProps {
  question?: Question | null
  categories: Category[]
  onClose: () => void
  onSave: () => void
}

interface Option {
  content: string
  isCorrect: boolean
}

export default function QuestionModal({ question, categories, onClose, onSave }: QuestionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'SINGLE_CHOICE',
    difficulty: 'MEDIUM',
    explanation: '',
    categoryId: ''
  })
  const [options, setOptions] = useState<Option[]>([
    { content: '', isCorrect: false },
    { content: '', isCorrect: false }
  ])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (question) {
      setFormData({
        title: question.title,
        content: question.content,
        type: question.type,
        difficulty: question.difficulty,
        explanation: question.explanation || '',
        categoryId: question.category.id
      })
      setOptions(question.options.map(opt => ({
        content: opt.content,
        isCorrect: opt.isCorrect
      })))
    }
  }, [question])

  const addOption = () => {
    setOptions([...options, { content: '', isCorrect: false }])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, field: keyof Option, value: string | boolean) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    
    // 如果是单选题，确保只有一个正确答案
    if (field === 'isCorrect' && value && formData.type === 'SINGLE_CHOICE') {
      newOptions.forEach((opt, i) => {
        if (i !== index) opt.isCorrect = false
      })
    }
    
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 验证表单
      if (!formData.title || !formData.content || !formData.categoryId) {
        alert('请填写完整信息')
        return
      }

      if (options.some(opt => !opt.content.trim())) {
        alert('请填写所有选项内容')
        return
      }

      if (!options.some(opt => opt.isCorrect)) {
        alert('请至少选择一个正确答案')
        return
      }

      const url = question 
        ? `/api/admin/questions/${question.id}`
        : '/api/admin/questions'
      
      const method = question ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          options: options.filter(opt => opt.content.trim())
        }),
      })

      if (response.ok) {
        alert(question ? '更新成功' : '创建成功')
        onSave()
      } else {
        const data = await response.json()
        alert(data.error || '操作失败')
      }
    } catch (error) {
      alert('操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {question ? '编辑题目' : '创建题目'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                题目标题 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入题目标题"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类 *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">请选择分类</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.profession})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                题目类型
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="SINGLE_CHOICE">单选题</option>
                <option value="MULTIPLE_CHOICE">多选题</option>
                <option value="TRUE_FALSE">判断题</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                难度等级
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="EASY">简单</option>
                <option value="MEDIUM">中等</option>
                <option value="HARD">困难</option>
              </select>
            </div>
          </div>

          {/* 题目内容 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              题目内容 *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入题目内容"
              required
            />
          </div>

          {/* 选项 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                选项 * ({formData.type === 'SINGLE_CHOICE' ? '单选' : '多选'})
              </label>
              <button
                type="button"
                onClick={addOption}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>添加选项</span>
              </button>
            </div>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => updateOption(index, 'isCorrect', !option.isCorrect)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      option.isCorrect 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {option.isCorrect && <CheckCircle className="h-4 w-4" />}
                  </button>
                  
                  <input
                    type="text"
                    value={option.content}
                    onChange={(e) => updateOption(index, 'content', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`选项 ${index + 1}`}
                  />
                  
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 答案解析 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              答案解析
            </label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({...formData, explanation: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入答案解析（可选）"
            />
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              取消
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? '保存中...' : (question ? '更新' : '创建')}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
