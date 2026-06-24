import { performance } from 'node:perf_hooks'
import MarkdownIt from '../dist/index.js'
import { renderStockFast } from '../dist/experimental.js'
import { parseAndRender as oxParseAndRender } from '@ox-content/napi'

function para(n) {
  return `## Section ${n}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod.\n\n- a\n- b\n- c\n\n\`\`\`js\nconsole.log(${n})\n\`\`\`\n\n`
}

function makeDoc(targetChars) {
  let out = ''
  let i = 0
  while (out.length < targetChars)
    out += para(i++)
  return out
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

function measure(fn, iters) {
  const t0 = performance.now()
  let result
  for (let i = 0; i < iters; i++)
    result = fn()
  return { ms: (performance.now() - t0) / iters, result }
}

function stable(fn, iters, samples = 7) {
  for (let i = 0; i < 3; i++)
    fn()

  const values = []
  let result
  for (let i = 0; i < samples; i++) {
    const run = measure(fn, iters)
    values.push(run.ms)
    result = run.result
  }
  return { ms: median(values), result }
}

async function measureAsync(fn, iters) {
  const t0 = performance.now()
  let result
  for (let i = 0; i < iters; i++)
    result = await fn()
  return { ms: (performance.now() - t0) / iters, result }
}

async function stableAsync(fn, iters, samples = 7) {
  for (let i = 0; i < 3; i++)
    await fn()

  const values = []
  let result
  for (let i = 0; i < samples; i++) {
    const run = await measureAsync(fn, iters)
    values.push(run.ms)
    result = run.result
  }
  return { ms: median(values), result }
}

function pickIters(size) {
  if (size <= 5_000)
    return 500
  if (size <= 20_000)
    return 200
  if (size <= 100_000)
    return 60
  if (size <= 500_000)
    return 12
  return 6
}

const md = MarkdownIt({ stream: false })
const mdEnv = MarkdownIt({ stream: false })
const mdAsync = MarkdownIt({ stream: false })
const normalMd = MarkdownIt({ stream: false })
void normalMd.renderer
const sizes = [5_000, 20_000, 100_000, 500_000, 1_000_000]

console.log('| Size | markdown-it-ts.render | markdown-it-ts.render(env) | markdown-it-ts.renderAsync | @ox-content/napi | TS vs ox | renderStockFast | token parse+render |')
console.log('|---:|---:|---:|---:|---:|---:|---:|---:|')

for (const size of sizes) {
  const doc = makeDoc(size)
  const expected = normalMd.render(doc)
  const fast = renderStockFast(doc)

  if (fast === null)
    throw new Error(`renderStockFast returned null for ${size} chars`)
  if (fast !== expected)
    throw new Error(`renderStockFast output mismatch for ${size} chars`)

  const iters = pickIters(size)
  const fastMs = stable(() => renderStockFast(doc), iters).ms
  const tsMs = stable(() => md.render(doc), iters).ms
  const tsEnvMs = stable(() => mdEnv.render(doc, {}), iters).ms
  const tsAsyncMs = (await stableAsync(() => mdAsync.renderAsync(doc), iters)).ms
  const normalMs = stable(() => normalMd.render(doc), Math.max(1, Math.floor(iters / 10)), 5).ms
  const oxMs = stable(() => oxParseAndRender(doc).html, iters).ms

  console.log(`| ${size.toLocaleString()} | ${tsMs.toFixed(4)}ms | ${tsEnvMs.toFixed(4)}ms | ${tsAsyncMs.toFixed(4)}ms | ${oxMs.toFixed(4)}ms | ${(tsMs / oxMs).toFixed(2)}x | ${fastMs.toFixed(4)}ms | ${normalMs.toFixed(4)}ms |`)
}
