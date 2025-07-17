import { spawn, ChildProcess } from 'child_process'
import { promisify } from 'util'

export interface MarkdownRequest {
  operation: 'render_markdown' | 'validate_markdown' | 'extract_metadata'
  data: {
    markdown: string
    options?: MarkdownOptions
  }
}

export interface MarkdownOptions {
  sanitize?: boolean
  breaks?: boolean
  linkify?: boolean
  typographer?: boolean
  highlight?: boolean
  tables?: boolean
  strikethrough?: boolean
  taskLists?: boolean
  emoji?: boolean
  footnotes?: boolean
  math?: boolean
}

export interface MarkdownResponse {
  success: boolean
  result?: {
    html?: string
    length?: number
    lines?: number
    metadata?: MarkdownMetadata
    valid?: boolean
    errors?: string[]
    warnings?: string[]
  }
  error?: string
  executionTime: number
}

export interface MarkdownMetadata {
  headings: Array<{
    level: number
    text: string
    line: number
  }>
  links: Array<{
    text: string
    url: string
  }>
  images: Array<{
    alt: string
    src: string
  }>
  codeBlocks: Array<{
    language: string
    code: string
  }>
}

export class MarkdownBridge {
  private executablePath: string
  private processPool: ChildProcess[] = []
  private maxPoolSize: number = 3
  private currentPoolIndex: number = 0
  private cache: Map<string, { result: any; expiry: number }> = new Map()
  private cacheTimeout: number = 300000

  constructor(executablePath: string = './markdown_renderer') {
    this.executablePath = executablePath
    this.initializeProcessPool()
  }

  private initializeProcessPool(): void {
    for (let i = 0; i < this.maxPoolSize; i++) {
      this.processPool.push(this.createProcess())
    }
  }

  private createProcess(): ChildProcess {
    return spawn(this.executablePath, [], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, MARKDOWN_MODE: 'production' }
    })
  }

  private getNextProcess(): ChildProcess {
    const process = this.processPool[this.currentPoolIndex]
    this.currentPoolIndex = (this.currentPoolIndex + 1) % this.maxPoolSize
    return process
  }

  async renderMarkdown(markdown: string, options?: MarkdownOptions): Promise<string> {
    const cacheKey = this.generateCacheKey('render', markdown, options)
    const cached = this.cache.get(cacheKey)
    
    if (cached && cached.expiry > Date.now()) {
      return cached.result
    }

    const request: MarkdownRequest = {
      operation: 'render_markdown',
      data: { markdown, options }
    }

    const response = await this.executeOperation(request)
    if (!response.success) throw new Error(response.error)

    const html = response.result!.html!
    this.cache.set(cacheKey, {
      result: html,
      expiry: Date.now() + this.cacheTimeout
    })

    return html
  }

  async validateMarkdown(markdown: string): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
    const request: MarkdownRequest = {
      operation: 'validate_markdown',
      data: { markdown }
    }

    const response = await this.executeOperation(request)
    if (!response.success) throw new Error(response.error)

    return {
      valid: response.result!.valid!,
      errors: response.result!.errors || [],
      warnings: response.result!.warnings || []
    }
  }

  async extractMetadata(markdown: string): Promise<MarkdownMetadata> {
    const cacheKey = this.generateCacheKey('metadata', markdown)
    const cached = this.cache.get(cacheKey)
    
    if (cached && cached.expiry > Date.now()) {
      return cached.result
    }

    const request: MarkdownRequest = {
      operation: 'extract_metadata',
      data: { markdown }
    }

    const response = await this.executeOperation(request)
    if (!response.success) throw new Error(response.error)

    const metadata = response.result!.metadata!
    this.cache.set(cacheKey, {
      result: metadata,
      expiry: Date.now() + this.cacheTimeout
    })

    return metadata
  }

  async renderWithMetadata(markdown: string, options?: MarkdownOptions): Promise<{
    html: string
    metadata: MarkdownMetadata
    stats: { length: number; lines: number; executionTime: number }
  }> {
    const [html, metadata] = await Promise.all([
      this.renderMarkdown(markdown, options),
      this.extractMetadata(markdown)
    ])

    return {
      html,
      metadata,
      stats: {
        length: html.length,
        lines: markdown.split('\n').length,
        executionTime: 0
      }
    }
  }

  async batchRender(markdownTexts: string[], options?: MarkdownOptions): Promise<string[]> {
    const promises = markdownTexts.map(markdown => 
      this.renderMarkdown(markdown, options)
    )
    return Promise.all(promises)
  }

  async renderStream(markdownStream: AsyncIterable<string>, options?: MarkdownOptions): Promise<AsyncIterable<string>> {
    const self = this
    
    return {
      async *[Symbol.asyncIterator]() {
        for await (const chunk of markdownStream) {
          yield await self.renderMarkdown(chunk, options)
        }
      }
    }
  }

  private async executeOperation(request: MarkdownRequest): Promise<MarkdownResponse> {
    return new Promise((resolve, reject) => {
      const process = this.getNextProcess()
      const startTime = Date.now()
      let responseData = ''

      const timeout = setTimeout(() => {
        reject(new Error('Markdown rendering timeout'))
      }, 10000)

      process.stdout?.on('data', (data) => {
        responseData += data.toString()
      })

      process.stderr?.on('data', (data) => {
        console.error('Markdown Renderer Error:', data.toString())
      })

      process.stdout?.once('end', () => {
        clearTimeout(timeout)
        try {
          const response: MarkdownResponse = JSON.parse(responseData)
          response.executionTime = Date.now() - startTime
          resolve(response)
        } catch (error) {
          reject(new Error('Invalid markdown renderer response'))
        }
      })

      process.stdin?.write(JSON.stringify(request) + '\n')
    })
  }

  private generateCacheKey(operation: string, markdown: string, options?: any): string {
    const optionsStr = options ? JSON.stringify(options) : ''
    const content = `${operation}:${markdown}:${optionsStr}`
    return require('crypto').createHash('md5').update(content).digest('hex')
  }

  clearCache(): void {
    this.cache.clear()
  }

  destroy(): void {
    this.processPool.forEach(process => {
      if (!process.killed) {
        process.kill('SIGTERM')
      }
    })
    this.processPool = []
    this.cache.clear()
  }
}

