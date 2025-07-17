'use client'

import React, { ReactNode, useState, useEffect } from 'react'
import { MotionDiv } from '@/lib/motion-wrapper'
import { Menu, X, ChevronDown, Search, Bell, Settings, User, Home, BookOpen, Award, BarChart3, HelpCircle, LogOut } from 'lucide-react'

// 布局组件接口
interface ResponsiveLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  className?: string
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

interface HeaderProps {
  onMenuClick: () => void
  title?: string
  actions?: ReactNode
  showSearch?: boolean
  onSearch?: (query: string) => void
}

interface NavigationItem {
  id: string
  label: string
  icon: ReactNode
  href?: string
  onClick?: () => void
  badge?: string | number
  children?: NavigationItem[]
}

interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

// 响应式容器组件
export const Container: React.FC<{
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}> = ({ children, size = 'lg', className = '' }) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  )
}

// 网格布局组件
export const Grid: React.FC<{
  children: ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}> = ({ children, cols = 1, gap = 'md', className = '' }) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    12: 'grid-cols-12'
  }

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  return (
    <div className={`grid ${colsClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  )
}

// Flex布局组件
export const Flex: React.FC<{
  children: ReactNode
  direction?: 'row' | 'col'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: boolean
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}> = ({ 
  children, 
  direction = 'row', 
  align = 'start', 
  justify = 'start', 
  wrap = false,
  gap = 'md',
  className = '' 
}) => {
  const directionClass = direction === 'col' ? 'flex-col' : 'flex-row'
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  return (
    <div className={`flex ${directionClass} ${alignClasses[align]} ${justifyClasses[justify]} ${wrap ? 'flex-wrap' : ''} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  )
}

// 侧边栏组件
export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* 移动端遮罩 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* 侧边栏 */}
      <MotionDiv
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold">菜单</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </MotionDiv>
    </>
  )
}

// 导航组件
export const Navigation: React.FC<{
  items: NavigationItem[]
  activeId?: string
  onItemClick?: (item: NavigationItem) => void
}> = ({ items, activeId, onItemClick }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const renderItem = (item: NavigationItem, level = 0) => {
    const isActive = activeId === item.id
    const isExpanded = expandedItems.includes(item.id)
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id)
            } else {
              onItemClick?.(item)
              item.onClick?.()
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
            isActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-700'
          } ${level > 0 ? 'pl-8' : ''}`}
        >
          <div className="flex items-center">
            <span className="mr-3">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          {hasChildren && (
            <ChevronDown 
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            />
          )}
        </button>
        
        {hasChildren && isExpanded && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {item.children!.map(child => renderItem(child, level + 1))}
          </MotionDiv>
        )}
      </div>
    )
  }

  return (
    <nav className="py-4">
      {items.map(item => renderItem(item))}
    </nav>
  )
}

// 头部组件
export const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  title, 
  actions, 
  showSearch = false, 
  onSearch 
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          {title && (
            <h1 className="ml-4 text-xl font-semibold text-gray-900 lg:ml-0">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
          )}
          
          {actions}
        </div>
      </div>
    </header>
  )
}

// 面包屑导航
export const Breadcrumb: React.FC<{
  items: BreadcrumbItem[]
  separator?: ReactNode
}> = ({ items, separator = '/' }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-gray-400">{separator}</span>
          )}
          {item.href || item.onClick ? (
            <button
              onClick={item.onClick}
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className={index === items.length - 1 ? 'text-gray-900 font-medium' : ''}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// 主布局组件
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  sidebar,
  header,
  footer,
  className = ''
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="flex h-screen">
        {sidebar && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
            {sidebar}
          </Sidebar>
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {header && (
            <Header 
              onMenuClick={() => setSidebarOpen(true)}
              {...(typeof header === 'object' ? header : {})}
            />
          )}
          
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          
          {footer && (
            <footer className="bg-white border-t border-gray-200 px-4 py-3">
              {footer}
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}

// 默认导航项
export const defaultNavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: '仪表板',
    icon: <Home className="h-5 w-5" />,
    href: '/dashboard'
  },
  {
    id: 'cases',
    label: '案例库',
    icon: <BookOpen className="h-5 w-5" />,
    href: '/cases',
    badge: '新'
  },
  {
    id: 'achievements',
    label: '成就系统',
    icon: <Award className="h-5 w-5" />,
    href: '/achievements'
  },
  {
    id: 'analytics',
    label: '数据分析',
    icon: <BarChart3 className="h-5 w-5" />,
    children: [
      {
        id: 'learning-analytics',
        label: '学习分析',
        icon: <BarChart3 className="h-4 w-4" />,
        href: '/analytics/learning'
      },
      {
        id: 'performance-analytics',
        label: '性能分析',
        icon: <BarChart3 className="h-4 w-4" />,
        href: '/analytics/performance'
      }
    ]
  },
  {
    id: 'settings',
    label: '设置',
    icon: <Settings className="h-5 w-5" />,
    children: [
      {
        id: 'profile-settings',
        label: '个人设置',
        icon: <User className="h-4 w-4" />,
        href: '/settings/profile'
      },
      {
        id: 'system-settings',
        label: '系统设置',
        icon: <Settings className="h-4 w-4" />,
        href: '/settings/system'
      }
    ]
  },
  {
    id: 'help',
    label: '帮助中心',
    icon: <HelpCircle className="h-5 w-5" />,
    href: '/help'
  }
]

// 默认头部操作
export const DefaultHeaderActions: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <button className="p-2 rounded-lg hover:bg-gray-100 relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <button className="p-2 rounded-lg hover:bg-gray-100">
        <Settings className="h-5 w-5" />
      </button>
      <button className="p-2 rounded-lg hover:bg-gray-100">
        <User className="h-5 w-5" />
      </button>
    </div>
  )
}
