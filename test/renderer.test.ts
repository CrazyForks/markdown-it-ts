import { describe, expect, it } from 'vitest'
import { parse, parseInline } from '../src/parse'
import { render, renderAsync } from '../src/render'
import markdownIt from '../src'

describe('renderer', () => {
  it('renders emphasis inside paragraph', () => {
    const tokens = parse('Hello *world* from markdown-it-ts')
    const html = render(tokens as any)
    expect(html).toBe('<p>Hello <em>world</em> from markdown-it-ts</p>\n')
  })

  it('accepts raw markdown when using the helper', () => {
    const html = render('# Hello world')
    expect(html).toContain('<h1>Hello world</h1>')
  })

  it('inline parse produces strong token', () => {
    const inline = parseInline('inline **bold** text')
    const inlineToken = Array.isArray(inline) ? inline[0] : inline
    const hasStrong = !!inlineToken.children?.some((t: any) => t.type === 'strong_open')
    expect(hasStrong).toBe(true)
  })

  it('renderAsync matches sync output without async rules', async () => {
    const tokens = parse('Paragraph with `code` and **strong** text')
    const syncHtml = render(tokens as any)
    await expect(renderAsync(tokens as any)).resolves.toBe(syncHtml)
  })

  it('renderAsync awaits async highlight rules', async () => {
    const src = '```js\nconsole.log(1)\n```'
    const html = await renderAsync(src, {
      highlight: async (str: string, lang: string) => `<span data-lang="${lang}">${str.toUpperCase()}</span>`,
    })
    expect(html).toContain('<span data-lang="js">')
  })

  it('sync render throws when async rule output is provided', () => {
    expect(() => render('```js\n1\n```', {
      highlight: async () => '<span>async</span>',
    } as any)).toThrowError(/renderAsync/)
  })

  it('MarkdownIt.renderAsync wires through renderer async support', async () => {
    const md = markdownIt()
    md.set({
      highlight: async (code: string) => `<mark>${code.trim()}</mark>`,
    })
    const html = await md.renderAsync('```txt\nhello\n```')
    expect(html).toContain('<mark>hello')
  })
})
