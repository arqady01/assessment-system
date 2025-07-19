"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Settings,
  Globe,
  Shield,
  Database,
  Mail,
  Phone,
  Building,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Users,
  BookOpen,
  FolderOpen,
  Award
} from "lucide-react"

interface SystemSettings {
  // 基本设置
  siteName: string
  siteDescription: string
  allowRegistration: string
  requireEmailVerification: string
  
  // 安全设置
  maxLoginAttempts: string
  sessionTimeout: string
  enableNotifications: string
  maintenanceMode: string
  maintenanceMessage: string
  
  // 联系信息
  contactEmail: string
  supportPhone: string
  companyName: string
  companyAddress: string
  
  // 系统设置
  backupFrequency: string
  logRetentionDays: string
  maxFileSize: string
  allowedFileTypes: string
}

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: '',
    siteDescription: '',
    allowRegistration: 'true',
    requireEmailVerification: 'false',
    maxLoginAttempts: '5',
    sessionTimeout: '24',
    enableNotifications: 'true',
    maintenanceMode: 'false',
    maintenanceMessage: '',
    contactEmail: '',
    supportPhone: '',
    companyName: '',
    companyAddress: '',
    backupFrequency: 'daily',
    logRetentionDays: '30',
    maxFileSize: '10',
    allowedFileTypes: 'jpg,jpeg,png,gif,pdf,doc,docx'
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [backups, setBackups] = useState<any[]>([])
  const [backupLoading, setBackupLoading] = useState(false)

  useEffect(() => {
    fetchSettings()
    if (activeTab === 'monitor') {
      fetchSystemStatus()
    }
    if (activeTab === 'backup') {
      fetchBackups()
    }
  }, [activeTab])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('获取设置失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert('设置保存成功')
      } else {
        const data = await response.json()
        alert(data.error || '保存失败')
      }
    } catch (error) {
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof SystemSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/admin/system/status')
      if (response.ok) {
        const data = await response.json()
        setSystemStatus(data.status)
      }
    } catch (error) {
      console.error('获取系统状态失败:', error)
    }
  }

  const fetchBackups = async () => {
    try {
      const response = await fetch('/api/admin/system/backup')
      if (response.ok) {
        const data = await response.json()
        setBackups(data.backups)
      }
    } catch (error) {
      console.error('获取备份列表失败:', error)
    }
  }

  const createBackup = async () => {
    setBackupLoading(true)
    try {
      const response = await fetch('/api/admin/system/backup', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        alert('备份创建成功')
        fetchBackups()
      } else {
        const data = await response.json()
        alert(data.error || '备份创建失败')
      }
    } catch (error) {
      alert('备份创建失败')
    } finally {
      setBackupLoading(false)
    }
  }

  const tabs = [
    { id: 'basic', label: '基本设置', icon: Globe },
    { id: 'security', label: '安全设置', icon: Shield },
    { id: 'contact', label: '联系信息', icon: Mail },
    { id: 'system', label: '系统设置', icon: Database },
    { id: 'monitor', label: '系统监控', icon: Settings },
    { id: 'backup', label: '备份管理', icon: Database }
  ]

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
          <h2 className="text-2xl font-bold text-gray-900">系统设置</h2>
          <p className="text-gray-600 mt-1">管理系统的全局配置和参数</p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? (
            <RefreshCw className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          <span>{saving ? '保存中...' : '保存设置'}</span>
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex space-x-0">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      layoutId="activeTab"
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          {/* 基本设置 */}
          {activeTab === 'basic' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    网站名称
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="播控人员培训系统"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    网站描述
                  </label>
                  <input
                    type="text"
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="专业的播控人员技能培训平台"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    允许用户注册
                  </label>
                  <select
                    value={settings.allowRegistration}
                    onChange={(e) => updateSetting('allowRegistration', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="true">允许</option>
                    <option value="false">禁止</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱验证
                  </label>
                  <select
                    value={settings.requireEmailVerification}
                    onChange={(e) => updateSetting('requireEmailVerification', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="true">必须验证</option>
                    <option value="false">无需验证</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">提示</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      基本设置影响网站的整体行为和用户体验，请谨慎修改。
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 安全设置 */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最大登录尝试次数
                  </label>
                  <input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => updateSetting('maxLoginAttempts', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    会话超时时间（小时）
                  </label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="168"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    启用通知
                  </label>
                  <select
                    value={settings.enableNotifications}
                    onChange={(e) => updateSetting('enableNotifications', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="true">启用</option>
                    <option value="false">禁用</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    维护模式
                  </label>
                  <select
                    value={settings.maintenanceMode}
                    onChange={(e) => updateSetting('maintenanceMode', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="false">关闭</option>
                    <option value="true">开启</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  维护提示信息
                </label>
                <textarea
                  value={settings.maintenanceMessage}
                  onChange={(e) => updateSetting('maintenanceMessage', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="系统维护中，请稍后访问"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-900">警告</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      开启维护模式后，除管理员外的所有用户将无法访问系统。
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 联系信息 */}
          {activeTab === 'contact' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系邮箱
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateSetting('contactEmail', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    客服电话
                  </label>
                  <input
                    type="tel"
                    value={settings.supportPhone}
                    onChange={(e) => updateSetting('supportPhone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="400-123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司名称
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => updateSetting('companyName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="播控培训中心"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司地址
                </label>
                <textarea
                  value={settings.companyAddress}
                  onChange={(e) => updateSetting('companyAddress', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="北京市朝阳区xxx路xxx号"
                />
              </div>
            </motion.div>
          )}

          {/* 系统设置 */}
          {activeTab === 'system' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    备份频率
                  </label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => updateSetting('backupFrequency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">每日</option>
                    <option value="weekly">每周</option>
                    <option value="monthly">每月</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    日志保留天数
                  </label>
                  <input
                    type="number"
                    value={settings.logRetentionDays}
                    onChange={(e) => updateSetting('logRetentionDays', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="365"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最大文件大小（MB）
                  </label>
                  <input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => updateSetting('maxFileSize', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    允许的文件类型
                  </label>
                  <input
                    type="text"
                    value={settings.allowedFileTypes}
                    onChange={(e) => updateSetting('allowedFileTypes', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jpg,jpeg,png,gif,pdf,doc,docx"
                  />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-green-900">系统状态</h4>
                    <p className="text-sm text-green-700 mt-1">
                      系统运行正常，所有服务可用。
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 系统监控 */}
          {activeTab === 'monitor' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {systemStatus && (
                <>
                  {/* 系统概览 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">总用户数</p>
                          <p className="text-2xl font-bold text-blue-900">{systemStatus.statistics.totalUsers}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">题目总数</p>
                          <p className="text-2xl font-bold text-green-900">{systemStatus.statistics.totalQuestions}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 font-medium">分类数量</p>
                          <p className="text-2xl font-bold text-purple-900">{systemStatus.statistics.totalCategories}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <FolderOpen className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-amber-600 font-medium">考试次数</p>
                          <p className="text-2xl font-bold text-amber-900">{systemStatus.statistics.totalExams}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                          <Award className="h-6 w-6 text-amber-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 系统信息 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">系统信息</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">运行时间</span>
                          <span className="font-medium">{Math.floor(systemStatus.system.uptime / 3600)}小时</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Node.js版本</span>
                          <span className="font-medium">{systemStatus.system.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">平台</span>
                          <span className="font-medium">{systemStatus.system.platform}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">内存使用</span>
                          <span className="font-medium">
                            {Math.round(systemStatus.system.memory.heapUsed / 1024 / 1024)}MB
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">数据库状态</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">连接状态</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            systemStatus.database.status === 'connected'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {systemStatus.database.status === 'connected' ? '已连接' : '断开连接'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">总记录数</span>
                          <span className="font-medium">{systemStatus.database.totalRecords}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">今日新用户</span>
                          <span className="font-medium">{systemStatus.statistics.recentUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">今日考试</span>
                          <span className="font-medium">{systemStatus.statistics.recentExams}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-center">
                <motion.button
                  onClick={fetchSystemStatus}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  刷新状态
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* 备份管理 */}
          {activeTab === 'backup' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">数据库备份</h3>
                <motion.button
                  onClick={createBackup}
                  disabled={backupLoading}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {backupLoading ? '创建中...' : '创建备份'}
                </motion.button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h4 className="font-medium text-gray-900">备份列表</h4>
                </div>

                {backups.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>暂无备份文件</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {backups.map((backup, index) => (
                      <div key={index} className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">{backup.name}</h5>
                          <p className="text-sm text-gray-500">
                            创建时间: {new Date(backup.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {Math.round(backup.size / 1024)} KB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">备份说明</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      建议定期创建数据库备份，以防数据丢失。备份文件存储在服务器本地，请定期下载到安全位置。
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
