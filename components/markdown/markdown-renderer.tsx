'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { MotionDiv } from '@/lib/motion-wrapper'
import { Copy, Download, Eye, EyeOff, Maximize2, Minimize2, RefreshCw, Settings } from 'lucide-react'

export interface MarkdownRendererProps {
  content: string
  className?: string
  showToolbar?: boolean
  enableEdit?: boolean
  enablePreview?: boolean
  enableTOC?: boolean
  sanitize?: boolean
  highlight?: boolean
  onContentChange?: (content: string) => void
  onRenderComplete?: (html: string, metadata: any) => void
}

export interface MarkdownMetadata {
  headings: Array<{ level: number; text: string; line: number }>
  links: Array<{ text: string; url: string }>
  images: Array<{ alt: string; src: string }>
  codeBlocks: Array<{ language: string; code: string }>
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  showToolbar = true,
  enableEdit = false,
  enablePreview = true,
  enableTOC = false,
  sanitize = true,
  highlight = true,
  onContentChange,
  onRenderComplete
}) => {
  const [renderedHtml, setRenderedHtml] = useState('')
  const [metadata, setMetadata] = useState<MarkdownMetadata | null>(null)
  const [toc, setToc] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('preview')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [editContent, setEditContent] = useState(content)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const renderMarkdown = async (markdown: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/markdown/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdown,
          options: { sanitize, highlight, enableTOC }
        })
      })

      if (!response.ok) throw new Error('Failed to render markdown')

      const data = await response.json()
      
      setRenderedHtml(data.html)
      setMetadata(data.metadata)
      setToc(data.toc || '')
      
      onRenderComplete?.(data.html, data.metadata)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rendering failed')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (content) {
      renderMarkdown(content)
    }
  }, [content, sanitize, highlight])

  useEffect(() => {
    setEditContent(content)
  }, [content])

  const handleContentChange = (newContent: string) => {
    setEditContent(newContent)
    onContentChange?.(newContent)
  }

  const handleRefresh = () => {
    renderMarkdown(editContent)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(renderedHtml)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([renderedHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rendered.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullscreen(!isFullscreen)
  }

  const renderToolbar = () => (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center space-x-2">
        {enableEdit && (
          <div className="flex bg-white rounded-lg border">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 text-sm rounded-l-lg transition-colors ${
                viewMode === 'edit' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              编辑
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 text-sm border-x transition-colors ${
                viewMode === 'split' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              分屏
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 text-sm rounded-r-lg transition-colors ${
                viewMode === 'preview' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              预览
            </button>
          </div>
        )}
        
        {metadata && (
          <div className="text-sm text-gray-600">
            {metadata.headings.length} 标题 · {metadata.links.length} 链接 · {metadata.codeBlocks.length} 代码块
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          title="刷新"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
        
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          title="复制HTML"
        >
          <Copy className="h-4 w-4" />
        </button>
        
        <button
          onClick={handleDownload}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          title="下载HTML"
        >
          <Download className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          title="设置"
        >
          <Settings className="h-4 w-4" />
        </button>
        
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          title={isFullscreen ? '退出全屏' : '全屏'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )

  const renderEditor = () => (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 relative">
        <textarea
          ref={editorRef}
          value={editContent}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full h-full p-4 border-none resize-none focus:outline-none font-mono text-sm"
          placeholder="在此输入Markdown内容..."
        />
      </div>
    </div>
  )

  const renderPreview = () => (
    <div className="flex-1 flex">
      {enableTOC && toc && (
        <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-3">目录</h3>
          <div 
            className="toc-content text-sm"
            dangerouslySetInnerHTML={{ __html: toc }}
          />
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">渲染中...</span>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg m-4">
            <div className="text-red-800 font-medium">渲染错误</div>
            <div className="text-red-600 text-sm mt-1">{error}</div>
          </div>
        )}
        
        {!isLoading && !error && (
          <div
            ref={previewRef}
            className="markdown-content p-6"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        )}
      </div>
    </div>
  )

  const renderSettings = () => (
    <MotionDiv
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
    >
      <h3 className="font-semibold text-gray-900 mb-3">渲染设置</h3>
      
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={sanitize}
            onChange={(e) => renderMarkdown(editContent)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm">HTML安全过滤</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={highlight}
            onChange={(e) => renderMarkdown(editContent)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm">代码高亮</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={enableTOC}
            onChange={(e) => renderMarkdown(editContent)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm">显示目录</span>
        </label>
      </div>
    </MotionDiv>
  )

  return (
    <div
      ref={containerRef}
      className={`markdown-renderer border border-gray-200 rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      } ${className}`}
    >
      {showToolbar && renderToolbar()}
      
      <div className="flex h-96 relative">
        {viewMode === 'edit' && enableEdit && renderEditor()}
        {viewMode === 'preview' && renderPreview()}
        {viewMode === 'split' && enableEdit && (
          <>
            <div className="w-1/2 border-r border-gray-200">
              {renderEditor()}
            </div>
            <div className="w-1/2">
              {renderPreview()}
            </div>
          </>
        )}
        
        {showSettings && renderSettings()}
      </div>
      
      <style jsx>{`
        .markdown-content {
          line-height: 1.6;
        }
        
        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }
        
        .markdown-content h1 { font-size: 2em; }
        .markdown-content h2 { font-size: 1.5em; }
        .markdown-content h3 { font-size: 1.25em; }
        
        .markdown-content p {
          margin-bottom: 1em;
        }
        
        .markdown-content ul,
        .markdown-content ol {
          margin-bottom: 1em;
          padding-left: 2em;
        }
        
        .markdown-content li {
          margin-bottom: 0.25em;
        }
        
        .markdown-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          color: #6b7280;
        }
        
        .markdown-content code {
          background-color: #f3f4f6;
          padding: 0.125em 0.25em;
          border-radius: 0.25em;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.875em;
        }
        
        .markdown-content pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
          margin: 1em 0;
        }
        
        .markdown-content pre code {
          background: none;
          padding: 0;
          color: inherit;
        }
        
        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
        }
        
        .markdown-content th,
        .markdown-content td {
          border: 1px solid #e5e7eb;
          padding: 0.5em;
          text-align: left;
        }
        
        .markdown-content th {
          background-color: #f9fafb;
          font-weight: 600;
        }
        
        .markdown-content .task-list {
          list-style: none;
          padding-left: 0;
        }
        
        .markdown-content .task-list-item {
          display: flex;
          align-items: center;
        }
        
        .markdown-content .task-list-item input {
          margin-right: 0.5em;
        }
        
        .markdown-content .hljs-keyword {
          color: #8b5cf6;
          font-weight: 600;
        }
        
        .markdown-content .hljs-string {
          color: #10b981;
        }
        
        .markdown-content .hljs-comment {
          color: #6b7280;
          font-style: italic;
        }
        
        .markdown-content .hljs-number {
          color: #f59e0b;
        }
        
        .toc-content ul {
          list-style: none;
          padding-left: 0;
        }
        
        .toc-content li {
          margin-bottom: 0.25em;
        }
        
        .toc-content a {
          color: #6b7280;
          text-decoration: none;
          padding: 0.25em 0;
          display: block;
          border-radius: 0.25em;
          padding-left: 0.5em;
        }
        
        .toc-content a:hover {
          background-color: #f3f4f6;
          color: #374151;
        }
      `}</style>
    </div>
  )
}

export default MarkdownRenderer
