/**
 * 表单验证和处理工具库
 * 提供各种表单验证规则、错误处理、数据格式化等功能
 */

// 验证规则类型定义
export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'url' | 'number' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: any
  message: string
  validator?: (value: any) => boolean
}

export interface FieldValidation {
  rules: ValidationRule[]
  value: any
  errors: string[]
  isValid: boolean
  touched: boolean
}

export interface FormValidation {
  fields: Record<string, FieldValidation>
  isValid: boolean
  errors: Record<string, string[]>
  touched: Record<string, boolean>
}

export interface FormConfig {
  fields: Record<string, ValidationRule[]>
  onSubmit?: (data: Record<string, any>) => void | Promise<void>
  onError?: (errors: Record<string, string[]>) => void
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

// 基础验证函数
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.keys(value).length > 0
  return Boolean(value)
}

export const isEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export const isPhone = (value: string): boolean => {
  // 支持中国手机号格式
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(value.replace(/\s|-/g, ''))
}

export const isUrl = (value: string): boolean => {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export const isNumber = (value: any): boolean => {
  return !isNaN(Number(value)) && isFinite(Number(value))
}

export const isInteger = (value: any): boolean => {
  return Number.isInteger(Number(value))
}

export const isPositive = (value: any): boolean => {
  return isNumber(value) && Number(value) > 0
}

export const isNegative = (value: any): boolean => {
  return isNumber(value) && Number(value) < 0
}

export const isInRange = (value: any, min: number, max: number): boolean => {
  const num = Number(value)
  return isNumber(value) && num >= min && num <= max
}

export const hasMinLength = (value: string, minLength: number): boolean => {
  return typeof value === 'string' && value.length >= minLength
}

export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return typeof value === 'string' && value.length <= maxLength
}

export const matchesPattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value)
}

export const isStrongPassword = (value: string): boolean => {
  // 至少8位，包含大小写字母、数字和特殊字符
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return strongPasswordRegex.test(value)
}

export const isIdCard = (value: string): boolean => {
  // 中国身份证号验证
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return idCardRegex.test(value)
}

export const isBankCard = (value: string): boolean => {
  // 银行卡号验证（Luhn算法）
  const cardNumber = value.replace(/\s/g, '')
  if (!/^\d+$/.test(cardNumber)) return false
  
  let sum = 0
  let isEven = false
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

// 验证单个字段
export const validateField = (value: any, rules: ValidationRule[]): string[] => {
  const errors: string[] = []
  
  for (const rule of rules) {
    let isValid = true
    
    switch (rule.type) {
      case 'required':
        isValid = isRequired(value)
        break
      case 'email':
        isValid = !value || isEmail(value)
        break
      case 'phone':
        isValid = !value || isPhone(value)
        break
      case 'url':
        isValid = !value || isUrl(value)
        break
      case 'number':
        isValid = !value || isNumber(value)
        break
      case 'min':
        isValid = !value || Number(value) >= rule.value
        break
      case 'max':
        isValid = !value || Number(value) <= rule.value
        break
      case 'minLength':
        isValid = !value || hasMinLength(value, rule.value)
        break
      case 'maxLength':
        isValid = !value || hasMaxLength(value, rule.value)
        break
      case 'pattern':
        isValid = !value || matchesPattern(value, rule.value)
        break
      case 'custom':
        isValid = !value || (rule.validator ? rule.validator(value) : true)
        break
    }
    
    if (!isValid) {
      errors.push(rule.message)
    }
  }
  
  return errors
}

// 验证整个表单
export const validateForm = (data: Record<string, any>, config: FormConfig): FormValidation => {
  const fields: Record<string, FieldValidation> = {}
  const errors: Record<string, string[]> = {}
  const touched: Record<string, boolean> = {}
  
  for (const [fieldName, rules] of Object.entries(config.fields)) {
    const value = data[fieldName]
    const fieldErrors = validateField(value, rules)
    
    fields[fieldName] = {
      rules,
      value,
      errors: fieldErrors,
      isValid: fieldErrors.length === 0,
      touched: false
    }
    
    errors[fieldName] = fieldErrors
    touched[fieldName] = false
  }
  
  const isValid = Object.values(fields).every(field => field.isValid)
  
  return {
    fields,
    isValid,
    errors,
    touched
  }
}

// 表单数据格式化
export const formatFormData = (data: Record<string, any>): Record<string, any> => {
  const formatted: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      formatted[key] = value.trim()
    } else {
      formatted[key] = value
    }
  }
  
  return formatted
}

// 清理表单数据（移除空值）
export const cleanFormData = (data: Record<string, any>): Record<string, any> => {
  const cleaned: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = value
    }
  }
  
  return cleaned
}

// 表单数据转换
export const transformFormData = (
  data: Record<string, any>,
  transformers: Record<string, (value: any) => any>
): Record<string, any> => {
  const transformed = { ...data }
  
  for (const [key, transformer] of Object.entries(transformers)) {
    if (key in transformed) {
      transformed[key] = transformer(transformed[key])
    }
  }
  
  return transformed
}

