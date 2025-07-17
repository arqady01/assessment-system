/**
 * API客户端工具库
 * 提供统一的API请求处理、错误处理、缓存、重试等功能
 */

// 类型定义
export interface ApiResponse<T = any> {
  data: T
  message?: string
  code?: number
  success: boolean
  timestamp?: string
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code?: number
  details?: any
  timestamp?: string
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  params?: Record<string, any>
  data?: any
  timeout?: number
  retries?: number
  retryDelay?: number
  cache?: boolean
  cacheTime?: number
  onUploadProgress?: (progress: number) => void
  onDownloadProgress?: (progress: number) => void
}

export interface CacheEntry {
  data: any
  timestamp: number
  expiry: number
}

export interface ApiClientConfig {
  baseURL: string
  timeout?: number
  retries?: number
  retryDelay?: number
  headers?: Record<string, string>
  interceptors?: {
    request?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
    response?: (response: any) => any | Promise<any>
    error?: (error: any) => any | Promise<any>
  }
}

// API客户端类
export class ApiClient {
  private baseURL: string
  private defaultConfig: Partial<RequestConfig>
  private cache: Map<string, CacheEntry> = new Map()
  private interceptors: ApiClientConfig['interceptors']

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL
    this.defaultConfig = {
      timeout: config.timeout || 10000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      }
    }
    this.interceptors = config.interceptors
  }

  // 构建完整URL
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    
    return url.toString()
  }

  // 生成缓存键
  private getCacheKey(url: string, config: RequestConfig): string {
    const method = config.method || 'GET'
    const data = config.data ? JSON.stringify(config.data) : ''
    return `${method}:${url}:${data}`
  }

  // 检查缓存
  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }

  // 设置缓存
  private setCache(key: string, data: any, cacheTime: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + cacheTime
    })
  }

  // 清除缓存
  public clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }
    
    const regex = new RegExp(pattern)
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  // 延迟函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 执行请求
  private async executeRequest(url: string, config: RequestConfig): Promise<any> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.timeout)

    try {
      const requestConfig: RequestInit = {
        method: config.method || 'GET',
        headers: config.headers,
        signal: controller.signal
      }

      if (config.data && config.method !== 'GET') {
        if (config.data instanceof FormData) {
          requestConfig.body = config.data
          // 删除Content-Type，让浏览器自动设置
          delete (requestConfig.headers as any)['Content-Type']
        } else {
          requestConfig.body = JSON.stringify(config.data)
        }
      }

      const response = await fetch(url, requestConfig)
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      
      return await response.text()
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  // 带重试的请求
  private async requestWithRetry(url: string, config: RequestConfig): Promise<any> {
    const maxRetries = config.retries || this.defaultConfig.retries || 3
    const retryDelay = config.retryDelay || this.defaultConfig.retryDelay || 1000

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeRequest(url, config)
      } catch (error) {
        if (attempt === maxRetries) {
          throw error
        }
        
        // 只对网络错误或5xx错误重试
        if (error instanceof TypeError || 
            (error instanceof Error && error.message.includes('HTTP 5'))) {
          await this.delay(retryDelay * Math.pow(2, attempt)) // 指数退避
          continue
        }
        
        throw error
      }
    }
  }

  // 主请求方法
  public async request<T = any>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    try {
      // 合并配置
      const finalConfig: RequestConfig = {
        ...this.defaultConfig,
        ...config,
        headers: {
          ...this.defaultConfig.headers,
          ...config.headers
        }
      }

      // 应用请求拦截器
      if (this.interceptors?.request) {
        Object.assign(finalConfig, await this.interceptors.request(finalConfig))
      }

      const url = this.buildURL(endpoint, finalConfig.params)
      const cacheKey = this.getCacheKey(url, finalConfig)

      // 检查缓存（仅对GET请求）
      if (finalConfig.method === 'GET' && finalConfig.cache) {
        const cachedData = this.getFromCache(cacheKey)
        if (cachedData) {
          return cachedData
        }
      }

      // 执行请求
      const response = await this.requestWithRetry(url, finalConfig)

      // 应用响应拦截器
      const finalResponse = this.interceptors?.response 
        ? await this.interceptors.response(response)
        : response

      // 设置缓存
      if (finalConfig.method === 'GET' && finalConfig.cache) {
        const cacheTime = finalConfig.cacheTime || 5 * 60 * 1000 // 默认5分钟
        this.setCache(cacheKey, finalResponse, cacheTime)
      }

      return finalResponse
    } catch (error) {
      // 应用错误拦截器
      if (this.interceptors?.error) {
        throw await this.interceptors.error(error)
      }
      
      throw this.formatError(error)
    }
  }

  // 格式化错误
  private formatError(error: any): ApiError {
    if (error.name === 'AbortError') {
      return {
        message: '请求超时',
        code: 408,
        timestamp: new Date().toISOString()
      }
    }

    if (error instanceof TypeError) {
      return {
        message: '网络连接失败',
        code: 0,
        timestamp: new Date().toISOString()
      }
    }

    return {
      message: error.message || '未知错误',
      code: error.code || 500,
      details: error,
      timestamp: new Date().toISOString()
    }
  }

  // 便捷方法
  public get<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'data'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  public post<T = any>(endpoint: string, data?: any, config?: Omit<RequestConfig, 'method' | 'data'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', data })
  }

  public put<T = any>(endpoint: string, data?: any, config?: Omit<RequestConfig, 'method' | 'data'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', data })
  }

  public patch<T = any>(endpoint: string, data?: any, config?: Omit<RequestConfig, 'method' | 'data'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', data })
  }

  public delete<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'data'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  // 文件上传
  public upload<T = any>(
    endpoint: string, 
    file: File, 
    config?: Omit<RequestConfig, 'method' | 'data'> & { 
      fieldName?: string
      additionalData?: Record<string, any>
    }
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append(config?.fieldName || 'file', file)
    
    if (config?.additionalData) {
      Object.entries(config.additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      data: formData
    })
  }

  // 批量请求
  public async batch<T = any>(requests: Array<{ endpoint: string; config?: RequestConfig }>): Promise<Array<ApiResponse<T> | ApiError>> {
    const promises = requests.map(({ endpoint, config }) => 
      this.request<T>(endpoint, config).catch(error => error)
    )
    
    return Promise.all(promises)
  }
}

