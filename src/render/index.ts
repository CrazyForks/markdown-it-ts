import type { Token } from '../common/token'
import type { RendererEnv, RendererOptions } from './renderer'
import { parse } from '../parse'
import Renderer from './renderer'

type RenderInput = string | Token[]

const sharedRenderer = new Renderer()

const ensureTokens = (input: RenderInput, env: RendererEnv) => (typeof input === 'string' ? parse(input, env) : input)

/**
 * Render markdown or pre-generated tokens to HTML using a shared Renderer instance.
 */
export function render(input: RenderInput, options: RendererOptions = {}, env: RendererEnv = {}) {
  const tokens = ensureTokens(input, env)
  return sharedRenderer.render(tokens, options, env)
}

/**
 * Asynchronous render variant that awaits async rules (e.g. async highlight).
 */
export async function renderAsync(input: RenderInput, options: RendererOptions = {}, env: RendererEnv = {}) {
  const tokens = ensureTokens(input, env)
  return sharedRenderer.renderAsync(tokens, options, env)
}

export { Renderer }
export type { RendererEnv, RendererOptions }

export default render
