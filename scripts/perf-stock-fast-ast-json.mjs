import assert from 'node:assert/strict'
import { performance } from 'node:perf_hooks'
import { parse as oxParse } from '@ox-content/napi'
import MarkdownIt from '../dist/index.js'
import { parseStockFastAstJson } from '../dist/experimental.js'

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

const mdDefault = MarkdownIt({ stream: false })
const sizes = [5_000, 20_000, 100_000, 500_000, 1_000_000]

console.log('| Size | parseStockFastAstJson | @ox-content/napi parse | AST JSON vs ox | @ox-content/napi parse + JSON.parse | token parse | token vs ox |')
console.log('|---:|---:|---:|---:|---:|---:|---:|')

for (const size of sizes) {
  const doc = makeDoc(size)
  const astJson = parseStockFastAstJson(doc)
  if (astJson === null)
    throw new Error(`parseStockFastAstJson returned null for ${size} chars`)

  assert.deepEqual(JSON.parse(astJson), JSON.parse(oxParse(doc).ast))

  const iters = pickIters(size)
  const fastMs = stable(() => parseStockFastAstJson(doc), iters).ms
  const oxMs = stable(() => oxParse(doc), iters).ms
  const oxJsonMs = stable(() => JSON.parse(oxParse(doc).ast), iters).ms
  const tokenDefaultMs = stable(() => mdDefault.parse(doc), Math.max(1, Math.floor(iters / 10)), 5).ms

  console.log(`| ${size.toLocaleString()} | ${fastMs.toFixed(4)}ms | ${oxMs.toFixed(4)}ms | ${(fastMs / oxMs).toFixed(2)}x | ${oxJsonMs.toFixed(4)}ms | ${tokenDefaultMs.toFixed(4)}ms | ${(tokenDefaultMs / oxMs).toFixed(2)}x |`)
}
