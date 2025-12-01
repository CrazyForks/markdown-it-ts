import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const perfPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../docs/perf-latest.json')
const outPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../docs/perf-latest-summary.csv')
const outRenderPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../docs/perf-render-summary.csv')

function csvEscape(v) {
  if (v === null || v === undefined) return ''
  const s = String(v)
  if (s.includes(',') || s.includes('\n') || s.includes('"')) return '"' + s.replace(/"/g, '""') + '"'
  return s
}

const json = JSON.parse(readFileSync(perfPath, 'utf8'))
const results = json.results || []
const render = json.renderComparisons || []

// Main parse CSV
const fields = ['size','scenario','label','oneShotMs','appendWorkloadMs','appendLineMs','replaceParagraphMs']
const lines = [fields.join(',')]
for (const r of results) {
  const row = fields.map(f => csvEscape(r[f] ?? '')).join(',')
  lines.push(row)
}
writeFileSync(outPath, lines.join('\n'))

// Render CSV
const rfields = ['size','scenario','label','renderMs']
const rlines = [rfields.join(',')]
for (const r of render) {
  const row = rfields.map(f => csvEscape(r[f] ?? '')).join(',')
  rlines.push(row)
}
writeFileSync(outRenderPath, rlines.join('\n'))

console.log('Wrote', outPath)
console.log('Wrote', outRenderPath)
