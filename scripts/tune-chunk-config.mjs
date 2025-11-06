// Auto-tune chunk sizes and chunk counts across sizes to suggest best configs
// Usage: npm run build && node scripts/tune-chunk-config.mjs

import { performance } from 'node:perf_hooks'
import MarkdownIt from '../dist/index.js'
import MarkdownItOriginal from 'markdown-it'

function para(n) {
  return `## Section ${n}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod.\n\n- a\n- b\n- c\n\n\`\`\`js\nconsole.log(${n})\n\`\`\`\n\n`
}

function makeParasByChars(targetChars) {
  const paras = []
  let s = ''
  let i = 0
  while (s.length < targetChars) {
    const p = para(i++)
    paras.push(p)
    s += p
  }
  return { paras, doc: s }
}

function splitParasIntoSteps(paras, steps) {
  const per = Math.max(1, Math.floor(paras.length / steps))
  const parts = []
  for (let i = 0; i < steps - 1; i++) parts.push(paras.slice(i * per, (i + 1) * per).join(''))
  parts.push(paras.slice((steps - 1) * per).join(''))
  return parts
}

function measure(fn) {
  const t0 = performance.now()
  const res = fn()
  const t1 = performance.now()
  return { ms: t1 - t0, res }
}

const SIZES = [5_000, 20_000, 50_000, 100_000, 200_000]
const APP_STEPS = 6 // 1 initial + 5 appends

// Search grids (keep modest to finish quickly)
const FULL_CHARS = [8000, 12000, 16000, 20000, 24000, 32000]
const FULL_LINES = [150, 200, 250, 300]
const FULL_MAXCHUNKS = [6, 8, 10, 12]

const STREAM_CHARS = [10000, 16000, 20000]
const STREAM_LINES = [200, 250, 300]

function fmt(ms) { return `${ms.toFixed(2)}ms` }

const results = []

for (const size of SIZES) {
  const { paras, doc } = makeParasByChars(size)
  const appParts = splitParasIntoSteps(paras, APP_STEPS)

  // Baselines
  const mdFullPlain = MarkdownIt({ stream: false })
  const oneFullPlain = measure(() => mdFullPlain.parse(doc, {})).ms

  const mdBaseline = MarkdownItOriginal()
  const oneBaseline = measure(() => mdBaseline.parse(doc, {})).ms

  // A) Full (non-stream) grid
  let bestFull = { ms: oneFullPlain, cfg: { mode: 'full-plain' } }
  for (const maxChunkChars of FULL_CHARS) {
    for (const maxChunkLines of FULL_LINES) {
      for (const maxChunks of FULL_MAXCHUNKS) {
        const md = MarkdownIt({
          stream: false,
          fullChunkedFallback: true,
          fullChunkThresholdChars: 0, // force chunked
          fullChunkSizeChars: maxChunkChars,
          fullChunkSizeLines: maxChunkLines,
          fullChunkFenceAware: true,
          fullChunkMaxChunks: maxChunks,
        })
        const ms = measure(() => md.parse(doc, {})).ms
        if (ms < bestFull.ms) bestFull = { ms, cfg: { mode: 'full-chunk', maxChunkChars, maxChunkLines, maxChunks } }
      }
    }
  }

  // B) Stream hybrid grid (focus on append workload)
  let bestStreamAppend = { ms: Number.POSITIVE_INFINITY, cfg: { mode: 'stream-cache' } }
  // also track one-shot for info
  let bestStreamOne = { ms: Number.POSITIVE_INFINITY, cfg: null }

  for (const sChars of STREAM_CHARS) {
    for (const sLines of STREAM_LINES) {
      const md = MarkdownIt({
        stream: true,
        streamChunkedFallback: true,
        streamChunkAdaptive: false,
        streamChunkSizeChars: sChars,
        streamChunkSizeLines: sLines,
        streamChunkFenceAware: true,
      })
      const env = { tune: true }
      const oneMs = measure(() => md.stream.parse(doc, env)).ms

      let acc = ''
      let appendMs = 0
      for (let i = 0; i < appParts.length; i++) {
        if (acc.length && acc.charCodeAt(acc.length - 1) !== 0x0A) acc += '\n'
        let piece = appParts[i]
        if (piece.length && piece.charCodeAt(piece.length - 1) !== 0x0A) piece += '\n'
        acc += piece
        const t0 = performance.now()
        md.stream.parse(acc, env)
        appendMs += performance.now() - t0
      }

      if (appendMs < bestStreamAppend.ms) bestStreamAppend = { ms: appendMs, cfg: { mode: 'stream-hybrid', streamChunkSizeChars: sChars, streamChunkSizeLines: sLines } }
      if (oneMs < bestStreamOne.ms) bestStreamOne = { ms: oneMs, cfg: { mode: 'stream-hybrid', streamChunkSizeChars: sChars, streamChunkSizeLines: sLines } }
    }
  }

  results.push({
    size,
    baselineOneMs: oneBaseline,
    fullPlainOneMs: oneFullPlain,
    bestFull,
    bestStreamAppend,
    bestStreamOne,
  })
}

console.log('--- Chunk Tuning Summary ---')
for (const r of results) {
  console.log(`\nSize=${r.size} chars`)
  console.log(`- Baseline (markdown-it) one-shot: ${fmt(r.baselineOneMs)}`)
  console.log(`- Full plain (S5) one-shot:       ${fmt(r.fullPlainOneMs)}`)
  if (r.bestFull.cfg.mode === 'full-plain') {
    console.log(`- Full chunk (best):               ${fmt(r.bestFull.ms)} (no chunk beats full-plain here)`)  
  } else {
    const c = r.bestFull.cfg
    console.log(`- Full chunk (best):               ${fmt(r.bestFull.ms)}  cfg: chars=${c.maxChunkChars}, lines=${c.maxChunkLines}, maxChunks=${c.maxChunks}`)
  }
  const sc = r.bestStreamAppend.cfg
  console.log(`- Stream hybrid (best append):     ${fmt(r.bestStreamAppend.ms)}  cfg: sChars=${sc.streamChunkSizeChars}, sLines=${sc.streamChunkSizeLines}`)
  const so = r.bestStreamOne.cfg
  console.log(`- Stream hybrid (best one-shot):   ${fmt(r.bestStreamOne.ms)}  cfg: sChars=${so.streamChunkSizeChars}, sLines=${so.streamChunkSizeLines}`)
}

// Emit concise recommendations block
console.log('\n\n--- Recommended configs ---')
for (const r of results) {
  const size = r.size
  const recFull = r.bestFull.cfg.mode === 'full-plain'
    ? { mode: 'full-plain' }
    : { mode: 'full-chunk', chars: r.bestFull.cfg.maxChunkChars, lines: r.bestFull.cfg.maxChunkLines, maxChunks: r.bestFull.cfg.maxChunks }
  const recStream = { mode: 'stream-hybrid', sChars: r.bestStreamAppend.cfg.streamChunkSizeChars, sLines: r.bestStreamAppend.cfg.streamChunkSizeLines }
  console.log(`size=${size}: full=${JSON.stringify(recFull)} stream=${JSON.stringify(recStream)}`)
}
