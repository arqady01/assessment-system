"use client"

import { Settings, BookOpen, Star, LogOut, ArrowRight, ChevronRight, User, Shield, BookmarkIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import EditProfileModal from "./edit-profile-modal"

interface UserStats {
  totalAnswered: number
  correctAnswered: number
  favoriteCount: number
  completionRate: number
  recentActivity: number
}

export default function ProfileScreen() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    totalAnswered: 0,
    correctAnswered: 0,
    favoriteCount: 0,
    completionRate: 0,
    recentActivity: 0
  })
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/exam/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  const handleLogout = async () => {
    if (confirm('确定要退出登录吗？')) {
      await logout()
    }
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

  return (
    <motion.div
      {...({ className: "p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto" } as any)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Profile Header */}
      <motion.div
        {...({ className: "bg-white rounded-3xl shadow-lg border border-gray-100" } as any)}
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-8">
          <div className="flex items-center">
            <motion.div
              {...({ className: "w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-200" } as any)}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <User className="h-10 w-10 text-gray-600" />
            </motion.div>

            <div className="ml-6 flex-1">
              <motion.h2
                {...({ className: "text-3xl font-bold text-gray-900" } as any)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {user?.name || '用户'}
              </motion.h2>
              <motion.p
                {...({ className: "text-gray-600 text-lg" } as any)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {user?.profession === 'tv' ? '电视播控' :
                 user?.profession === 'radio' ? '广播播控' :
                 user?.profession === 'tech' ? '技术运维' : '学员'} ·
                {user?.role === 'ADMIN' ? '管理员' :
                 user?.role === 'TEACHER' ? '教师' : '学员'}
              </motion.p>
              <motion.div
                {...({ className: "flex flex-wrap items-center mt-3 gap-3" } as any)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {["技术专家", "培训师"].map((tag, index) => (
                  <motion.div
                    key={tag}
                    className="bg-blue-50 text-blue-600 rounded-full px-4 py-2 text-sm font-medium border border-blue-100"
                    whileHover={{ scale: 1.05, backgroundColor: "#dbeafe" }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    {tag}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-gray-50 hover:bg-gray-100 p-4 rounded-2xl border border-gray-200 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="h-6 w-6 text-gray-600" />
            </motion.button>
          </div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-3 gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {[
              {
                value: loading ? "..." : `${stats.completionRate}%`,
                label: "完成率",
                bgColor: "bg-gray-50",
                textColor: "text-blue-600",
                borderColor: "border-gray-100"
              },
              {
                value: loading ? "..." : stats.totalAnswered.toString(),
                label: "已完成题目",
                bgColor: "bg-gray-50",
                textColor: "text-purple-600",
                borderColor: "border-gray-100"
              },
              {
                value: loading ? "..." : stats.favoriteCount.toString(),
                label: "收藏数量",
                bgColor: "bg-gray-50",
                textColor: "text-emerald-600",
                borderColor: "border-gray-100"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className={`${stat.bgColor} rounded-2xl p-4 text-center border ${stat.borderColor}`}
                whileHover={{ scale: 1.02, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <motion.p
                  className={`text-3xl font-bold ${stat.textColor}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Learning Section */}
      <motion.div
        className="space-y-6"
        variants={itemVariants}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black">
            我的学习
          </h2>
          <motion.button
            className="text-black flex items-center text-sm font-medium hover:text-gray-700 transition-colors"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            查看全部
            <ChevronRight className="h-4 w-4 ml-1" />
          </motion.button>
        </div>

        <div className="space-y-4">
          {[
            {
              title: "学习记录",
              description: "查看您的学习历史和进度",
              icon: BookOpen,
              color: "blue",
              gradient: "from-blue-500 to-cyan-400"
            },
            {
              title: "积分明细",
              description: "查看您的积分获取和使用记录",
              icon: Star,
              color: "emerald",
              gradient: "from-emerald-500 to-green-400"
            },
            {
              title: "收藏内容",
              description: "管理您收藏的题目和案例",
              icon: BookmarkIcon,
              color: "purple",
              gradient: "from-purple-500 to-violet-400"
            }
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className="flex items-center">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-1 text-gray-800 group-hover:text-gray-900 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 group-hover:text-gray-600 transition-colors">
                      {item.description}
                    </p>
                  </div>

                  <motion.button
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      item.color === "blue" ? "bg-blue-50 hover:bg-blue-100 text-blue-600" :
                      item.color === "emerald" ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-600" :
                      "bg-purple-50 hover:bg-purple-100 text-purple-600"
                    }`}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowRight className="h-6 w-6" />
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>

      </motion.div>

      {/* Settings Section */}
      <motion.div
        className="space-y-6"
        variants={itemVariants}
      >
        <h2 className="text-2xl font-bold text-black">
          设置
        </h2>

        <div className="space-y-4">
          {[
            {
              title: "账号设置",
              description: "管理您的账号信息和安全设置",
              icon: Shield,
              color: "emerald",
              gradient: "from-emerald-500 to-green-400"
            },
            {
              title: "退出登录",
              description: "安全退出当前账号",
              icon: LogOut,
              color: "red",
              gradient: "from-red-500 to-red-400",
              isLogout: true
            }
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                onClick={item.isLogout ? handleLogout : () => setIsEditModalOpen(true)}
                className={`group bg-white rounded-3xl p-6 border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  item.isLogout ? "border-red-100 hover:border-red-200" : "border-gray-100"
                }`}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  boxShadow: item.isLogout
                    ? "0 20px 40px -12px rgba(239, 68, 68, 0.15)"
                    : "0 20px 40px -12px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <div className="flex items-center">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    whileHover={{ rotate: item.isLogout ? -10 : 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </motion.div>

                  <div className="flex-1">
                    <h3 className={`font-bold text-xl mb-1 transition-colors ${
                      item.isLogout ? "text-red-500 group-hover:text-red-600" : "text-gray-800 group-hover:text-gray-900"
                    }`}>
                      {item.title}
                    </h3>
                    <p className="text-gray-500 group-hover:text-gray-600 transition-colors">
                      {item.description}
                    </p>
                  </div>

                  {!item.isLogout && (
                    <motion.button
                      className="w-12 h-12 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* 编辑个人信息模态框 */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </motion.div>
  )
}
