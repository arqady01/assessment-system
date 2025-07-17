/**
 * 数据处理工具库
 * 提供各种数据处理、格式化、验证等功能
 */

// 数据类型定义
export interface DataPoint {
  id: string
  value: number
  label: string
  timestamp: Date
  category?: string
  metadata?: Record<string, any>
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
    borderWidth?: number
  }[]
}

export interface StatisticsResult {
  mean: number
  median: number
  mode: number[]
  standardDeviation: number
  variance: number
  min: number
  max: number
  range: number
  quartiles: {
    q1: number
    q2: number
    q3: number
  }
}

export interface TrendAnalysis {
  direction: 'increasing' | 'decreasing' | 'stable'
  strength: 'weak' | 'moderate' | 'strong'
  correlation: number
  prediction: number[]
  confidence: number
}

// 数据验证函数
export const validateDataPoint = (data: any): data is DataPoint => {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.value === 'number' &&
    typeof data.label === 'string' &&
    data.timestamp instanceof Date
  )
}

export const validateDataArray = (data: any[]): DataPoint[] => {
  return data.filter(validateDataPoint)
}

// 数据清洗函数
export const cleanData = (data: DataPoint[]): DataPoint[] => {
  return data
    .filter(point => !isNaN(point.value) && isFinite(point.value))
    .filter(point => point.value !== null && point.value !== undefined)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

export const removeOutliers = (data: DataPoint[], threshold: number = 2): DataPoint[] => {
  const values = data.map(d => d.value)
  const mean = calculateMean(values)
  const stdDev = calculateStandardDeviation(values)
  
  return data.filter(point => {
    const zScore = Math.abs((point.value - mean) / stdDev)
    return zScore <= threshold
  })
}

export const fillMissingValues = (data: DataPoint[], method: 'mean' | 'median' | 'forward' | 'backward' = 'mean'): DataPoint[] => {
  const result = [...data]
  const values = data.map(d => d.value).filter(v => !isNaN(v))
  
  let fillValue: number
  switch (method) {
    case 'mean':
      fillValue = calculateMean(values)
      break
    case 'median':
      fillValue = calculateMedian(values)
      break
    default:
      fillValue = calculateMean(values)
  }
  
  return result.map(point => {
    if (isNaN(point.value)) {
      return { ...point, value: fillValue }
    }
    return point
  })
}

// 统计计算函数
export const calculateMean = (values: number[]): number => {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export const calculateMedian = (values: number[]): number => {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  }
  return sorted[mid]
}

export const calculateMode = (values: number[]): number[] => {
  const frequency: Record<number, number> = {}
  values.forEach(value => {
    frequency[value] = (frequency[value] || 0) + 1
  })
  
  const maxFreq = Math.max(...Object.values(frequency))
  return Object.keys(frequency)
    .filter(key => frequency[Number(key)] === maxFreq)
    .map(Number)
}

export const calculateStandardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0
  const mean = calculateMean(values)
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2))
  const variance = calculateMean(squaredDiffs)
  return Math.sqrt(variance)
}

export const calculateVariance = (values: number[]): number => {
  if (values.length === 0) return 0
  const mean = calculateMean(values)
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2))
  return calculateMean(squaredDiffs)
}

export const calculateQuartiles = (values: number[]): { q1: number; q2: number; q3: number } => {
  if (values.length === 0) return { q1: 0, q2: 0, q3: 0 }
  
  const sorted = [...values].sort((a, b) => a - b)
  const q2 = calculateMedian(sorted)
  
  const lowerHalf = sorted.slice(0, Math.floor(sorted.length / 2))
  const upperHalf = sorted.slice(Math.ceil(sorted.length / 2))
  
  const q1 = calculateMedian(lowerHalf)
  const q3 = calculateMedian(upperHalf)
  
  return { q1, q2, q3 }
}

export const calculateStatistics = (values: number[]): StatisticsResult => {
  if (values.length === 0) {
    return {
      mean: 0,
      median: 0,
      mode: [],
      standardDeviation: 0,
      variance: 0,
      min: 0,
      max: 0,
      range: 0,
      quartiles: { q1: 0, q2: 0, q3: 0 }
    }
  }
  
  const mean = calculateMean(values)
  const median = calculateMedian(values)
  const mode = calculateMode(values)
  const standardDeviation = calculateStandardDeviation(values)
  const variance = calculateVariance(values)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min
  const quartiles = calculateQuartiles(values)
  
  return {
    mean,
    median,
    mode,
    standardDeviation,
    variance,
    min,
    max,
    range,
    quartiles
  }
}

