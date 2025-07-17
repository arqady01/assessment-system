import { NextApiRequest, NextApiResponse } from 'next'
import { MarkdownBridge } from '@/lib/markdown/markdown-bridge'
import { SecurityValidator } from '@/lib/security/cpp-bridge'

interface ValidateRequest {
  markdown: string
  strict?: boolean
}

interface ValidationResult {
  valid: boolean
  errors: Array<{
    line: number
    column: number
    message: string
    severity: 'error' | 'warning' | 'info'
    rule: string
  }>
  warnings: Array<{
    line: number
    column: number
    message: string
    severity: 'error' | 'warning' | 'info'
    rule: string
  }>
  stats: {
    lines: number
    characters: number
    words: number
    headings: number
    links: number
    images: number
    codeBlocks: number
  }
}

interface ValidateResponse {
  success: boolean
  result?: ValidationResult
  error?: string
}

const markdownBridge = new MarkdownBridge()
const securityValidator = new SecurityValidator()

export default async function handler(req: NextApiRequest, res: NextApiResponse<ValidateResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { markdown, strict = false }: ValidateRequest = req.body

    if (!markdown) {
      return res.status(400).json({ success: false, error: 'Markdown content required' })
    }

    if (markdown.length > 500000) {
      return res.status(413).json({ success: false, error: 'Content too large for validation' })
    }

    const inputValid = await securityValidator.validateUserInput(markdown, 'xss')
    if (!inputValid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Potentially unsafe content detected' 
      })
    }

    const [basicValidation, metadata] = await Promise.all([
      markdownBridge.validateMarkdown(markdown),
      markdownBridge.extractMetadata(markdown)
    ])

    const lines = markdown.split('\n')
    const errors: ValidationResult['errors'] = []
    const warnings: ValidationResult['warnings'] = []

    validateSyntax(lines, errors, warnings, strict)
    validateLinks(metadata.links, errors, warnings)
    validateImages(metadata.images, errors, warnings)
    validateCodeBlocks(metadata.codeBlocks, errors, warnings)
    validateHeadings(metadata.headings, errors, warnings, strict)

    const stats = {
      lines: lines.length,
      characters: markdown.length,
      words: countWords(markdown),
      headings: metadata.headings.length,
      links: metadata.links.length,
      images: metadata.images.length,
      codeBlocks: metadata.codeBlocks.length
    }

    const result: ValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings,
      stats
    }

    res.status(200).json({ success: true, result })

  } catch (error) {
    console.error('Markdown validation error:', error)
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Validation failed'
    })
  }
}

function validateSyntax(
  lines: string[], 
  errors: ValidationResult['errors'], 
  warnings: ValidationResult['warnings'],
  strict: boolean
): void {
  let inCodeBlock = false
  let codeBlockStart = 0

  lines.forEach((line, index) => {
    const lineNumber = index + 1

    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeBlockStart = lineNumber
      } else {
        inCodeBlock = false
      }
      return
    }

    if (inCodeBlock) return

    if (line.match(/^#{7,}/)) {
      errors.push({
        line: lineNumber,
        column: 1,
        message: 'Heading level too deep (max 6)',
        severity: 'error',
        rule: 'heading-depth'
      })
    }

    if (line.match(/^#[^#\s]/)) {
      warnings.push({
        line: lineNumber,
        column: 1,
        message: 'Missing space after heading marker',
        severity: 'warning',
        rule: 'heading-space'
      })
    }

    if (line.match(/\[([^\]]*)\]\(\s*\)/)) {
      errors.push({
        line: lineNumber,
        column: line.indexOf('](') + 1,
        message: 'Empty link URL',
        severity: 'error',
        rule: 'empty-link'
      })
    }

    if (line.match(/!\[([^\]]*)\]\(\s*\)/)) {
      errors.push({
        line: lineNumber,
        column: line.indexOf('](') + 1,
        message: 'Empty image URL',
        severity: 'error',
        rule: 'empty-image'
      })
    }

    if (strict) {
      if (line.length > 120) {
        warnings.push({
          line: lineNumber,
          column: 121,
          message: 'Line too long (>120 characters)',
          severity: 'warning',
          rule: 'line-length'
        })
      }

      if (line.match(/\s+$/)) {
        warnings.push({
          line: lineNumber,
          column: line.length,
          message: 'Trailing whitespace',
          severity: 'warning',
          rule: 'trailing-whitespace'
        })
      }

      if (line.match(/\t/)) {
        warnings.push({
          line: lineNumber,
          column: line.indexOf('\t') + 1,
          message: 'Use spaces instead of tabs',
          severity: 'warning',
          rule: 'no-tabs'
        })
      }
    }
  })

  if (inCodeBlock) {
    errors.push({
      line: codeBlockStart,
      column: 1,
      message: 'Unclosed code block',
      severity: 'error',
      rule: 'unclosed-code-block'
    })
  }
}