export class MarkdownProcessor {
  private bridge: MarkdownBridge
  private defaultOptions: MarkdownOptions

  constructor(executablePath?: string, defaultOptions?: MarkdownOptions) {
    this.bridge = new MarkdownBridge(executablePath)
    this.defaultOptions = {
      sanitize: true,
      breaks: true,
      linkify: true,
      typographer: true,
      highlight: true,
      tables: true,
      strikethrough: true,
      taskLists: true,
      emoji: false,
      footnotes: false,
      math: false,
      ...defaultOptions
    }
  }

  async render(markdown: string, options?: MarkdownOptions): Promise<string> {
    const mergedOptions = { ...this.defaultOptions, ...options }
    let html = await this.bridge.renderMarkdown(markdown, mergedOptions)
    
    if (mergedOptions.sanitize) {
      html = this.sanitizeHtml(html)
    }
    
    if (mergedOptions.highlight) {
      html = await this.highlightCode(html)
    }
    
    return html
  }

  async renderSafe(markdown: string): Promise<string> {
    return this.render(markdown, { 
      sanitize: true, 
      linkify: false,
      highlight: false 
    })
  }

  async renderWithTOC(markdown: string, options?: MarkdownOptions): Promise<{
    html: string
    toc: string
    metadata: MarkdownMetadata
  }> {
    const [html, metadata] = await Promise.all([
      this.render(markdown, options),
      this.bridge.extractMetadata(markdown)
    ])

    const toc = this.generateTOC(metadata.headings)

    return { html, toc, metadata }
  }

  private sanitizeHtml(html: string): string {
    const allowedTags = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'strong', 'em', 'del', 'mark',
      'ul', 'ol', 'li', 'blockquote', 'hr',
      'a', 'img', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'sup', 'sub'
    ]

    const allowedAttributes = {
      'a': ['href', 'title'],
      'img': ['src', 'alt', 'title'],
      'code': ['class'],
      'pre': ['class'],
      'table': ['class'],
      'ul': ['class'],
      'li': ['class'],
      'input': ['type', 'disabled', 'checked']
    }

    return html.replace(/<(\/?)([\w-]+)([^>]*)>/g, (match, slash, tag, attrs) => {
      if (!allowedTags.includes(tag.toLowerCase())) {
        return ''
      }

      if (slash) {
        return `</${tag}>`
      }

      const allowedAttrs = allowedAttributes[tag.toLowerCase() as keyof typeof allowedAttributes] || []
      const cleanAttrs = attrs.replace(/(\w+)=["']([^"']*)["']/g, (attrMatch: string, name: string, value: string) => {
        if (allowedAttrs.includes(name.toLowerCase())) {
          const cleanValue = value.replace(/[<>"']/g, '')
          return `${name}="${cleanValue}"`
        }
        return ''
      })

      return `<${tag}${cleanAttrs}>`
    })
  }

  private async highlightCode(html: string): Promise<string> {
    return html.replace(
      /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
      (match, language, code) => {
        const highlighted = this.highlightSyntax(code, language)
        return `<pre><code class="language-${language} hljs">${highlighted}</code></pre>`
      }
    )
  }

  private highlightSyntax(code: string, language: string): string {
    const keywords: { [key: string]: string[] } = {
      javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export'],
      typescript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'interface', 'type'],
      python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'try', 'except'],
      cpp: ['int', 'char', 'float', 'double', 'void', 'class', 'struct', 'if', 'else', 'for', 'while', 'return', 'include'],
      java: ['public', 'private', 'protected', 'class', 'interface', 'if', 'else', 'for', 'while', 'return', 'import']
    }

    const langKeywords = keywords[language] || []
    let highlighted = code

    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g')
      highlighted = highlighted.replace(regex, `<span class="hljs-keyword">${keyword}</span>`)
    })

    highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="hljs-comment">$&</span>')
    highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="hljs-comment">$&</span>')
    highlighted = highlighted.replace(/"[^"]*"/g, '<span class="hljs-string">$&</span>')
    highlighted = highlighted.replace(/'[^']*'/g, '<span class="hljs-string">$&</span>')
    highlighted = highlighted.replace(/\b\d+\b/g, '<span class="hljs-number">$&</span>')

    return highlighted
  }

  private generateTOC(headings: Array<{ level: number; text: string; line: number }>): string {
    if (headings.length === 0) return ''

    let toc = '<nav class="table-of-contents"><ul>'
    let currentLevel = 0

    headings.forEach(heading => {
      const id = heading.text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      
      if (heading.level > currentLevel) {
        for (let i = currentLevel; i < heading.level - 1; i++) {
          toc += '<li><ul>'
        }
        currentLevel = heading.level
      } else if (heading.level < currentLevel) {
        for (let i = heading.level; i < currentLevel; i++) {
          toc += '</ul></li>'
        }
        currentLevel = heading.level
      }

      toc += `<li><a href="#${id}">${heading.text}</a></li>`
    })

    for (let i = 1; i < currentLevel; i++) {
      toc += '</ul></li>'
    }

    toc += '</ul></nav>'
    return toc
  }

  destroy(): void {
    this.bridge.destroy()
  }
}