// 常用的数据转换器
export const dataTransformers = {
  toNumber: (value: any) => Number(value),
  toString: (value: any) => String(value),
  toBoolean: (value: any) => Boolean(value),
  toDate: (value: any) => new Date(value),
  toUpperCase: (value: string) => value.toUpperCase(),
  toLowerCase: (value: string) => value.toLowerCase(),
  trim: (value: string) => value.trim(),
  removeSpaces: (value: string) => value.replace(/\s/g, ''),
  formatPhone: (value: string) => value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
  formatIdCard: (value: string) => value.replace(/(\d{6})(\d{8})(\d{4})/, '$1-$2-$3')
}

// 表单字段生成器
export const createFieldValidation = (
  type: 'text' | 'email' | 'phone' | 'password' | 'number' | 'url',
  options: {
    required?: boolean
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => boolean
    messages?: Partial<Record<ValidationRule['type'], string>>
  } = {}
): ValidationRule[] => {
  const rules: ValidationRule[] = []
  const defaultMessages = {
    required: '此字段为必填项',
    email: '请输入有效的邮箱地址',
    phone: '请输入有效的手机号码',
    url: '请输入有效的网址',
    number: '请输入有效的数字',
    min: `值不能小于 ${options.min}`,
    max: `值不能大于 ${options.max}`,
    minLength: `长度不能少于 ${options.minLength} 个字符`,
    maxLength: `长度不能超过 ${options.maxLength} 个字符`,
    pattern: '格式不正确',
    custom: '验证失败'
  }
  
  if (options.required) {
    rules.push({
      type: 'required',
      message: options.messages?.required || defaultMessages.required
    })
  }
  
  if (type === 'email') {
    rules.push({
      type: 'email',
      message: options.messages?.email || defaultMessages.email
    })
  }
  
  if (type === 'phone') {
    rules.push({
      type: 'phone',
      message: options.messages?.phone || defaultMessages.phone
    })
  }
  
  if (type === 'url') {
    rules.push({
      type: 'url',
      message: options.messages?.url || defaultMessages.url
    })
  }
  
  if (type === 'number') {
    rules.push({
      type: 'number',
      message: options.messages?.number || defaultMessages.number
    })
  }
  
  if (type === 'password') {
    rules.push({
      type: 'custom',
      validator: isStrongPassword,
      message: '密码必须包含大小写字母、数字和特殊字符，且长度至少8位'
    })
  }
  
  if (options.min !== undefined) {
    rules.push({
      type: 'min',
      value: options.min,
      message: options.messages?.min || defaultMessages.min
    })
  }
  
  if (options.max !== undefined) {
    rules.push({
      type: 'max',
      value: options.max,
      message: options.messages?.max || defaultMessages.max
    })
  }
  
  if (options.minLength !== undefined) {
    rules.push({
      type: 'minLength',
      value: options.minLength,
      message: options.messages?.minLength || defaultMessages.minLength
    })
  }
  
  if (options.maxLength !== undefined) {
    rules.push({
      type: 'maxLength',
      value: options.maxLength,
      message: options.messages?.maxLength || defaultMessages.maxLength
    })
  }
  
  if (options.pattern) {
    rules.push({
      type: 'pattern',
      value: options.pattern,
      message: options.messages?.pattern || defaultMessages.pattern
    })
  }
  
  if (options.custom) {
    rules.push({
      type: 'custom',
      validator: options.custom,
      message: options.messages?.custom || defaultMessages.custom
    })
  }
  
  return rules
}

// 错误消息格式化
export const formatErrorMessage = (errors: string[]): string => {
  return errors.join('；')
}

export const getFirstError = (errors: string[]): string => {
  return errors[0] || ''
}

// 表单状态管理辅助函数
export const updateFieldValue = (
  formState: FormValidation,
  fieldName: string,
  value: any,
  config: FormConfig
): FormValidation => {
  const rules = config.fields[fieldName] || []
  const errors = validateField(value, rules)
  
  return {
    ...formState,
    fields: {
      ...formState.fields,
      [fieldName]: {
        ...formState.fields[fieldName],
        value,
        errors,
        isValid: errors.length === 0,
        touched: true
      }
    },
    errors: {
      ...formState.errors,
      [fieldName]: errors
    },
    touched: {
      ...formState.touched,
      [fieldName]: true
    },
    isValid: Object.entries(formState.fields).every(([key, field]) => 
      key === fieldName ? errors.length === 0 : field.isValid
    )
  }
}

export const markFieldAsTouched = (
  formState: FormValidation,
  fieldName: string
): FormValidation => {
  return {
    ...formState,
    fields: {
      ...formState.fields,
      [fieldName]: {
        ...formState.fields[fieldName],
        touched: true
      }
    },
    touched: {
      ...formState.touched,
      [fieldName]: true
    }
  }
}

export const resetForm = (config: FormConfig): FormValidation => {
  return validateForm({}, config)
}
