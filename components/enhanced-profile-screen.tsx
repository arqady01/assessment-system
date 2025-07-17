'use client'

import { Settings, BookOpen, Star, LogOut, ArrowRight, ChevronRight, User, Shield, BookmarkIcon, Award, TrendingUp, Edit, Bell, Palette, Globe, HelpCircle, Clock, Target, BarChart3, Calendar, Trophy, Zap, Brain, Heart, Download, Share2, Camera, Mail, Phone, MapPin, Briefcase, GraduationCap, Users, MessageSquare, Bookmark, Eye, ThumbsUp, Gift, Crown, Medal, CheckCircle2, Activity, PieChart, LineChart, BarChart, TrendingDown, Plus, Filter, Search, MoreHorizontal } from "lucide-react"
import { MotionDiv, MotionButton, MotionH2, MotionP } from "@/lib/motion-wrapper"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

// 扩展学习统计接口
interface ExtendedLearningStats {
  totalCases: number
  completedCases: number
  totalHours: number
  currentStreak: number
  longestStreak: number
  averageScore: number
  totalPoints: number
  level: number
  nextLevelPoints: number
  weeklyGoal: number
  weeklyProgress: number
  monthlyProgress: number[]
  categoryProgress: { [key: string]: number }
  skillLevels: { [key: string]: number }
}

// 成就系统接口
interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'learning' | 'social' | 'milestone' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: string
  progress?: number
  maxProgress?: number
  points: number
}

// 活动记录接口
interface ActivityRecord {
  id: string
  type: 'case_completed' | 'achievement_unlocked' | 'comment_posted' | 'case_liked' | 'streak_milestone' | 'level_up' | 'badge_earned'
  title: string
  description: string
  timestamp: string
  points?: number
  relatedCase?: string
  icon?: string
  color?: string
}

// 学习目标接口
interface LearningGoal {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  deadline: string
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'completed' | 'paused'
}

// 模拟扩展学习数据
const mockExtendedStats: ExtendedLearningStats = {
  totalCases: 156,
  completedCases: 134,
  totalHours: 287,
  currentStreak: 12,
  longestStreak: 28,
  averageScore: 87.5,
  totalPoints: 15420,
  level: 8,
  nextLevelPoints: 2580,
  weeklyGoal: 10,
  weeklyProgress: 7,
  monthlyProgress: [85, 92, 78, 95, 88, 91, 87, 93, 89, 96, 84, 90],
  categoryProgress: {
    '技术案例': 85,
    '安全案例': 92,
    '管理案例': 78,
    '运维案例': 88
  },
  skillLevels: {
    '故障诊断': 4,
    '网络安全': 5,
    '系统管理': 3,
    '项目管理': 4,
    '团队协作': 5
  }
}

// 模拟成就数据
const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: '初学者',
    description: '完成第一个案例学习',
    icon: 'GraduationCap',
    category: 'learning',
    rarity: 'common',
    unlockedAt: '2025-06-01',
    points: 100
  },
  {
    id: '2',
    title: '连续学习者',
    description: '连续学习7天',
    icon: 'Calendar',
    category: 'milestone',
    rarity: 'rare',
    unlockedAt: '2025-06-15',
    points: 500
  },
  {
    id: '3',
    title: '技术专家',
    description: '在技术类案例中获得90%以上的平均分',
    icon: 'Crown',
    category: 'learning',
    rarity: 'epic',
    unlockedAt: '2025-07-01',
    points: 1000
  },
  {
    id: '4',
    title: '社交达人',
    description: '获得100个点赞',
    icon: 'Heart',
    category: 'social',
    rarity: 'rare',
    unlockedAt: '2025-07-10',
    points: 750
  },
  {
    id: '5',
    title: '传奇学者',
    description: '完成所有高难度案例',
    icon: 'Trophy',
    category: 'milestone',
    rarity: 'legendary',
    progress: 8,
    maxProgress: 10,
    points: 2000
  },
  {
    id: '6',
    title: '知识分享者',
    description: '发表10条有用的评论',
    icon: 'MessageSquare',
    category: 'social',
    rarity: 'rare',
    unlockedAt: '2025-07-05',
    points: 600
  },
  {
    id: '7',
    title: '完美主义者',
    description: '连续10个案例获得满分',
    icon: 'Target',
    category: 'learning',
    rarity: 'epic',
    progress: 7,
    maxProgress: 10,
    points: 1500
  },
  {
    id: '8',
    title: '时间管理大师',
    description: '在规定时间内完成50个案例',
    icon: 'Clock',
    category: 'milestone',
    rarity: 'rare',
    unlockedAt: '2025-06-28',
    points: 800
  }
]

