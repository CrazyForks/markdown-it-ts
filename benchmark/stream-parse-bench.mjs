#!/usr/bin/env node
// Runnable JS benchmark that imports built `dist/index.js`.
// Usage:
// 1) Build package: `pnpm run build`
// 2) Run: `node benchmark/stream-parse-bench.mjs`

import { existsSync } from 'fs'
import { resolve } from 'path'

const distPath = resolve('.', 'dist', 'index.js')
if (!existsSync(distPath)) {
  console.error('dist/index.js not found. Please run `pnpm run build` first.')
  process.exitCode = 2
}

const MarkdownIt = await import(distPath).then(m => m.default ?? m).catch((e) => {
  console.error('Failed to import dist/index.js:', e && e.message ? e.message : e)
  process.exitCode = 3
  process.exit()
})

function hrToMs(ns) {
  return Number(ns) / 1e6
}

function runScenario(mdFactory, input, iterations) {
  const md = mdFactory()
  // warmup
  md.parse(input)
  const start = process.hrtime.bigint()
  for (let i = 0; i < iterations; i++) {
    md.parse(input)
  }
  const end = process.hrtime.bigint()
  return end - start
}

const strategies = [
  { name: 'chars', opts: { stream: true, streamContextParseStrategy: 'chars', streamContextParseMinChars: 200 } },
  { name: 'lines', opts: { stream: true, streamContextParseStrategy: 'lines', streamContextParseMinLines: 2 } },
  { name: 'constructs', opts: { stream: true, streamContextParseStrategy: 'constructs', streamContextParseMinChars: 200, streamContextParseMinLines: 2 } },
]

const samples = [
  { name: 'small-plain', text: 'Short line.\nAnother short line.\n', iters: 2000 },
  { name: 'small-list', text: 'List:\n- item one\n- item two\n', iters: 2000 },
  { name: 'mid-paragraphs', text: ('Paragraph line.\n'.repeat(50)) + '\n', iters: 200 },
  { name: 'mid-constructs', text: ('1. numbered\n2. numbered\n\n> blockquote line\n\n').repeat(5), iters: 200 },
  { name: 'large', text: ('Line \n'.repeat(2000)) + '\n', iters: 20 },
]

console.log('Stream parse benchmark (using dist/index.js)')
console.log('Make sure to run `pnpm run build` if dist is missing')
console.log('')

for (const sample of samples) {
  console.log(`Sample: ${sample.name} (len=${sample.text.length}) iters=${sample.iters}`)
  for (const s of strategies) {
    const mdFactory = () => MarkdownIt(s.opts)
    const ns = runScenario(mdFactory, sample.text, sample.iters)
    const ms = hrToMs(ns)
    console.log(`  ${s.name.padEnd(12)}: ${ms.toFixed(3)} ms total  avg=${(ms / sample.iters).toFixed(3)} ms`)
  }
  console.log('')
}

console.log('Done')
