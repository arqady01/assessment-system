"use client"

import { ArrowRight, Clock, Star, ChevronRight, Award, BookOpen, Shield, Flame } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  description: string
  profession: string
  color: string
  icon: string
  _count: {
    questions: number
  }
}

export default function PracticeScreen() {
  const router = useRouter()
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // 处理分类点击，跳转到题目列表页面
  const handleCategoryClick = (categoryId: string) => {
    router.push(`/questions?categoryId=${categoryId}&profession=${selectedProfession}`)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  }

  const professions = [
    {
      id: "tv",
      title: "电视播控",
      description: "电视播出控制相关题目",
      icon: BookOpen,
      color: "blue",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      id: "radio",
      title: "广播播控",
      description: "广播播出控制相关题目",
      icon: BookOpen,
      color: "emerald",
      gradient: "from-emerald-500 to-green-400"
    },
    {
      id: "tech",
      title: "技术运维", 
      description: "技术运维相关题目",
      icon: Shield,
      color: "amber",
      gradient: "from-amber-500 to-orange-400"
    }
  ]

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
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

    fetchCategories()
  }, [])

  // 根据选中的专业筛选分类
  const filteredCategories = selectedProfession 
    ? categories.filter(cat => cat.profession === selectedProfession)
    : []

  // 获取图标组件
  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      BookOpen,
      Shield,
      Flame,
      Award
    }
    return icons[iconName] || BookOpen
  }

  return (
    <motion.div 
      className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            做题练习
          </h1>
          <p className="text-gray-500 text-sm">提升专业技能，挑战自我</p>
        </div>
        
        <div className="flex space-x-3 w-full sm:w-auto">
          <motion.button 
            className="flex-1 sm:flex-none bg-white hover:bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl text-sm font-medium border border-blue-200 shadow-sm transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            历史记录
          </motion.button>
          <motion.button 
            className="flex-1 sm:flex-none bg-white hover:bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl text-sm font-medium border border-emerald-200 shadow-sm transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            收藏
          </motion.button>
        </div>
      </motion.header>

      {/* Professional Selection Section */}
      <motion.div 
        className="space-y-6"
        variants={itemVariants}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
            选择专业方向
          </h2>
          <p className="text-gray-600">请选择您的专业方向，开始专业技能提升之旅</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {professions.map((profession, index) => {
            const Icon = profession.icon
            const isSelected = selectedProfession === profession.id
            
            return (
              <motion.button
                key={profession.id}
                onClick={() => setSelectedProfession(profession.id)}
                className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 ${
                  isSelected
                    ? `border-${profession.color}-400 bg-gradient-to-r from-${profession.color}-50 to-${profession.color}-100/50 shadow-lg shadow-${profession.color}-200/50`
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${profession.gradient} rounded-full flex items-center justify-center shadow-lg`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Star className="h-3 w-3 text-white" />
                  </motion.div>
                )}

                <div className="flex items-center">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-4 transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-r ${profession.gradient} shadow-lg` 
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }`}
                    whileHover={{ rotate: 5 }}
                    animate={{ 
                      scale: isSelected ? 1.1 : 1,
                      rotate: isSelected ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ 
                      scale: { type: "spring", stiffness: 300, damping: 20 },
                      rotate: { duration: 0.6, ease: "easeInOut" }
                    }}
                  >
                    <Icon
                      className={`h-8 w-8 transition-colors duration-300 ${
                        isSelected ? "text-white" : "text-gray-600 group-hover:text-gray-700"
                      }`}
                    />
                  </motion.div>
                  
                  <div className="text-left flex-1">
                    <h3 className={`font-bold text-lg transition-colors duration-300 ${
                      isSelected 
                        ? profession.color === "blue" ? "text-blue-600" : 
                          profession.color === "emerald" ? "text-emerald-600" : "text-amber-600"
                        : "text-gray-800 group-hover:text-gray-900"
                    }`}>
                      {profession.title}
                    </h3>
                    <p className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors duration-300">
                      {profession.description}
                    </p>
                  </div>

                  <motion.div
                    className={`ml-4 transition-colors duration-300 ${
                      isSelected ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                    animate={{ x: isSelected ? 5 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Content based on selection */}
      <AnimatePresence>
        {selectedProfession && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Question Categories */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  题目分类
                </h2>
                <motion.button 
                  className="text-blue-600 flex items-center text-sm font-medium hover:text-blue-700 transition-colors"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  查看全部
                  <ChevronRight className="h-4 w-4 ml-1" />
                </motion.button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                  // 加载状态
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse">
                      <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((category, index) => {
                    const Icon = getIconComponent(category.icon)
                    
                    return (
                      <motion.div
                        key={category.id}
                        className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                        whileHover={{
                          scale: 1.05,
                          y: -8,
                          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        <motion.div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                          style={{ 
                            backgroundColor: category.color + '20',
                            color: category.color
                          }}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Icon className="h-8 w-8" />
                        </motion.div>
                        
                        <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-gray-900 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4 group-hover:text-gray-600 transition-colors">
                          {category.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium" style={{ color: category.color }}>
                            {category._count.questions}题
                          </span>
                          <motion.button
                            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300"
                            style={{ 
                              backgroundColor: category.color + '10',
                              color: category.color
                            }}
                            whileHover={{ 
                              scale: 1.1, 
                              rotate: 90,
                              backgroundColor: category.color + '20'
                            }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )
                  })
                ) : (
                  // 无分类状态
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">暂无题目分类</h3>
                    <p className="text-gray-500">该专业方向下还没有创建题目分类</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      <AnimatePresence>
        {!selectedProfession && (
          <motion.div
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            variants={itemVariants}
          >
            <motion.div 
              className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <BookOpen className="h-12 w-12 text-gray-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">请选择专业方向</h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
              请先选择您的专业方向，以获取相应的题目内容。不同专业的题目内容有所不同。
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
