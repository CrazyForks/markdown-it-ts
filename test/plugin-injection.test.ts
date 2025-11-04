import { describe, it, expect } from 'vitest'
import markdownit, { withRenderer } from '../src/index'

describe('plugin injection (withRenderer)', () => {
  it('should not have render/renderInline by default', () => {
    const md = markdownit()
    expect(md.render).toBeUndefined()
    expect(md.renderInline).toBeUndefined()
    expect(md.renderer).toBeUndefined()
  })

  it('should inject render/renderInline and renderer when plugin is used', () => {
    const md = markdownit()
    withRenderer(md)
    expect(typeof md.render).toBe('function')
    expect(typeof md.renderInline).toBe('function')
    expect(md.renderer).toBeDefined()
    expect(md.render('# Hello')).toContain('<h')
    expect(md.renderInline('a *b* c')).toContain('a')
  })

  it('should allow custom highlight via options', () => {
    const md = markdownit({ highlight: (str, lang) => `<pre><code class="${lang}">${str}</code></pre>` })
    withRenderer(md)
    const html = md.render('```js\nconsole.log(1)\n```')
    // Note: fence content includes trailing newline, so highlight function receives 'console.log(1)\n'
    expect(html).toContain('<pre><code class="js">console.log(1)\n</code></pre>')
  })
})
