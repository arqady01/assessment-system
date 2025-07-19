'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Briefcase, Save, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// 添加动画样式
const animationStyles = `
  @keyframes wave1 {
    0% { transform: translateY(-20px) translateX(-10px) scale(1); }
    50% { transform: translateY(25px) translateX(15px) scale(1.1); }
    100% { transform: translateY(-20px) translateX(-10px) scale(1); }
  }
  @keyframes wave2 {
    0% { transform: translateY(-15px) translateX(10px) scale(1); }
    50% { transform: translateY(30px) translateX(-20px) scale(1.15); }
    100% { transform: translateY(-15px) translateX(10px) scale(1); }
  }
  @keyframes wave3 {
    0% { transform: translateY(-25px) translateX(5px) scale(1); }
    50% { transform: translateY(20px) translateX(25px) scale(1.05); }
    100% { transform: translateY(-25px) translateX(5px) scale(1); }
  }
  @keyframes wave4 {
    0% { transform: translateY(-18px) translateX(-5px) scale(1); }
    50% { transform: translateY(28px) translateX(-15px) scale(1.12); }
    100% { transform: translateY(-18px) translateX(-5px) scale(1); }
  }
`

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profession: user?.profession || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const professionOptions = [
    { value: 'tv', label: '电视播控' },
    { value: 'radio', label: '广播播控' },
    { value: 'tech', label: '技术运维' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await updateUser({
        name: formData.name.trim() || undefined,
        profession: formData.profession || undefined
      })
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : '更新失败')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 添加动画样式 */}
          <style dangerouslySetInnerHTML={{ __html: animationStyles }} />

          {/* 背景遮罩 */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 模态框 */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              className="relative w-full max-w-md mx-auto overflow-hidden rounded-3xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* 动态背景 blobs */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute w-32 h-32 rounded-full bg-orange-400 -top-10 -left-10 opacity-70"
                     style={{
                       animation: 'wave1 4s infinite alternate ease-in-out'
                     }} />
                <div className="absolute w-40 h-40 rounded-full bg-pink-400 -top-5 -right-15 opacity-60"
                     style={{
                       animation: 'wave2 5s infinite alternate ease-in-out 0.5s'
                     }} />
                <div className="absolute w-36 h-36 rounded-full bg-purple-400 -bottom-10 -left-15 opacity-65"
                     style={{
                       animation: 'wave3 4.5s infinite alternate ease-in-out 1s'
                     }} />
                <div className="absolute w-28 h-28 rounded-full bg-cyan-400 -bottom-5 -right-10 opacity-75"
                     style={{
                       animation: 'wave4 3.5s infinite alternate ease-in-out 1.5s'
                     }} />
              </div>

              {/* 毛玻璃效果层 */}
              <div className="absolute inset-0 backdrop-blur-xl bg-white/20 rounded-3xl" />

              {/* 内容容器 */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl m-2"
                   style={{ backdropFilter: 'blur(10px)' }}>
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">编辑个人信息</h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* 表单内容 */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <motion.div
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-red-600 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* 姓名输入 */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    姓名
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="请输入您的姓名"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>

                {/* 专业方向选择 */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                    专业方向
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {professionOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.profession === option.value
                            ? 'border-black bg-black/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="profession"
                          value={option.value}
                          checked={formData.profession === option.value}
                          onChange={(e) => handleInputChange('profession', e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          formData.profession === option.value
                            ? 'border-black bg-black'
                            : 'border-gray-300'
                        }`}>
                          {formData.profession === option.value && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className={`font-medium ${
                          formData.profession === option.value
                            ? 'text-black'
                            : 'text-gray-700'
                        }`}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 按钮组 */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        保存
                      </>
                    )}
                  </button>
                </div>
              </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
