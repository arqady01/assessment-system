'use client'

import React, { useState, useEffect, useRef, ReactNode } from 'react'
import { MotionDiv } from '@/lib/motion-wrapper'
import { ChevronDown, ChevronUp, X, Check, AlertCircle, Info, CheckCircle, XCircle, Loader2, Search, Filter, MoreHorizontal, Calendar, Clock, User, Star, Heart, Bookmark, Share2, Download, Eye, MessageCircle, ThumbsUp } from 'lucide-react'

// 通用接口定义
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  icon?: ReactNode
}

export interface TabItem {
  id: string
  label: string
  icon?: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose?: () => void
}

export interface ProgressBarProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  showLabel?: boolean
  animated?: boolean
}

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export interface AvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
  online?: boolean
}

export interface CardProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

// 增强的下拉选择组件
export const EnhancedSelect: React.FC<{
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  searchable?: boolean
  multiple?: boolean
  disabled?: boolean
  className?: string
}> = ({ 
  options, 
  value, 
  onChange, 
  placeholder = '请选择...', 
  searchable = false,
  multiple = false,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? (Array.isArray(value) ? value : []) : (value ? [value] : [])
  )
  
  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue]
      setSelectedValues(newValues)
      onChange(newValues.join(','))
    } else {
      setSelectedValues([optionValue])
      onChange(optionValue)
      setIsOpen(false)
    }
  }

  const selectedOption = options.find(opt => opt.value === value)
  const displayText = multiple 
    ? selectedValues.length > 0 
      ? `已选择 ${selectedValues.length} 项`
      : placeholder
    : selectedOption?.label || placeholder

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {displayText}
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {isOpen && (
        <MotionDiv
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索选项..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
          
          <div className="py-1">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                disabled={option.disabled}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between ${
                  selectedValues.includes(option.value) ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center">
                  {option.icon && <span className="mr-2">{option.icon}</span>}
                  <span>{option.label}</span>
                </div>
                {selectedValues.includes(option.value) && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
            
            {filteredOptions.length === 0 && (
              <div className="px-4 py-2 text-gray-500 text-center">
                没有找到匹配的选项
              </div>
            )}
          </div>
        </MotionDiv>
      )}
    </div>
  )
}

// 增强的标签页组件
export const EnhancedTabs: React.FC<{
  tabs: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}> = ({ 
  tabs, 
  activeTab, 
  onChange, 
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const getTabClasses = (tab: TabItem) => {
    const baseClasses = `${sizeClasses[size]} font-medium transition-all duration-200 flex items-center`
    const isActive = activeTab === tab.id
    const isDisabled = tab.disabled

    if (isDisabled) {
      return `${baseClasses} opacity-50 cursor-not-allowed text-gray-400`
    }

    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-lg ${
          isActive 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'text-gray-600 hover:bg-gray-100'
        }`
      case 'underline':
        return `${baseClasses} border-b-2 ${
          isActive 
            ? 'border-blue-600 text-blue-600' 
            : 'border-transparent text-gray-600 hover:text-gray-900'
        }`
      default:
        return `${baseClasses} border border-gray-300 ${
          isActive 
            ? 'bg-white text-blue-600 border-blue-600' 
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        }`
    }
  }

  return (
    <div className={className}>
      <div className={`flex ${variant === 'underline' ? 'border-b border-gray-200' : 'space-x-1'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            className={getTabClasses(tab)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}

// 通知组件
export const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'info': return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`fixed top-4 right-4 z-50 max-w-sm w-full border rounded-lg p-4 shadow-lg ${getColors()}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {message && (
            <p className="mt-1 text-sm opacity-90">{message}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            onClose?.()
          }}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </MotionDiv>
  )
}

// 进度条组件
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'blue',
  showLabel = false,
  animated = false
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>进度</span>
          <span>{value}/{max}</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// 徽章组件
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </span>
  )
}

// 头像组件
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  fallback,
  online = false
}) => {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  }

  const onlineSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  }

  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}>
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-medium text-gray-600">
            {fallback || (alt ? alt.charAt(0).toUpperCase() : 'U')}
          </span>
        )}
      </div>
      {online && (
        <div className={`absolute bottom-0 right-0 ${onlineSizeClasses[size]} bg-green-500 border-2 border-white rounded-full`} />
      )}
    </div>
  )
}

// 增强的卡片组件
export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  actions,
  hover = false,
  padding = 'md',
  className = '',
  children
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <MotionDiv
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${
        hover ? 'hover:shadow-md transition-shadow duration-200' : ''
      } ${paddingClasses[padding]} ${className}`}
      whileHover={hover ? { y: -2 } : undefined}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      {children}
    </MotionDiv>
  )
}
