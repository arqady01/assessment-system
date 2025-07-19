"use client"

import { useState, useEffect } from "react"

export default function TestAuthPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        console.log('Test auth response:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Test auth user:', data.user)
          setUser(data.user)
        } else {
          console.log('Test auth failed')
          setUser(null)
        }
      } catch (error) {
        console.error('Test auth error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const testLogin = async () => {
    try {
      console.log('开始测试登录...')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'admin123456'
        }),
        credentials: 'include'
      })

      const data = await response.json()
      console.log('Test login response:', response.status, data)
      console.log('Response headers:', [...response.headers.entries()])

      if (response.ok) {
        setUser(data.user)
        alert('登录成功！现在刷新页面检查认证状态')
        // 重新获取用户信息
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        alert('登录失败：' + data.error)
      }
    } catch (error) {
      console.error('Test login error:', error)
      alert('登录错误')
    }
  }

  const testLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        setUser(null)
        alert('退出成功！')
      }
    } catch (error) {
      console.error('Test logout error:', error)
    }
  }

  if (loading) {
    return <div className="p-8">加载中...</div>
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">认证测试页面</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">当前用户状态：</h2>
          {user ? (
            <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
          ) : (
            <p>未登录</p>
          )}
        </div>

        <div className="space-x-4">
          <button
            onClick={testLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            测试登录 (admin)
          </button>
          
          <button
            onClick={testLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            测试退出
          </button>
        </div>

        <div className="p-4 bg-yellow-100 rounded">
          <h3 className="font-semibold mb-2">调试信息：</h3>
          <p>请打开浏览器开发者工具查看控制台输出</p>
          <p>检查 Network 标签页查看 API 请求</p>
          <p>检查 Application 标签页查看 Cookies</p>
        </div>
      </div>
    </div>
  )
}
