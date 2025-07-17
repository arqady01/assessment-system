import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 扩展的工具函数库
 * 提供各种常用的工具函数、类型检查、数据处理等功能
 */

// 类型检查工具
export const isString = (value: unknown): value is string => typeof value === 'string'
export const isNumber = (value: unknown): value is number => typeof value === 'number' && !isNaN(value)
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
export const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
export const isArray = (value: unknown): value is unknown[] => Array.isArray(value)
export const isFunction = (value: unknown): value is Function => typeof value === 'function'
export const isDate = (value: unknown): value is Date => value instanceof Date && !isNaN(value.getTime())
export const isRegExp = (value: unknown): value is RegExp => value instanceof RegExp
export const isNull = (value: unknown): value is null => value === null
export const isUndefined = (value: unknown): value is undefined => value === undefined
export const isNullOrUndefined = (value: unknown): value is null | undefined =>
  value === null || value === undefined

// 空值检查
export const isEmpty = (value: unknown): boolean => {
  if (isNullOrUndefined(value)) return true
  if (isString(value)) return value.trim().length === 0
  if (isArray(value)) return value.length === 0
  if (isObject(value)) return Object.keys(value).length === 0
  return false
}

export const isNotEmpty = (value: unknown): boolean => !isEmpty(value)

// 深度比较
export const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true

  if (a === null || b === null) return false
  if (a === undefined || b === undefined) return false

  if (typeof a !== typeof b) return false

  if (isDate(a) && isDate(b)) {
    return a.getTime() === b.getTime()
  }

  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => deepEqual(item, b[index]))
  }

  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    return keysA.every(key =>
      keysB.includes(key) && deepEqual(a[key], b[key])
    )
  }

  return false
}

// 深度克隆
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj

  if (isDate(obj)) {
    return new Date(obj.getTime()) as T
  }

  if (isArray(obj)) {
    return obj.map(item => deepClone(item)) as T
  }

  if (isObject(obj)) {
    const cloned = {} as T
    Object.keys(obj).forEach(key => {
      (cloned as any)[key] = deepClone((obj as any)[key])
    })
    return cloned
  }

  return obj
}

// 对象合并
export const merge = <T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T => {
  const result = deepClone(target)

  sources.forEach(source => {
    if (isObject(source)) {
      Object.keys(source).forEach(key => {
        const sourceValue = source[key]
        const targetValue = result[key]

        if (isObject(sourceValue) && isObject(targetValue)) {
          result[key] = merge(targetValue, sourceValue)
        } else {
          result[key] = sourceValue
        }
      })
    }
  })

  return result
}

// 数组工具
export const unique = <T>(array: T[]): T[] => [...new Set(array)]

export const groupBy = <T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<K, T[]>)
}

export const sortBy = <T>(array: T[], keyFn: (item: T) => any): T[] => {
  return [...array].sort((a, b) => {
    const aKey = keyFn(a)
    const bKey = keyFn(b)

    if (aKey < bKey) return -1
    if (aKey > bKey) return 1
    return 0
  })
}

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export const flatten = <T>(array: (T | T[])[]): T[] => {
  return array.reduce<T[]>((flat, item) => {
    return flat.concat(isArray(item) ? flatten(item) : item)
  }, [])
}

export const difference = <T>(array1: T[], array2: T[]): T[] => {
  return array1.filter(item => !array2.includes(item))
}

export const intersection = <T>(array1: T[], array2: T[]): T[] => {
  return array1.filter(item => array2.includes(item))
}

export const union = <T>(array1: T[], array2: T[]): T[] => {
  return unique([...array1, ...array2])
}

// 字符串工具
export const capitalize = (str: string): string => {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const camelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '')
}

export const kebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

export const snakeCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .toLowerCase()
}

export const truncate = (str: string, length: number, suffix = '...'): string => {
  if (str.length <= length) return str
  return str.slice(0, length - suffix.length) + suffix
}

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// 数字工具
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

export const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

export const randomInt = (min: number, max: number): number => {
  return Math.floor(random(min, max + 1))
}

export const round = (value: number, decimals = 0): number => {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat('zh-CN', options).format(value)
}

export const formatCurrency = (value: number, currency = 'CNY'): string => {
  return formatNumber(value, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  })
}

export const formatPercentage = (value: number, decimals = 1): string => {
  return formatNumber(value / 100, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

// 日期工具
export const formatDate = (date: Date | string | number, format = 'YYYY-MM-DD'): string => {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

export const formatRelativeTime = (date: Date | string | number): string => {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`

  return `${Math.floor(diffDays / 365)}年前`
}

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export const addYears = (date: Date, years: number): Date => {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() + years)
  return result
}

export const isToday = (date: Date): boolean => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export const isYesterday = (date: Date): boolean => {
  const yesterday = addDays(new Date(), -1)
  return date.toDateString() === yesterday.toDateString()
}

export const isTomorrow = (date: Date): boolean => {
  const tomorrow = addDays(new Date(), 1)
  return date.toDateString() === tomorrow.toDateString()
}

// 防抖和节流
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// 延迟执行
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 重试机制
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (attempt < maxAttempts) {
        await sleep(delay * attempt) // 指数退避
      }
    }
  }

  throw lastError!
}

// 颜色工具
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }).join("")
}

// 文件大小格式化
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 生成随机ID
export const generateId = (length = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// UUID v4 生成器
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 条件类名
export const conditionalClass = (
  condition: boolean,
  trueClass: string,
  falseClass = ''
): string => {
  return condition ? trueClass : falseClass
}