// 趋势分析函数
export const calculateTrend = (data: DataPoint[]): TrendAnalysis => {
  if (data.length < 2) {
    return {
      direction: 'stable',
      strength: 'weak',
      correlation: 0,
      prediction: [],
      confidence: 0
    }
  }
  
  const values = data.map(d => d.value)
  const indices = data.map((_, i) => i)
  
  // 计算线性回归
  const n = values.length
  const sumX = indices.reduce((sum, x) => sum + x, 0)
  const sumY = values.reduce((sum, y) => sum + y, 0)
  const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0)
  const sumXX = indices.reduce((sum, x) => sum + x * x, 0)
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  // 计算相关系数
  const meanX = sumX / n
  const meanY = sumY / n
  const numerator = indices.reduce((sum, x, i) => sum + (x - meanX) * (values[i] - meanY), 0)
  const denominatorX = Math.sqrt(indices.reduce((sum, x) => sum + Math.pow(x - meanX, 2), 0))
  const denominatorY = Math.sqrt(values.reduce((sum, y) => sum + Math.pow(y - meanY, 2), 0))
  const correlation = numerator / (denominatorX * denominatorY)
  
  // 确定趋势方向和强度
  let direction: 'increasing' | 'decreasing' | 'stable'
  if (Math.abs(slope) < 0.1) {
    direction = 'stable'
  } else if (slope > 0) {
    direction = 'increasing'
  } else {
    direction = 'decreasing'
  }
  
  let strength: 'weak' | 'moderate' | 'strong'
  const absCorrelation = Math.abs(correlation)
  if (absCorrelation < 0.3) {
    strength = 'weak'
  } else if (absCorrelation < 0.7) {
    strength = 'moderate'
  } else {
    strength = 'strong'
  }
  
  // 生成预测值
  const prediction = []
  for (let i = n; i < n + 5; i++) {
    prediction.push(slope * i + intercept)
  }
  
  // 计算置信度
  const confidence = Math.min(absCorrelation * 100, 95)
  
  return {
    direction,
    strength,
    correlation,
    prediction,
    confidence
  }
}

// 数据转换函数
export const dataToChartFormat = (data: DataPoint[], groupBy?: string): ChartData => {
  if (groupBy && groupBy === 'category') {
    const categories = [...new Set(data.map(d => d.category || 'Unknown'))]
    const datasets = categories.map(category => {
      const categoryData = data.filter(d => (d.category || 'Unknown') === category)
      return {
        label: category,
        data: categoryData.map(d => d.value),
        backgroundColor: generateColor(category),
        borderColor: generateColor(category, 0.8),
        borderWidth: 2
      }
    })
    
    return {
      labels: data.map(d => d.label),
      datasets
    }
  }
  
  return {
    labels: data.map(d => d.label),
    datasets: [{
      label: 'Data',
      data: data.map(d => d.value),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2
    }]
  }
}

export const aggregateByPeriod = (
  data: DataPoint[], 
  period: 'day' | 'week' | 'month' | 'year'
): DataPoint[] => {
  const groups: Record<string, DataPoint[]> = {}
  
  data.forEach(point => {
    let key: string
    const date = point.timestamp
    
    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0]
        break
      case 'week':
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0]
        break
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      case 'year':
        key = String(date.getFullYear())
        break
      default:
        key = date.toISOString().split('T')[0]
    }
    
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(point)
  })
  
  return Object.entries(groups).map(([key, points]) => ({
    id: key,
    value: calculateMean(points.map(p => p.value)),
    label: key,
    timestamp: new Date(key),
    metadata: {
      count: points.length,
      sum: points.reduce((sum, p) => sum + p.value, 0),
      min: Math.min(...points.map(p => p.value)),
      max: Math.max(...points.map(p => p.value))
    }
  }))
}

// 辅助函数
const generateColor = (seed: string, alpha: number = 0.5): string => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const r = (hash & 0xFF0000) >> 16
  const g = (hash & 0x00FF00) >> 8
  const b = hash & 0x0000FF
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals).replace(/\.?0+$/, '')
}

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`
}

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) {
    return `${mins}分钟`
  }
  
  return `${hours}小时${mins > 0 ? `${mins}分钟` : ''}`
}

export const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`
  
  return date.toLocaleDateString()
}
