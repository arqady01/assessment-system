'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { MotionDiv } from '@/lib/motion-wrapper'
import { Sun, Moon, Monitor, Palette, Type, Contrast, Eye } from 'lucide-react'

// 主题类型定义
export type Theme = 'light' | 'dark' | 'system'
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red'
export type FontSize = 'small' | 'medium' | 'large'
export type Contrast = 'normal' | 'high'

export interface ThemeConfig {
  theme: Theme
  colorScheme: ColorScheme
  fontSize: FontSize
  contrast: Contrast
  reducedMotion: boolean
}

interface ThemeContextType {
  config: ThemeConfig
  setTheme: (theme: Theme) => void
  setColorScheme: (scheme: ColorScheme) => void
  setFontSize: (size: FontSize) => void
  setContrast: (contrast: Contrast) => void
  setReducedMotion: (reduced: boolean) => void
  resetToDefaults: () => void
}

// 默认配置
const defaultConfig: ThemeConfig = {
  theme: 'system',
  colorScheme: 'blue',
  fontSize: 'medium',
  contrast: 'normal',
  reducedMotion: false
}

// 创建上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 主题提供者组件
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(defaultConfig)
  const [mounted, setMounted] = useState(false)

  // 从本地存储加载配置
  useEffect(() => {
    const savedConfig = localStorage.getItem('theme-config')
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setConfig({ ...defaultConfig, ...parsed })
      } catch (error) {
        console.error('Failed to parse theme config:', error)
      }
    }
    setMounted(true)
  }, [])

  // 保存配置到本地存储
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme-config', JSON.stringify(config))
    }
  }, [config, mounted])

  // 应用主题到DOM
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    
    // 移除所有主题类
    root.classList.remove('light', 'dark')
    root.removeAttribute('data-theme')
    root.removeAttribute('data-font-size')
    root.removeAttribute('data-contrast')

    // 确定实际主题
    let actualTheme = config.theme
    if (config.theme === 'system') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    // 应用主题
    root.classList.add(actualTheme)
    root.setAttribute('data-theme', config.colorScheme)
    root.setAttribute('data-font-size', config.fontSize)
    
    if (config.contrast === 'high') {
      root.setAttribute('data-contrast', 'high')
    }

    // 应用减少动画偏好
    if (config.reducedMotion) {
      root.style.setProperty('--transition-duration', '0ms')
    } else {
      root.style.removeProperty('--transition-duration')
    }
  }, [config, mounted])

  // 监听系统主题变化
  useEffect(() => {
    if (config.theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(mediaQuery.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [config.theme])

  const setTheme = (theme: Theme) => {
    setConfig(prev => ({ ...prev, theme }))
  }

  const setColorScheme = (colorScheme: ColorScheme) => {
    setConfig(prev => ({ ...prev, colorScheme }))
  }

  const setFontSize = (fontSize: FontSize) => {
    setConfig(prev => ({ ...prev, fontSize }))
  }

  const setContrast = (contrast: Contrast) => {
    setConfig(prev => ({ ...prev, contrast }))
  }

  const setReducedMotion = (reducedMotion: boolean) => {
    setConfig(prev => ({ ...prev, reducedMotion }))
  }

  const resetToDefaults = () => {
    setConfig(defaultConfig)
  }

  // 防止服务端渲染不匹配
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return (
    <ThemeContext.Provider value={{
      config,
      setTheme,
      setColorScheme,
      setFontSize,
      setContrast,
      setReducedMotion,
      resetToDefaults
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 使用主题的Hook
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// 主题切换器组件
export const ThemeToggle: React.FC<{
  variant?: 'button' | 'dropdown'
  size?: 'sm' | 'md' | 'lg'
}> = ({ variant = 'button', size = 'md' }) => {
  const { config, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { value: 'light' as Theme, label: '浅色', icon: Sun },
    { value: 'dark' as Theme, label: '深色', icon: Moon },
    { value: 'system' as Theme, label: '跟随系统', icon: Monitor }
  ]

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  if (variant === 'button') {
    const currentTheme = themes.find(t => t.value === config.theme)
    const Icon = currentTheme?.icon || Sun

    return (
      <button
        onClick={() => {
          const currentIndex = themes.findIndex(t => t.value === config.theme)
          const nextIndex = (currentIndex + 1) % themes.length
          setTheme(themes[nextIndex].value)
        }}
        className={`${sizeClasses[size]} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
        title={`当前: ${currentTheme?.label}`}
      >
        <Icon className={iconSizes[size]} />
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${sizeClasses[size]} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
      >
        <Palette className={iconSizes[size]} />
      </button>

      {isOpen && (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
        >
          <div className="py-1">
            {themes.map((theme) => {
              const Icon = theme.icon
              return (
                <button
                  key={theme.value}
                  onClick={() => {
                    setTheme(theme.value)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    config.theme === theme.value ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {theme.label}
                </button>
              )
            })}
          </div>
        </MotionDiv>
      )}
    </div>
  )
}

// 完整的主题设置面板
export const ThemeSettings: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const {
    config,
    setTheme,
    setColorScheme,
    setFontSize,
    setContrast,
    setReducedMotion,
    resetToDefaults
  } = useTheme()

  const colorSchemes = [
    { value: 'blue' as ColorScheme, label: '蓝色', color: 'bg-blue-500' },
    { value: 'green' as ColorScheme, label: '绿色', color: 'bg-green-500' },
    { value: 'purple' as ColorScheme, label: '紫色', color: 'bg-purple-500' },
    { value: 'orange' as ColorScheme, label: '橙色', color: 'bg-orange-500' },
    { value: 'red' as ColorScheme, label: '红色', color: 'bg-red-500' }
  ]

  const fontSizes = [
    { value: 'small' as FontSize, label: '小', description: '适合高分辨率屏幕' },
    { value: 'medium' as FontSize, label: '中', description: '标准大小' },
    { value: 'large' as FontSize, label: '大', description: '更易阅读' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <MotionDiv
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">主题设置</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* 主题模式 */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Sun className="h-4 w-4 mr-2" />
                主题模式
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'light' as Theme, label: '浅色', icon: Sun },
                  { value: 'dark' as Theme, label: '深色', icon: Moon },
                  { value: 'system' as Theme, label: '系统', icon: Monitor }
                ].map((theme) => {
                  const Icon = theme.icon
                  return (
                    <button
                      key={theme.value}
                      onClick={() => setTheme(theme.value)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        config.theme === theme.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-xs">{theme.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 颜色方案 */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                颜色方案
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.value}
                    onClick={() => setColorScheme(scheme.value)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      config.colorScheme === scheme.value
                        ? 'border-gray-900 dark:border-white'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    title={scheme.label}
                  >
                    <div className={`w-6 h-6 rounded-full ${scheme.color} mx-auto`} />
                  </button>
                ))}
              </div>
            </div>

            {/* 字体大小 */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Type className="h-4 w-4 mr-2" />
                字体大小
              </h3>
              <div className="space-y-2">
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setFontSize(size.value)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      config.fontSize === size.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{size.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {size.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 对比度 */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Contrast className="h-4 w-4 mr-2" />
                对比度
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'normal' as Contrast, label: '标准' },
                  { value: 'high' as Contrast, label: '高对比度' }
                ].map((contrast) => (
                  <button
                    key={contrast.value}
                    onClick={() => setContrast(contrast.value)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      config.contrast === contrast.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {contrast.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 减少动画 */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                动画效果
              </h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm">减少动画效果</span>
              </label>
            </div>

            {/* 重置按钮 */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={resetToDefaults}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                重置为默认设置
              </button>
            </div>
          </div>
        </div>
      </MotionDiv>
    </div>
  )
}
