import type { MarkdownItCore, MarkdownItOptions } from '../index'
import Renderer from '../../../markdown-it/lib/renderer.mjs'

/**
 * Attach rendering capabilities to a core-only md instance.
 * Importing this module brings renderer code into the bundle explicitly,
 * preserving tree-shaking when consumers only use md.parse/parseInline.
 */
export function withRenderer(md: any, options?: MarkdownItOptions) {
  const renderer = new Renderer()

  md.renderer = renderer

  // Apply options if provided (e.g., typographer, quotes, etc.)
  if (options && typeof options === 'object') {
    md.set(options)
  }

  md.render = function (src: string, env: Record<string, unknown> = {}) {
    const tokens = md.parse(src, env)
    return renderer.render(tokens as any, md.options, env)
  }

  md.renderInline = function (src: string, env: Record<string, unknown> = {}) {
    const tokens = md.parseInline(src, env)
    // parseInline returns array with single inline token; renderer.render handles it
    return renderer.render(tokens as any, md.options, env)
  }

  return md as MarkdownItCore & {
    renderer: Renderer
    render: (src: string, env?: Record<string, unknown>) => string
    renderInline: (src: string, env?: Record<string, unknown>) => string
  }
}

export default withRenderer