function validateLinks(
  links: Array<{ text: string; url: string }>,
  errors: ValidationResult['errors'],
  warnings: ValidationResult['warnings']
): void {
  links.forEach(link => {
    if (!link.text.trim()) {
      warnings.push({
        line: 0,
        column: 0,
        message: 'Empty link text',
        severity: 'warning',
        rule: 'empty-link-text'
      })
    }

    if (link.url.startsWith('http://')) {
      warnings.push({
        line: 0,
        column: 0,
        message: 'Consider using HTTPS instead of HTTP',
        severity: 'warning',
        rule: 'insecure-link'
      })
    }

    if (link.url.includes('javascript:')) {
      errors.push({
        line: 0,
        column: 0,
        message: 'JavaScript URLs are not allowed',
        severity: 'error',
        rule: 'javascript-url'
      })
    }
  })
}

function validateImages(
  images: Array<{ alt: string; src: string }>,
  errors: ValidationResult['errors'],
  warnings: ValidationResult['warnings']
): void {
  images.forEach(image => {
    if (!image.alt.trim()) {
      warnings.push({
        line: 0,
        column: 0,
        message: 'Missing alt text for image',
        severity: 'warning',
        rule: 'missing-alt-text'
      })
    }

    if (!image.src.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
      warnings.push({
        line: 0,
        column: 0,
        message: 'Unusual image file extension',
        severity: 'warning',
        rule: 'image-extension'
      })
    }

    if (image.src.startsWith('http://')) {
      warnings.push({
        line: 0,
        column: 0,
        message: 'Consider using HTTPS for images',
        severity: 'warning',
        rule: 'insecure-image'
      })
    }
  })
}

function validateCodeBlocks(
  codeBlocks: Array<{ language: string; code: string }>,
  errors: ValidationResult['errors'],
  warnings: ValidationResult['warnings']
): void {
  codeBlocks.forEach(block => {
    if (!block.language.trim()) {
      warnings.push({
        line: 0,
        column: 0,
        message: 'Code block missing language specification',
        severity: 'warning',
        rule: 'missing-language'
      })
    }

    if (block.code.length > 10000) {
      warnings.push({
        line: 0,
        column: 0,
        message: 'Very large code block (>10k characters)',
        severity: 'warning',
        rule: 'large-code-block'
      })
    }
  })
}

function validateHeadings(
  headings: Array<{ level: number; text: string; line: number }>,
  errors: ValidationResult['errors'],
  warnings: ValidationResult['warnings'],
  strict: boolean
): void {
  if (headings.length === 0) {
    warnings.push({
      line: 0,
      column: 0,
      message: 'Document has no headings',
      severity: 'info',
      rule: 'no-headings'
    })
    return
  }

  if (headings[0].level !== 1 && strict) {
    warnings.push({
      line: headings[0].line,
      column: 1,
      message: 'Document should start with H1',
      severity: 'warning',
      rule: 'first-heading-h1'
    })
  }

  for (let i = 1; i < headings.length; i++) {
    const current = headings[i]
    const previous = headings[i - 1]

    if (current.level > previous.level + 1) {
      warnings.push({
        line: current.line,
        column: 1,
        message: `Heading level jumps from H${previous.level} to H${current.level}`,
        severity: 'warning',
        rule: 'heading-increment'
      })
    }
  }

  const duplicateTexts = new Set<string>()
  const seen = new Set<string>()
  
  headings.forEach(heading => {
    const text = heading.text.toLowerCase()
    if (seen.has(text)) {
      duplicateTexts.add(text)
    }
    seen.add(text)
  })

  headings.forEach(heading => {
    if (duplicateTexts.has(heading.text.toLowerCase())) {
      warnings.push({
        line: heading.line,
        column: 1,
        message: 'Duplicate heading text',
        severity: 'warning',
        rule: 'duplicate-heading'
      })
    }
  })
}

function countWords(text: string): number {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length
}
