'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MotionDiv } from '@/lib/motion-wrapper'
import MarkdownRenderer from './markdown-renderer'
import { Bold, Italic, Link, Image, Code, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Table, Eye, Edit3, Save, Upload, Download, Undo, Redo, Search, Replace } from 'lucide-react'

export interface MarkdownEditorProps {
  initialContent?: string
  onChange?: (content: string) => void
  onSave?: (content: string) => void
  className?: string
  height?: string
  showPreview?: boolean
  showToolbar?: boolean
  autoSave?: boolean
  autoSaveInterval?: number
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialContent = '',
  onChange,
  onSave,
  className = '',
  height = '500px',
  showPreview = true,
  showToolbar = true,
  autoSave = false,
  autoSaveInterval = 30000
}) => {
  const [content, setContent] = useState(initialContent)
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFind, setShowFind] = useState(false)
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [history, setHistory] = useState<string[]>([initialContent])
  const [historyIndex, setHistoryIndex] = useState(0)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoSave && content !== initialContent) {
      const timer = setTimeout(() => {
        onSave?.(content)
      }, autoSaveInterval)
      return () => clearTimeout(timer)
    }
  }, [content, autoSave, autoSaveInterval, onSave, initialContent])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    onChange?.(newContent)
    
    if (newContent !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newContent)
      if (newHistory.length > 50) {
        newHistory.shift()
      } else {
        setHistoryIndex(historyIndex + 1)
      }
      setHistory(newHistory)
    }
  }

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const textToInsert = selectedText || placeholder
    
    const newContent = 
      content.substring(0, start) + 
      before + textToInsert + after + 
      content.substring(end)
    
    handleContentChange(newContent)
    
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + textToInsert.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const insertAtLineStart = (prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const lineStart = content.lastIndexOf('\n', start - 1) + 1
    const lineEnd = content.indexOf('\n', start)
    const actualLineEnd = lineEnd === -1 ? content.length : lineEnd
    
    const line = content.substring(lineStart, actualLineEnd)
    const newLine = line.startsWith(prefix) ? line.substring(prefix.length) : prefix + line
    
    const newContent = 
      content.substring(0, lineStart) + 
      newLine + 
      content.substring(actualLineEnd)
    
    handleContentChange(newContent)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setContent(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setContent(history[historyIndex + 1])
    }
  }

  const handleFind = () => {
    if (!findText) return
    
    const textarea = textareaRef.current
    if (!textarea) return

    const index = content.toLowerCase().indexOf(findText.toLowerCase(), textarea.selectionEnd)
    if (index !== -1) {
      textarea.focus()
      textarea.setSelectionRange(index, index + findText.length)
    }
  }

  const handleReplace = () => {
    if (!findText) return
    
    const newContent = content.replace(new RegExp(findText, 'gi'), replaceText)
    handleContentChange(newContent)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      handleContentChange(text)
    }
    reader.readAsText(file)
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const toolbarButtons = [
    { icon: Bold, action: () => insertText('**', '**', '粗体文本'), title: '粗体' },
    { icon: Italic, action: () => insertText('*', '*', '斜体文本'), title: '斜体' },
    { icon: Code, action: () => insertText('`', '`', '代码'), title: '行内代码' },
    { icon: Link, action: () => insertText('[', '](url)', '链接文本'), title: '链接' },
    { icon: Image, action: () => insertText('![', '](url)', '图片描述'), title: '图片' },
    { icon: Heading1, action: () => insertAtLineStart('# '), title: '一级标题' },
    { icon: Heading2, action: () => insertAtLineStart('## '), title: '二级标题' },
    { icon: Heading3, action: () => insertAtLineStart('### '), title: '三级标题' },
    { icon: List, action: () => insertAtLineStart('- '), title: '无序列表' },
    { icon: ListOrdered, action: () => insertAtLineStart('1. '), title: '有序列表' },
    { icon: Quote, action: () => insertAtLineStart('> '), title: '引用' },
    { icon: Table, action: () => insertText('\n| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| 内容 | 内容 | 内容 |\n'), title: '表格' }
  ]

  const renderToolbar = () => (
    <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center space-x-1">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.action}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title={button.title}
          >
            <button.icon className="h-4 w-4" />
          </button>
        ))}
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button
          onClick={handleUndo}
          disabled={historyIndex === 0}
          className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
          title="撤销"
        >
          <Undo className="h-4 w-4" />
        </button>
        
        <button
          onClick={handleRedo}
          disabled={historyIndex === history.length - 1}
          className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
          title="重做"
        >
          <Redo className="h-4 w-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button
          onClick={() => setShowFind(!showFind)}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="查找替换"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        {showPreview && (
          <div className="flex bg-white rounded border">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 text-sm rounded-l transition-colors ${
                viewMode === 'edit' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Edit3 className="h-4 w-4" />
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
              className={`px-3 py-1 text-sm rounded-r transition-colors ${
                viewMode === 'preview' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="上传文件"
        >
          <Upload className="h-4 w-4" />
        </button>
        
        <button
          onClick={handleDownload}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="下载文件"
        >
          <Download className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => onSave?.(content)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
          title="保存"
        >
          <Save className="h-4 w-4 mr-1" />
          保存
        </button>
      </div>
    </div>
  )

  const renderFindReplace = () => (
    <MotionDiv
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="border-b border-gray-200 bg-gray-50 p-3"
    >
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">查找:</label>
          <input
            type="text"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="输入查找内容"
          />
          <button
            onClick={handleFind}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            查找
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">替换:</label>
          <input
            type="text"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="输入替换内容"
          />
          <button
            onClick={handleReplace}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            替换全部
          </button>
        </div>
        
        <button
          onClick={() => setShowFind(false)}
          className="p-1 rounded hover:bg-gray-200"
        >
          ×
        </button>
      </div>
    </MotionDiv>
  )

  const renderEditor = () => (
    <div className="flex-1 relative">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        className="w-full h-full p-4 border-none resize-none focus:outline-none font-mono text-sm"
        placeholder="在此输入Markdown内容..."
        style={{ minHeight: height }}
      />
    </div>
  )

  const renderPreview = () => (
    <div className="flex-1">
      <MarkdownRenderer
        content={content}
        showToolbar={false}
        enableTOC={true}
        className="h-full border-none"
      />
    </div>
  )

  return (
    <div
      ref={containerRef}
      className={`markdown-editor border border-gray-200 rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      } ${className}`}
    >
      {showToolbar && renderToolbar()}
      {showFind && renderFindReplace()}
      
      <div className="flex" style={{ height }}>
        {viewMode === 'edit' && renderEditor()}
        {viewMode === 'preview' && renderPreview()}
        {viewMode === 'split' && (
          <>
            <div className="w-1/2 border-r border-gray-200">
              {renderEditor()}
            </div>
            <div className="w-1/2">
              {renderPreview()}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MarkdownEditor
