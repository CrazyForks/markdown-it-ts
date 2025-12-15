import { describe, expect, it } from 'vitest'
import MarkdownItOriginal from 'markdown-it'
import markdownIt from '../src'

describe('emphasis underscore flanking rules', () => {
  it('does not parse intraword underscores as emphasis', () => {
    const ours = markdownIt().render('asdsa_a_')
    const original = new MarkdownItOriginal().render('asdsa_a_')
    expect(ours).toBe(original)
    expect(ours).toBe('<p>asdsa_a_</p>\n')
  })

  it('parses _a_ when preceded by whitespace', () => {
    const ours = markdownIt().render('asdsa _a_')
    const original = new MarkdownItOriginal().render('asdsa _a_')
    expect(ours).toBe(original)
    expect(ours).toBe('<p>asdsa <em>a</em></p>\n')
  })

  it('parses _a_ at start of line', () => {
    const ours = markdownIt().render('_a_')
    const original = new MarkdownItOriginal().render('_a_')
    expect(ours).toBe(original)
    expect(ours).toBe('<p><em>a</em></p>\n')
  })
})