// 模拟活动记录
const mockActivities: ActivityRecord[] = [
  {
    id: '1',
    type: 'case_completed',
    title: '完成案例学习',
    description: '成功完成"设备故障诊断与排除"案例',
    timestamp: '2025-07-17 14:30',
    points: 150,
    relatedCase: '设备故障诊断与排除',
    icon: 'CheckCircle2',
    color: 'green'
  },
  {
    id: '2',
    type: 'achievement_unlocked',
    title: '解锁成就',
    description: '获得"技术专家"成就',
    timestamp: '2025-07-16 09:15',
    points: 1000,
    icon: 'Crown',
    color: 'purple'
  },
  {
    id: '3',
    type: 'level_up',
    title: '等级提升',
    description: '恭喜升级到第8级！',
    timestamp: '2025-07-15 16:45',
    points: 500,
    icon: 'TrendingUp',
    color: 'blue'
  },
  {
    id: '4',
    type: 'streak_milestone',
    title: '连续学习里程碑',
    description: '连续学习12天，继续保持！',
    timestamp: '2025-07-14 20:00',
    points: 200,
    icon: 'Zap',
    color: 'orange'
  },
  {
    id: '5',
    type: 'comment_posted',
    title: '发表评论',
    description: '在"网络安全事件应急响应"案例中发表了有价值的评论',
    timestamp: '2025-07-13 11:20',
    points: 50,
    relatedCase: '网络安全事件应急响应',
    icon: 'MessageSquare',
    color: 'blue'
  },
  {
    id: '6',
    type: 'case_liked',
    title: '获得点赞',
    description: '你的学习笔记获得了5个点赞',
    timestamp: '2025-07-12 15:30',
    points: 25,
    icon: 'Heart',
    color: 'red'
  }
]

// 模拟学习目标
const mockGoals: LearningGoal[] = [
  {
    id: '1',
    title: '本月完成10个案例',
    description: '提升技术能力，完成更多实践案例',
    targetValue: 10,
    currentValue: 7,
    deadline: '2025-07-31',
    category: '学习进度',
    priority: 'high',
    status: 'active'
  },
  {
    id: '2',
    title: '获得网络安全专家认证',
    description: '通过所有网络安全相关案例',
    targetValue: 15,
    currentValue: 12,
    deadline: '2025-08-15',
    category: '技能认证',
    priority: 'medium',
    status: 'active'
  },
  {
    id: '3',
    title: '连续学习30天',
    description: '养成良好的学习习惯',
    targetValue: 30,
    currentValue: 12,
    deadline: '2025-08-01',
    category: '学习习惯',
    priority: 'high',
    status: 'active'
  },
  {
    id: '4',
    title: '提升平均分到90分',
    description: '在所有类型案例中保持高水平表现',
    targetValue: 90,
    currentValue: 87.5,
    deadline: '2025-09-01',
    category: '学习质量',
    priority: 'medium',
    status: 'active'
  }
]

