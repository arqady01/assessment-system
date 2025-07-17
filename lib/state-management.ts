/**
 * 状态管理工具库
 * 提供轻量级的状态管理、订阅发布、持久化等功能
 */

import { useEffect, useState, useCallback, useRef } from 'react'

// 类型定义
export type StateListener<T> = (state: T, prevState: T) => void
export type StateSelector<T, R> = (state: T) => R
export type StateUpdater<T> = (prevState: T) => T
export type StateMiddleware<T> = (state: T, prevState: T, action?: string) => T

export interface StoreConfig<T> {
  initialState: T
  middleware?: StateMiddleware<T>[]
  persist?: {
    key: string
    storage?: Storage
    serialize?: (state: T) => string
    deserialize?: (data: string) => T
  }
}

export interface Store<T> {
  getState: () => T
  setState: (updater: T | StateUpdater<T>, action?: string) => void
  subscribe: (listener: StateListener<T>) => () => void
  destroy: () => void
}

// 创建状态存储
export function createStore<T>(config: StoreConfig<T>): Store<T> {
  let state = config.initialState
  const listeners = new Set<StateListener<T>>()
  const middleware = config.middleware || []

  // 从持久化存储加载状态
  if (config.persist) {
    try {
      const storage = config.persist.storage || localStorage
      const serializedState = storage.getItem(config.persist.key)
      if (serializedState) {
        const deserialize = config.persist.deserialize || JSON.parse
        state = { ...state, ...deserialize(serializedState) }
      }
    } catch (error) {
      console.warn('Failed to load persisted state:', error)
    }
  }

  const getState = () => state

  const setState = (updater: T | StateUpdater<T>, action?: string) => {
    const prevState = state
    const newState = typeof updater === 'function' 
      ? (updater as StateUpdater<T>)(state)
      : updater

    // 应用中间件
    let finalState = newState
    for (const mw of middleware) {
      finalState = mw(finalState, prevState, action)
    }

    if (finalState !== state) {
      state = finalState

      // 持久化状态
      if (config.persist) {
        try {
          const storage = config.persist.storage || localStorage
          const serialize = config.persist.serialize || JSON.stringify
          storage.setItem(config.persist.key, serialize(state))
        } catch (error) {
          console.warn('Failed to persist state:', error)
        }
      }

      // 通知监听器
      listeners.forEach(listener => {
        try {
          listener(state, prevState)
        } catch (error) {
          console.error('State listener error:', error)
        }
      })
    }
  }

  const subscribe = (listener: StateListener<T>) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const destroy = () => {
    listeners.clear()
  }

  return { getState, setState, subscribe, destroy }
}

// React Hook for using store
export function useStore<T>(store: Store<T>): [T, (updater: T | StateUpdater<T>, action?: string) => void] {
  const [state, setState] = useState(store.getState())

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setState(newState)
    })
    return unsubscribe
  }, [store])

  return [state, store.setState]
}

// React Hook for using store with selector
export function useStoreSelector<T, R>(
  store: Store<T>,
  selector: StateSelector<T, R>,
  equalityFn?: (a: R, b: R) => boolean
): R {
  const [selectedState, setSelectedState] = useState(() => selector(store.getState()))
  const selectorRef = useRef(selector)
  const equalityRef = useRef(equalityFn)

  // 更新refs
  selectorRef.current = selector
  equalityRef.current = equalityFn

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      const newSelectedState = selectorRef.current(newState)
      const isEqual = equalityRef.current 
        ? equalityRef.current(selectedState, newSelectedState)
        : selectedState === newSelectedState

      if (!isEqual) {
        setSelectedState(newSelectedState)
      }
    })
    return unsubscribe
  }, [store, selectedState])

  return selectedState
}

// 常用中间件
export const createLoggerMiddleware = <T>(name?: string): StateMiddleware<T> => {
  return (state, prevState, action) => {
    console.group(`🔄 State Update${name ? ` [${name}]` : ''}${action ? ` - ${action}` : ''}`)
    console.log('Previous State:', prevState)
    console.log('New State:', state)
    console.log('Action:', action)
    console.groupEnd()
    return state
  }
}

export const createValidationMiddleware = <T>(
  validator: (state: T) => boolean,
  errorMessage?: string
): StateMiddleware<T> => {
  return (state, prevState) => {
    if (!validator(state)) {
      console.error(errorMessage || 'State validation failed')
      return prevState
    }
    return state
  }
}

