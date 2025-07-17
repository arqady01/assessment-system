import { NextApiRequest, NextApiResponse } from 'next'
import { MarkdownProcessor } from '@/lib/markdown/markdown-bridge'
import { SecurityValidator } from '@/lib/security/cpp-bridge'

interface RenderRequest {
  markdown: string
  options?: {
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
    enableTOC?: boolean
  }
}

interface RenderResponse {
  success: boolean
  html?: string
  toc?: string
  metadata?: any
  stats?: {
    length: number
    lines: number
    executionTime: number
    cacheHit: boolean
  }
  error?: string
}

const markdownProcessor = new MarkdownProcessor(
  process.env.MARKDOWN_EXECUTABLE || './markdown_renderer',
  {
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
    math: false
  }
)

const securityValidator = new SecurityValidator()
const cache = new Map<string, { result: any; expiry: number }>()
const CACHE_DURATION = 5 * 60 * 1000

export default async function handler(req: NextApiRequest, res: NextApiResponse<RenderResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const startTime = Date.now()
  let cacheHit = false

  try {
    const { markdown, options }: RenderRequest = req.body

    if (!markdown) {
      return res.status(400).json({ success: false, error: 'Markdown content required' })
    }

    if (markdown.length > 1000000) {
      return res.status(413).json({ success: false, error: 'Content too large' })
    }

    const cacheKey = generateCacheKey(markdown, options)
    const cached = cache.get(cacheKey)
    
    if (cached && cached.expiry > Date.now()) {
      cacheHit = true
      return res.status(200).json({
        success: true,
        ...cached.result,
        stats: {
          ...cached.result.stats,
          executionTime: Date.now() - startTime,
          cacheHit: true
        }
      })
    }

    const inputValid = await securityValidator.validateUserInput(markdown, 'xss')
    if (!inputValid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Potentially unsafe content detected' 
      })
    }

    let result: any

    if (options?.enableTOC) {
      result = await markdownProcessor.renderWithTOC(markdown, options)
    } else {
      const [html, metadata] = await Promise.all([
        markdownProcessor.render(markdown, options),
        markdownProcessor.bridge.extractMetadata(markdown)
      ])
      result = { html, metadata, toc: '' }
    }

    const stats = {
      length: result.html.length,
      lines: markdown.split('\n').length,
      executionTime: Date.now() - startTime,
      cacheHit: false
    }

    const response = {
      success: true,
      html: result.html,
      toc: result.toc || '',
      metadata: result.metadata,
      stats
    }

    cache.set(cacheKey, {
      result: response,
      expiry: Date.now() + CACHE_DURATION
    })

    cleanupCache()

    res.status(200).json(response)

  } catch (error) {
    console.error('Markdown rendering error:', error)
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Rendering failed',
      stats: {
        length: 0,
        lines: 0,
        executionTime: Date.now() - startTime,
        cacheHit: false
      }
    })
  }
}

function generateCacheKey(markdown: string, options?: any): string {
  const optionsStr = options ? JSON.stringify(options) : ''
  const content = `${markdown}:${optionsStr}`
  return require('crypto').createHash('md5').update(content).digest('hex')
}

function cleanupCache(): void {
  const now = Date.now()
  for (const [key, value] of cache.entries()) {
    if (value.expiry <= now) {
      cache.delete(key)
    }
  }
}
