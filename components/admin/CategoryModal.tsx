"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  X, 
  BookOpen,
  Zap,
  Shield,
  Flame,
  Award,
  Settings,
  Users,
  FolderOpen,
  Palette
} from "lucide-react"

interface Category {
  id: string
  name: string
  description: string
  profession: string
  color: string
  icon: string
}

interface CategoryModalProps {
  category?: Category | null
  onClose: () => void
  onSave: () => void
}

export default function CategoryModal({ category, onClose, onSave }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    profession: 'tv',
    color: '#3b82f6',
    icon: 'BookOpen'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        profession: category.profession,
        color: category.color,
        icon: category.icon
      })
    }
  }, [category])

  const professions = [
    { value: 'tv', label: '电视播控' },
    { value: 'radio', label: '广播播控' },
    { value: 'tech', label: '技术运维' }
  ]

  const icons = [
    { name: 'BookOpen', component: BookOpen, label: '书本' },
    { name: 'Zap', component: Zap, label: '闪电' },
    { name: 'Shield', component: Shield, label: '盾牌' },
    { name: 'Flame', component: Flame, label: '火焰' },
    { name: 'Award', component: Award, label: '奖章' },
    { name: 'Settings', component: Settings, label: '设置' },
    { name: 'Users', component: Users, label: '用户' },
    { name: 'FolderOpen', component: FolderOpen, label: '文件夹' }
  ]

  const colors = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
    '#ec4899', // pink
    '#6b7280'  // gray
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.name.trim()) {
        alert('请输入分类名称')
        return
      }

      const url = category 
        ? `/api/admin/categories/${category.id}`
        : '/api/admin/categories'
      
      const method = category ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        alert(category ? '更新成功' : '创建成功')
        onSave()
      } else {
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
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {category ? '编辑分类' : '创建分类'}
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
                分类名称 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入分类名称"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                专业方向 *
              </label>
              <select
                value={formData.profession}
                onChange={(e) => setFormData({...formData, profession: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {professions.map((profession) => (
                  <option key={profession.value} value={profession.value}>
                    {profession.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分类描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入分类描述（可选）"
            />
          </div>

          {/* 图标选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              选择图标
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {icons.map((icon) => {
                const IconComponent = icon.component
                const isSelected = formData.icon === icon.name
                
                return (
                  <motion.button
                    key={icon.name}
                    type="button"
                    onClick={() => setFormData({...formData, icon: icon.name})}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={icon.label}
                  >
                    <IconComponent
                      className={`h-6 w-6 mx-auto ${
                        isSelected ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    />
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* 颜色选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              选择颜色
            </label>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => {
                const isSelected = formData.color === color
                
                return (
                  <motion.button
                    key={color}
                    type="button"
                    onClick={() => setFormData({...formData, color})}
                    className={`w-10 h-10 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'border-gray-400 scale-110' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSelected && (
                      <div className="w-full h-full rounded-lg bg-white/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* 预览 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              预览效果
            </label>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: formData.color + '20', color: formData.color }}
                >
                  {(() => {
                    const IconComponent = icons.find(icon => icon.name === formData.icon)?.component || BookOpen
                    return <IconComponent className="h-6 w-6" />
                  })()}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {formData.name || '分类名称'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {professions.find(p => p.value === formData.profession)?.label}
                  </p>
                  {formData.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
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
              {loading ? '保存中...' : (category ? '更新' : '创建')}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