export const createImmutabilityMiddleware = <T>(): StateMiddleware<T> => {
  return (state) => {
    // 深度冻结状态对象
    return deepFreeze(state)
  }
}

// 深度冻结对象
function deepFreeze<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = (obj as any)[prop]
    if (value && typeof value === 'object') {
      deepFreeze(value)
    }
  })

  return Object.freeze(obj)
}

// 事件发布订阅系统
export class EventEmitter<T extends Record<string, any> = Record<string, any>> {
  private listeners: Map<keyof T, Set<Function>> = new Map()

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener)

    return () => this.off(event, listener)
  }

  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.delete(listener)
      if (eventListeners.size === 0) {
        this.listeners.delete(event)
      }
    }
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(data)
        } catch (error) {
          console.error(`Event listener error for ${String(event)}:`, error)
        }
      })
    }
  }

  once<K extends keyof T>(event: K, listener: (data: T[K]) => void): () => void {
    const onceListener = (data: T[K]) => {
      listener(data)
      this.off(event, onceListener)
    }
    return this.on(event, onceListener)
  }

  removeAllListeners<K extends keyof T>(event?: K): void {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }
  }

  listenerCount<K extends keyof T>(event: K): number {
    return this.listeners.get(event)?.size || 0
  }
}

// React Hook for event emitter
export function useEventEmitter<T extends Record<string, any>>(
  emitter: EventEmitter<T>
) {
  const emit = useCallback(<K extends keyof T>(event: K, data: T[K]) => {
    emitter.emit(event, data)
  }, [emitter])

  const on = useCallback(<K extends keyof T>(
    event: K, 
    listener: (data: T[K]) => void
  ) => {
    return emitter.on(event, listener)
  }, [emitter])

  return { emit, on }
}

// React Hook for listening to events
export function useEventListener<T extends Record<string, any>, K extends keyof T>(
  emitter: EventEmitter<T>,
  event: K,
  listener: (data: T[K]) => void,
  deps: any[] = []
) {
  useEffect(() => {
    return emitter.on(event, listener)
  }, [emitter, event, ...deps])
}

// 全局状态管理器
class GlobalStateManager {
  private stores: Map<string, Store<any>> = new Map()
  private eventEmitter = new EventEmitter()

  createStore<T>(name: string, config: StoreConfig<T>): Store<T> {
    if (this.stores.has(name)) {
      throw new Error(`Store "${name}" already exists`)
    }

    const store = createStore(config)
    this.stores.set(name, store)
    
    // 监听状态变化并发出事件
    store.subscribe((state, prevState) => {
      this.eventEmitter.emit('stateChange', { name, state, prevState })
    })

    return store
  }

  getStore<T>(name: string): Store<T> | undefined {
    return this.stores.get(name)
  }

  removeStore(name: string): boolean {
    const store = this.stores.get(name)
    if (store) {
      store.destroy()
      this.stores.delete(name)
      this.eventEmitter.emit('storeRemoved', { name })
      return true
    }
    return false
  }

  getAllStores(): string[] {
    return Array.from(this.stores.keys())
  }

  onStateChange(listener: (data: { name: string; state: any; prevState: any }) => void) {
    return this.eventEmitter.on('stateChange', listener)
  }

  onStoreRemoved(listener: (data: { name: string }) => void) {
    return this.eventEmitter.on('storeRemoved', listener)
  }

  destroy(): void {
    this.stores.forEach(store => store.destroy())
    this.stores.clear()
    this.eventEmitter.removeAllListeners()
  }
}

// 全局实例
export const globalStateManager = new GlobalStateManager()

// 便捷的Hook
export function useGlobalStore<T>(name: string, config?: StoreConfig<T>) {
  const store = globalStateManager.getStore<T>(name) || 
    (config ? globalStateManager.createStore(name, config) : undefined)

  if (!store) {
    throw new Error(`Store "${name}" not found and no config provided`)
  }

  return useStore(store)
}

// 本地存储工具
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | undefined => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  },

  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }
}

// 会话存储工具
export const sessionStorage = {
  get: <T>(key: string, defaultValue?: T): T | undefined => {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error)
    }
  },

  remove: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from sessionStorage:', error)
    }
  },

  clear: (): void => {
    try {
      window.sessionStorage.clear()
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error)
    }
  }
}