export default function EnhancedProfileScreen() {
  const { user, logout } = useAuth()
  
  // 状态管理
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'history' | 'goals' | 'analytics' | 'settings'>('overview')
  const [extendedStats] = useState<ExtendedLearningStats>(mockExtendedStats)
  const [achievements] = useState<Achievement[]>(mockAchievements)
  const [activities] = useState<ActivityRecord[]>(mockActivities)
  const [goals] = useState<LearningGoal[]>(mockGoals)
  const [showAllAchievements, setShowAllAchievements] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // 动画变体
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
        stiffness: 100,
        damping: 15
      }
    }
  }

  const handleLogout = async () => {
    if (confirm('确定要退出登录吗？')) {
      await logout()
    }
  }

  // 获取成就稀有度颜色
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100'
      case 'rare': return 'text-blue-600 bg-blue-100'
      case 'epic': return 'text-purple-600 bg-purple-100'
      case 'legendary': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <MotionDiv
      className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 顶部导航标签 */}
        <MotionDiv
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2"
          variants={itemVariants}
        >
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: '概览', icon: User },
              { id: 'achievements', label: '成就', icon: Trophy },
              { id: 'history', label: '历史', icon: Clock },
              { id: 'goals', label: '目标', icon: Target },
              { id: 'analytics', label: '分析', icon: BarChart3 },
              { id: 'settings', label: '设置', icon: Settings }
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </MotionDiv>

        {/* 概览标签页 */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 用户信息卡片 */}
            <MotionDiv
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              variants={itemVariants}
            >
              <div className="relative">
                {/* 背景装饰 */}
                <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                {/* 用户头像和基本信息 */}
                <div className="relative px-8 pb-8">
                  <div className="flex items-end -mt-16">
                    <div className="relative">
                      <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                        <User className="h-12 w-12 text-gray-600" />
                      </div>
                      <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="ml-6 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">{user?.name || '用户'}</h1>
                          <p className="text-gray-600">{user?.role === 'TEACHER' ? '教师' : '学员'}</p>
                        </div>
                        <button
                          onClick={() => setIsEditModalOpen(true)}
                          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          编辑资料
                        </button>
                      </div>

                      {/* 等级和经验条 */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">等级 {extendedStats.level}</span>
                          <span className="text-sm text-gray-500">
                            {extendedStats.totalPoints} / {extendedStats.totalPoints + extendedStats.nextLevelPoints} XP
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${(extendedStats.totalPoints / (extendedStats.totalPoints + extendedStats.nextLevelPoints)) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 快速统计 */}
                  <div className="grid grid-cols-4 gap-4 mt-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{extendedStats.completedCases}</div>
                      <div className="text-sm text-gray-600">完成案例</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{extendedStats.currentStreak}</div>
                      <div className="text-sm text-gray-600">连续天数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{extendedStats.totalHours}</div>
                      <div className="text-sm text-gray-600">学习时长</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{extendedStats.averageScore.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">平均分</div>
                    </div>
                  </div>
                </div>
              </div>
            </MotionDiv>

            {/* 学习进度概览 */}
            <MotionDiv
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  学习进度
                </h2>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="week">本周</option>
                  <option value="month">本月</option>
                  <option value="year">本年</option>
                </select>
              </div>

              {/* 周目标进度 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">本周目标</span>
                  <span className="text-sm text-gray-500">
                    {extendedStats.weeklyProgress} / {extendedStats.weeklyGoal} 案例
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((extendedStats.weeklyProgress / extendedStats.weeklyGoal) * 100, 100)}%`
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  还需完成 {Math.max(0, extendedStats.weeklyGoal - extendedStats.weeklyProgress)} 个案例达成本周目标
                </p>
              </div>

              {/* 分类进度 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">分类掌握度</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(extendedStats.categoryProgress).map(([category, progress]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                        <span className="text-sm text-gray-500">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            progress >= 90 ? 'bg-green-500' :
                            progress >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </MotionDiv>

            {/* 技能雷达图 */}
            <MotionDiv
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-500" />
                技能水平
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(extendedStats.skillLevels).map(([skill, level]) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{skill}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < level ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">{level}/5</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </MotionDiv>

            {/* 最近活动 */}
            <MotionDiv
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-500" />
                  最近活动
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  查看全部
                </button>
              </div>

              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.color === 'green' ? 'bg-green-100 text-green-600' :
                      activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      activity.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      activity.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                      activity.color === 'red' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {activity.icon === 'CheckCircle2' && <CheckCircle2 className="h-4 w-4" />}
                      {activity.icon === 'Crown' && <Crown className="h-4 w-4" />}
                      {activity.icon === 'TrendingUp' && <TrendingUp className="h-4 w-4" />}
                      {activity.icon === 'Zap' && <Zap className="h-4 w-4" />}
                      {activity.icon === 'MessageSquare' && <MessageSquare className="h-4 w-4" />}
                      {activity.icon === 'Heart' && <Heart className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                        <span className="text-xs text-gray-500">{activity.timestamp.split(' ')[1]}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      {activity.points && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                          +{activity.points} XP
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </MotionDiv>
          </div>
        )}

        {/* 成就标签页 */}
        {activeTab === 'achievements' && (
          <div className="space-y-8">
            {/* 成就统计 */}
            <MotionDiv
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                成就概览
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {achievements.filter(a => a.unlockedAt).length}
                  </div>
                  <div className="text-sm text-yellow-700 mt-1">已解锁</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {achievements.filter(a => !a.unlockedAt).length}
                  </div>
                  <div className="text-sm text-blue-700 mt-1">待解锁</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {achievements.filter(a => a.rarity === 'epic' || a.rarity === 'legendary').length}
                  </div>
                  <div className="text-sm text-purple-700 mt-1">稀有成就</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {achievements.reduce((sum, a) => sum + (a.unlockedAt ? a.points : 0), 0)}
                  </div>
                  <div className="text-sm text-green-700 mt-1">成就积分</div>
                </div>
              </div>
            </MotionDiv>

            {/* 成就分类 */}
            <MotionDiv
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">成就列表</h2>
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                    <option value="all">全部</option>
                    <option value="learning">学习类</option>
                    <option value="social">社交类</option>
                    <option value="milestone">里程碑</option>
                    <option value="special">特殊</option>
                  </select>
                  <button
                    onClick={() => setShowAllAchievements(!showAllAchievements)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    {showAllAchievements ? '收起' : '展开全部'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(showAllAchievements ? achievements : achievements.slice(0, 6)).map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      achievement.unlockedAt
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getRarityColor(achievement.rarity)}`}>
                        {achievement.icon === 'GraduationCap' && <GraduationCap className="h-6 w-6" />}
                        {achievement.icon === 'Calendar' && <Calendar className="h-6 w-6" />}
                        {achievement.icon === 'Crown' && <Crown className="h-6 w-6" />}
                        {achievement.icon === 'Heart' && <Heart className="h-6 w-6" />}
                        {achievement.icon === 'Trophy' && <Trophy className="h-6 w-6" />}
                        {achievement.icon === 'MessageSquare' && <MessageSquare className="h-6 w-6" />}
                        {achievement.icon === 'Target' && <Target className="h-6 w-6" />}
                        {achievement.icon === 'Clock' && <Clock className="h-6 w-6" />}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity === 'common' ? '普通' :
                         achievement.rarity === 'rare' ? '稀有' :
                         achievement.rarity === 'epic' ? '史诗' : '传奇'}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>

                    {achievement.progress !== undefined && achievement.maxProgress && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">进度</span>
                          <span className="text-xs text-gray-500">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-yellow-600">+{achievement.points} XP</span>
                      {achievement.unlockedAt && (
                        <span className="text-xs text-green-600">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </MotionDiv>
          </div>
        )}

        {/* 学习目标标签页 */}
        {activeTab === 'goals' && (
          <div className="space-y-8">
            {/* 目标概览 */}
            <MotionDiv
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-500" />
                  学习目标
                </h2>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  新增目标
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                        {goal.priority === 'high' ? '高' : goal.priority === 'medium' ? '中' : '低'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{goal.description}</p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-500">进度</span>
                          <span className="text-sm font-medium text-gray-700">
                            {goal.currentValue}/{goal.targetValue}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">截止日期</span>
                        <span className="text-gray-700">{new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          goal.status === 'active' ? 'bg-green-100 text-green-700' :
                          goal.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {goal.status === 'active' ? '进行中' :
                           goal.status === 'completed' ? '已完成' : '已暂停'}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </MotionDiv>
          </div>
        )}

        {/* 学习分析标签页 */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* 学习趋势 */}
            <MotionDiv
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-green-500" />
                学习趋势分析
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 月度进度图表 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">月度学习进度</h3>
                  <div className="space-y-2">
                    {extendedStats.monthlyProgress.map((progress, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 w-8">{index + 1}月</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12">{progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 学习时间分布 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">学习时间分布</h3>
                  <div className="space-y-4">
                    {[
                      { period: '早晨 (6-12点)', hours: 45, color: 'bg-yellow-500' },
                      { period: '下午 (12-18点)', hours: 120, color: 'bg-blue-500' },
                      { period: '晚上 (18-24点)', hours: 122, color: 'bg-purple-500' }
                    ].map((item) => (
                      <div key={item.period} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{item.period}</span>
                          <span className="text-sm font-medium text-gray-900">{item.hours}小时</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${(item.hours / extendedStats.totalHours) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </MotionDiv>

            {/* 学习效率分析 */}
            <MotionDiv
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-purple-500" />
                学习效率分析
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {(extendedStats.totalHours / extendedStats.completedCases).toFixed(1)}
                  </div>
                  <div className="text-sm text-blue-700">平均每案例用时(小时)</div>
                </div>

                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {((extendedStats.completedCases / extendedStats.totalCases) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-green-700">案例完成率</div>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {(extendedStats.totalPoints / extendedStats.totalHours).toFixed(0)}
                  </div>
                  <div className="text-sm text-purple-700">每小时获得积分</div>
                </div>
              </div>
            </MotionDiv>
          </div>
        )}
      </div>
    </MotionDiv>
  )
}