// 创建默认API客户端实例
export const createApiClient = (config: ApiClientConfig): ApiClient => {
  return new ApiClient(config)
}

// 默认配置
export const defaultApiClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json'
  },
  interceptors: {
    request: async (config) => {
      // 添加认证token
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`
        }
      }
      return config
    },
    response: async (response) => {
      // 统一响应格式处理
      if (response && typeof response === 'object') {
        return {
          data: response.data || response,
          message: response.message,
          code: response.code || 200,
          success: response.success !== false,
          timestamp: response.timestamp || new Date().toISOString(),
          pagination: response.pagination
        }
      }
      return response
    },
    error: async (error) => {
      // 统一错误处理
      if (error.code === 401) {
        // 清除过期token
        localStorage.removeItem('auth_token')
        // 可以在这里触发重新登录
        window.location.href = '/login'
      }
      return error
    }
  }
})

// 导出常用的API方法
export const api = {
  get: defaultApiClient.get.bind(defaultApiClient),
  post: defaultApiClient.post.bind(defaultApiClient),
  put: defaultApiClient.put.bind(defaultApiClient),
  patch: defaultApiClient.patch.bind(defaultApiClient),
  delete: defaultApiClient.delete.bind(defaultApiClient),
  upload: defaultApiClient.upload.bind(defaultApiClient),
  batch: defaultApiClient.batch.bind(defaultApiClient),
  clearCache: defaultApiClient.clearCache.bind(defaultApiClient)
}
