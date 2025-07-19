"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import QuestionManager from "@/components/admin/QuestionManager"
import CategoryManager from "@/components/admin/CategoryManager"
import SystemSettings from "@/components/admin/SystemSettings"
import {
  Users,
  BookOpen,
  FileCheck,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react"

interface Stats {
  totalUsers: number
  totalQuestions: number
  totalExams: number
  totalCategories: number
}

export default function AdminPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalQuestions: 0,
    totalExams: 0,
    totalCategories: 0
  })

  useEffect(() => {
    // 这里应该从API获取统计数据
    // 暂时使用模拟数据
    setStats({
      totalUsers: 156,
      totalQuestions: 342,
      totalExams: 1248,
      totalCategories: 12
    })
  }, [])

  const tabs = [
    { id: "dashboard", label: "仪表板", icon: BarChart3 },
    { id: "users", label: "用户管理", icon: Users },
    { id: "questions", label: "题目管理", icon: BookOpen },
    { id: "categories", label: "分类管理", icon: FileCheck },
    { id: "settings", label: "系统设置", icon: Settings }
  ]

  const statCards = [
    {
      title: "总用户数",
      value: stats.totalUsers,
      icon: Users,
      color: "blue",
      change: "+12%"
    },
    {
      title: "题目总数",
      value: stats.totalQuestions,
      icon: BookOpen,
      color: "emerald",
      change: "+8%"
    },
    {
      title: "考试次数",
      value: stats.totalExams,
      icon: FileCheck,
      color: "purple",
      change: "+24%"
    },
    {
      title: "分类数量",
      value: stats.totalCategories,
      icon: BarChart3,
      color: "amber",
      change: "+2%"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3"
                whileHover={{ scale: 1.05 }}
              >
                <Settings className="h-5 w-5 text-white" />
              </motion.div>
              <h1 className="text-xl font-semibold text-gray-900">管理后台</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">欢迎，{user?.name}</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                    {tab.label}
                  </motion.button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "dashboard" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">系统概览</h2>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((card, index) => {
                      const Icon = card.icon
                      return (
                        <motion.div
                          key={index}
                          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                          whileHover={{ scale: 1.02, y: -4 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">{card.title}</p>
                              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                              <p className={`text-sm mt-1 ${
                                card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {card.change} 较上月
                              </p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              card.color === 'blue' ? 'bg-blue-100' :
                              card.color === 'emerald' ? 'bg-emerald-100' :
                              card.color === 'purple' ? 'bg-purple-100' : 'bg-amber-100'
                            }`}>
                              <Icon className={`h-6 w-6 ${
                                card.color === 'blue' ? 'text-blue-600' :
                                card.color === 'emerald' ? 'text-emerald-600' :
                                card.color === 'purple' ? 'text-purple-600' : 'text-amber-600'
                              }`} />
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
                    <div className="space-y-4">
                      {[
                        { action: "新用户注册", user: "张三", time: "2分钟前" },
                        { action: "题目被收藏", question: "电视播控基础知识", time: "5分钟前" },
                        { action: "完成考试", user: "李四", score: "85分", time: "10分钟前" },
                        { action: "新题目创建", question: "广播设备维护", time: "1小时前" }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            <span className="text-sm text-gray-600">{activity.action}</span>
                            {activity.user && (
                              <span className="text-sm font-medium text-gray-900 ml-1">
                                - {activity.user}
                              </span>
                            )}
                            {activity.question && (
                              <span className="text-sm font-medium text-gray-900 ml-1">
                                - {activity.question}
                              </span>
                            )}
                            {activity.score && (
                              <span className="text-sm font-medium text-green-600 ml-1">
                                ({activity.score})
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">用户管理</h2>
                  <motion.button
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="h-4 w-4" />
                    <span>添加用户</span>
                  </motion.button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">用户列表</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            用户
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            专业
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            角色
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            注册时间
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          { name: "张三", email: "zhang@example.com", profession: "电视播控", role: "学员", date: "2025-06-15" },
                          { name: "李四", email: "li@example.com", profession: "广播播控", role: "学员", date: "2025-06-14" },
                          { name: "王五", email: "wang@example.com", profession: "技术运维", role: "教师", date: "2025-06-13" }
                        ].map((user, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-medium">
                                    {user.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.profession}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === '管理员' ? 'bg-red-100 text-red-800' :
                                user.role === '教师' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-900">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "questions" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <QuestionManager />
              </motion.div>
            )}

            {activeTab === "categories" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CategoryManager />
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SystemSettings />
              </motion.div>
            )}

            {/* 其他标签页内容可以继续添加 */}
            {activeTab !== "dashboard" && activeTab !== "users" && activeTab !== "questions" && activeTab !== "categories" && activeTab !== "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <p className="text-gray-600">此功能正在开发中...</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
