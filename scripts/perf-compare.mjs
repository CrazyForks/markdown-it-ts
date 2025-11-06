// Compare two perf JSON snapshots and report deltas; exit non-zero on regressions
// Usage: node scripts/perf-compare.mjs <current-json> <baseline-json> [--threshold=0.10]

import { readFileSync } from 'node:fs'

function load(path) { return JSON.parse(readFileSync(path, 'utf8')) }

function keyOf(r) { return `${r.size}-${r.scenario}` }

function pct(a, b) { return (a - b) / b }

function fmtPct(x) { return (x * 100).toFixed(1) + '%' }

function main() {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.error('Usage: node scripts/perf-compare.mjs <current-json> <baseline-json> [--threshold=0.10]')
    process.exit(2)
  }
  const cur = load(args[0])
  const base = load(args[1])
  const thArg = args.find(a => a.startsWith('--threshold='))
  const threshold = thArg ? parseFloat(thArg.split('=')[1]) : 0.10

  const curMap = new Map(cur.results.map(r => [keyOf(r), r]))
  const baseMap = new Map(base.results.map(r => [keyOf(r), r]))

  const rows = []
  let regressions = 0

  for (const [k, c] of curMap.entries()) {
    const b = baseMap.get(k)
    if (!b) continue
    const oneDelta = pct(c.oneShotMs, b.oneShotMs)
    const appDelta = pct(c.appendWorkloadMs, b.appendWorkloadMs)
    const regOne = oneDelta > threshold
    const regApp = appDelta > threshold
    if (regOne || regApp) regressions++
    rows.push({ key: k, size: c.size, scenario: c.scenario, oneDelta, appDelta, regOne, regApp, cur: c, base: b })
  }

  rows.sort((a,b)=> a.size - b.size || a.scenario.localeCompare(b.scenario))

  console.log('Perf comparison vs baseline')
  console.log('Threshold for regression: +' + fmtPct(threshold))
  console.log('| Size | Scenario | One Δ | Append Δ |')
  console.log('|---:|:--|--:|--:|')
  for (const r of rows) {
    const one = (r.oneDelta >= 0 ? '+' : '') + fmtPct(r.oneDelta)
    const app = (r.appDelta >= 0 ? '+' : '') + fmtPct(r.appDelta)
    const mark = (r.regOne || r.regApp) ? ' (!) ' : ' '
    console.log(`| ${r.size} | ${r.scenario} | ${one}${mark}| ${app}${mark}|`)
  }

  if (regressions) {
    console.error(`Detected ${regressions} regression(s) exceeding threshold.`)
    process.exit(1)
  }
}

main()
