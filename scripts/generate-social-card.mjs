#!/usr/bin/env node
// Generate shareable SVG social cards (1200x630) highlighting key features and perf numbers
// Reads docs/perf-latest.json and writes assets/social-card-<variant>.svg
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname } from 'node:path'

function loadLatest() {
  const p = new URL('../docs/perf-latest.json', import.meta.url)
  return JSON.parse(readFileSync(p, 'utf8'))
}

function formatMs(ms) {
  if (ms < 1) return `${ms.toFixed(2)}ms`
  return `${ms.toFixed(2)}ms`
}

function pickBest(results, size, field) {
  const arr = results.filter(r => r.size === size)
  const baseline = arr.find(r => r.scenario === 'M1')
  const ts = arr.filter(r => r.scenario !== 'M1')
  const best = [...ts].sort((a,b)=> a[field] - b[field])[0]
  return { baseline, best }
}

function ratioFaster(baseline, ts) {
  if (!baseline || !ts) return { factor: 1, text: '1.0×' }
  const factor = baseline / ts
  return { factor, text: `${factor.toFixed(factor >= 10 ? 0 : factor >= 3 ? 1 : 1)}×` }
}

function generateSVGClassic(data) {
  const W = 1200, H = 630
  const pad = 56
  const title = 'markdown-it-ts'
  const subtitle = 'TypeScript rewrite of markdown-it'
  const tags = ['Type-safe', 'Modular', 'Streaming parser']

  const one100 = data.one100
  const app20 = data.app20
  const app50 = data.app50

  const accent = '#22d3ee' // cyan-400
  const fg = '#e5e7eb' // gray-200
  const dim = '#9ca3af' // gray-400
  const bg1 = '#0f172a' // slate-900
  const bg2 = '#111827' // gray-900

  const perfRowY = 280
  const colW = 340
  const colGap = 40
  const col1X = pad
  const col2X = pad + colW + colGap
  const col3X = pad + (colW + colGap) * 2

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <style>
      .title{ font: 700 72px/1.1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${fg}; }
      .subtitle{ font: 500 28px/1.3 ui-sans-serif, Inter, system-ui, -apple-system; fill:${dim}; }
      .tag{ font: 600 22px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${accent}; }
      .label{ font: 600 22px/1.2 ui-sans-serif, Inter, system-ui, -apple-system; fill:${fg}; }
      .ms{ font: 700 26px/1.2 ui-sans-serif, Inter, system-ui, -apple-system; fill:${fg}; }
      .vs{ font: 600 18px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${dim}; }
      .x{ font: 700 24px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${accent}; }
      .foot{ font: 600 22px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${dim}; }
      .pill{ fill: rgba(34,211,238,0.12); stroke:${accent}; stroke-width:1.5; rx:10; }
      .card{ fill: rgba(148,163,184,0.08); stroke: rgba(148,163,184,0.18); stroke-width:1; rx:14; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>

  <text x="${pad}" y="${pad + 70}" class="title">${title}</text>
  <text x="${pad}" y="${pad + 120}" class="subtitle">${subtitle}</text>

  <!-- tags -->
  <g transform="translate(${pad}, ${pad + 150})">
    <rect class="pill" x="0" y="-22" width="150" height="36" rx="10"/>
    <text x="14" y="0" class="tag">${tags[0]}</text>
    <rect class="pill" x="170" y="-22" width="140" height="36" rx="10"/>
    <text x="184" y="0" class="tag">${tags[1]}</text>
    <rect class="pill" x="330" y="-22" width="220" height="36" rx="10"/>
    <text x="344" y="0" class="tag">${tags[2]}</text>
  </g>

  <!-- perf cards -->
  <g transform="translate(0, ${perfRowY})">
    <g transform="translate(${col1X},0)">
      <rect class="card" x="0" y="0" width="${colW}" height="220" rx="14"/>
      <text x="16" y="40" class="label">One-shot · 100k</text>
      <text x="16" y="90" class="ms">${formatMs(one100.ts)}</text>
      <text x="16" y="120" class="vs">vs baseline ${formatMs(one100.base)}</text>
      <text x="16" y="160" class="x">~${one100.ratio}</text>
    </g>
    <g transform="translate(${col2X},0)">
      <rect class="card" x="0" y="0" width="${colW}" height="220" rx="14"/>
      <text x="16" y="40" class="label">Append · 20k</text>
      <text x="16" y="90" class="ms">${formatMs(app20.ts)}</text>
      <text x="16" y="120" class="vs">vs baseline ${formatMs(app20.base)}</text>
      <text x="16" y="160" class="x">~${app20.ratio}</text>
    </g>
    <g transform="translate(${col3X},0)">
      <rect class="card" x="0" y="0" width="${colW}" height="220" rx="14"/>
      <text x="16" y="40" class="label">Append · 50k</text>
      <text x="16" y="90" class="ms">${formatMs(app50.ts)}</text>
      <text x="16" y="120" class="vs">vs baseline ${formatMs(app50.base)}</text>
      <text x="16" y="160" class="x">~${app50.ratio}</text>
    </g>
  </g>

  <text x="${pad}" y="${H - pad}" class="foot">github.com/Simon-He95/markdown-it-ts</text>
</svg>`

  return svg
}

function generateSVGNeon(data) {
  const W = 1200, H = 630, pad = 56
  const title = 'markdown-it-ts'
  const subtitle = 'TypeScript rewrite of markdown-it'
  const tags = ['Type-safe', 'Modular', 'Streaming parser']
  const { one100, app20, app50 } = data
  const fg = '#E6FBFF'
  const dim = '#8BE9FD'
  const neon = '#22d3ee'
  const violet = '#a78bfa'
  const bg = '#0b0f19'
  const perfRowY = 280
  const colW = 340, colGap = 40
  const xs = [pad, pad + colW + colGap, pad + (colW + colGap) * 2]
  const titles = ['One-shot · 100k','Append · 20k','Append · 50k']
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="rg" cx="50%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#111b3a"/>
      <stop offset="100%" stop-color="${bg}"/>
    </radialGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1f2937" stroke-width="1"/>
    </pattern>
    <style>
      .t{ font: 800 74px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${fg}; filter:url(#glow) }
      .s{ font: 600 28px/1.3 ui-sans-serif, Inter, system-ui, -apple-system; fill:${dim}; }
      .tag{ font: 700 22px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${neon}; }
      .label{ font: 700 22px/1.2 ui-sans-serif, Inter, system-ui, -apple-system; fill:${fg}; }
      .ms{ font: 800 28px/1.2 ui-sans-serif, Inter, system-ui, -apple-system; fill:${fg}; }
      .vs{ font: 600 18px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${dim}; }
      .x{ font: 900 26px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${neon}; }
      .foot{ font: 700 20px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:#94a3b8; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="url(#rg)"/>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" opacity="0.35"/>
  <circle cx="980" cy="80" r="180" fill="${violet}" opacity="0.18"/>
  <circle cx="160" cy="560" r="140" fill="${neon}" opacity="0.16"/>

  <text x="${pad}" y="${pad + 72}" class="t">${title}</text>
  <text x="${pad}" y="${pad + 122}" class="s">${subtitle}</text>

  <g transform="translate(${pad}, ${pad + 156})">
    <rect x="0" y="-22" width="160" height="36" rx="10" fill="rgba(34,211,238,0.10)" stroke="${neon}"/>
    <text x="14" y="0" class="tag">${tags[0]}</text>
    <rect x="180" y="-22" width="140" height="36" rx="10" fill="rgba(34,211,238,0.10)" stroke="${neon}"/>
    <text x="194" y="0" class="tag">${tags[1]}</text>
    <rect x="340" y="-22" width="230" height="36" rx="10" fill="rgba(34,211,238,0.10)" stroke="${neon}"/>
    <text x="354" y="0" class="tag">${tags[2]}</text>
  </g>

  <g transform="translate(0, ${perfRowY})">
    ${[one100, app20, app50].map((box, i)=>{
      const x = xs[i]
      const t = titles[i]
      return `
      <g transform="translate(${x},0)">
        <rect x="0" y="0" width="340" height="220" rx="16" fill="rgba(17,24,39,0.55)" stroke="${neon}" opacity="0.9"/>
        <text x="16" y="40" class="label">${t}</text>
        <text x="16" y="92" class="ms">${formatMs(box.ts)}</text>
        <text x="16" y="124" class="vs">vs baseline ${formatMs(box.base)}</text>
        <text x="16" y="164" class="x">~${box.ratio}</text>
      </g>`
    }).join('')}
  </g>

  <text x="${pad}" y="${H - pad}" class="foot">github.com/Simon-He95/markdown-it-ts</text>
</svg>`
}

function generateSVGGitGlass(data){
  const W = 1200, H = 630, pad = 56
  const title = 'markdown-it-ts'
  const subtitle = 'TypeScript rewrite of markdown-it'
  const tags = ['Type-safe', 'Modular', 'Streaming parser']
  const { one100, app20, app50 } = data
  const fg = '#e5e7eb', dim = '#cbd5e1', accent = '#22d3ee'
  const perfRowY = 280
  const colW = 340, colGap = 40
  const xs = [pad, pad + colW + colGap, pad + (colW + colGap) * 2]
  const titles = ['One-shot · 100k','Append · 20k','Append · 50k']
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1220"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="40"/>
    </filter>
    <style>
      .t{ font: 800 72px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${fg}; }
      .s{ font: 600 28px/1.3 ui-sans-serif, Inter, system-ui, -apple-system; fill:${dim}; }
      .tag{ font: 700 22px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${accent}; }
      .label{ font: 700 22px/1.2 ui-sans-serif, Inter, system-ui, -apple-system; fill:${fg}; }
      .ms{ font: 800 26px/1.2 ui-sans-serif, Inter, system-ui, -apple-system; fill:${fg}; }
      .vs{ font: 600 18px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${dim}; }
      .x{ font: 900 24px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${accent}; }
      .foot{ font: 700 20px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:#9ca3af; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <g opacity="0.35" filter="url(#blur)">
    <circle cx="240" cy="160" r="160" fill="#22d3ee"/>
    <circle cx="980" cy="520" r="220" fill="#a78bfa"/>
  </g>

  <text x="${pad}" y="${pad + 72}" class="t">${title}</text>
  <text x="${pad}" y="${pad + 122}" class="s">${subtitle}</text>

  <g transform="translate(${pad}, ${pad + 156})">
    <rect x="0" y="-22" width="150" height="36" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)"/>
    <text x="14" y="0" class="tag">${tags[0]}</text>
    <rect x="170" y="-22" width="140" height="36" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)"/>
    <text x="184" y="0" class="tag">${tags[1]}</text>
    <rect x="330" y="-22" width="220" height="36" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)"/>
    <text x="344" y="0" class="tag">${tags[2]}</text>
  </g>

  <g transform="translate(0, ${perfRowY})">
    ${[one100, app20, app50].map((box, i)=>{
      const x = xs[i]
      const t = titles[i]
      return `
      <g transform="translate(${x},0)">
        <rect x="0" y="0" width="340" height="220" rx="16" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.22)"/>
        <text x="16" y="40" class="label">${t}</text>
        <text x="16" y="90" class="ms">${formatMs(box.ts)}</text>
        <text x="16" y="120" class="vs">vs baseline ${formatMs(box.base)}</text>
        <text x="16" y="160" class="x">~${box.ratio}</text>
      </g>`
    }).join('')}
  </g>

  <text x="${pad}" y="${H - pad}" class="foot">github.com/Simon-He95/markdown-it-ts</text>
</svg>`
}

function generateSVGGrid(data){
  const W = 1200, H = 630, pad = 56
  const title = 'markdown-it-ts'
  const subtitle = 'TypeScript rewrite of markdown-it'
  const tags = ['Type-safe', 'Modular', 'Streaming parser']
  const { one100, app20, app50 } = data
  const fg = '#f1f5f9', dim = '#94a3b8', accent = '#84cc16'
  const perfRowY = 280
  const colW = 340, colGap = 40
  const col1X = pad, col2X = pad + colW + colGap, col3X = pad + (colW + colGap) * 2
  const xs = [pad, pad + colW + colGap, pad + (colW + colGap) * 2]
  const titles = ['One-shot · 100k','Append · 20k','Append · 50k']
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b132a"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
    <pattern id="minor" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1f2937" stroke-width="1"/>
    </pattern>
    <pattern id="major" width="100" height="100" patternUnits="userSpaceOnUse">
      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#334155" stroke-width="1.5"/>
    </pattern>
    <style>
      .t{ font: 800 72px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${fg}; }
      .s{ font: 600 28px/1.3 ui-sans-serif, Inter, system-ui, -apple-system; fill:${dim}; }
      .tag{ font: 700 22px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${accent}; }
      .label{ font: 700 22px/1.2 ui-sans-serif, Inter, system-ui, -apple-system; fill:${fg}; }
      .ms{ font: 800 26px/1.2 ui-sans-serif, Inter, system-ui, -apple-system; fill:${fg}; }
      .vs{ font: 600 18px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${dim}; }
      .x{ font: 900 24px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:${accent}; }
      .foot{ font: 700 20px/1 ui-sans-serif, Inter, system-ui, -apple-system; fill:#9ca3af; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg2)"/>
  <rect width="100%" height="100%" fill="url(#minor)" opacity="0.45"/>
  <rect width="100%" height="100%" fill="url(#major)" opacity="0.35"/>

  <text x="${pad}" y="${pad + 72}" class="t">${title}</text>
  <text x="${pad}" y="${pad + 122}" class="s">${subtitle}</text>

  <g transform="translate(${pad}, ${pad + 156})">
    <rect x="0" y="-22" width="150" height="36" rx="10" fill="rgba(132,204,22,0.10)" stroke="${accent}"/>
    <text x="14" y="0" class="tag">${tags[0]}</text>
    <rect x="170" y="-22" width="140" height="36" rx="10" fill="rgba(132,204,22,0.10)" stroke="${accent}"/>
    <text x="184" y="0" class="tag">${tags[1]}</text>
    <rect x="330" y="-22" width="220" height="36" rx="10" fill="rgba(132,204,22,0.10)" stroke="${accent}"/>
    <text x="344" y="0" class="tag">${tags[2]}</text>
  </g>

  <g transform="translate(0, ${perfRowY})">
    ${[one100, app20, app50].map((box, i)=>{
      const x = xs[i]
      const t = titles[i]
      return `
      <g transform="translate(${x},0)">
        <rect x="0" y="0" width="340" height="220" rx="14" fill="rgba(51,65,85,0.45)" stroke="rgba(148,163,184,0.35)"/>
        <text x="16" y="40" class="label">${t}</text>
        <text x="16" y="90" class="ms">${formatMs(box.ts)}</text>
        <text x="16" y="120" class="vs">vs baseline ${formatMs(box.base)}</text>
        <text x="16" y="160" class="x">~${box.ratio}</text>
      </g>`
    }).join('')}
  </g>

  <text x="${pad}" y="${H - pad}" class="foot">github.com/Simon-He95/markdown-it-ts</text>
</svg>`
}

function buildDataFromPerf(){
  const payload = loadLatest()
  const r = payload.results
  const { baseline: b100, best: t100 } = pickBest(r, 100000, 'oneShotMs')
  const r100 = ratioFaster(b100?.oneShotMs, t100?.oneShotMs)
  const { baseline: b20, best: t20 } = pickBest(r, 20000, 'appendWorkloadMs')
  const r20 = ratioFaster(b20?.appendWorkloadMs, t20?.appendWorkloadMs)
  const { baseline: b50, best: t50 } = pickBest(r, 50000, 'appendWorkloadMs')
  const r50 = ratioFaster(b50?.appendWorkloadMs, t50?.appendWorkloadMs)
  return {
    one100: { ts: t100?.oneShotMs ?? 0, base: b100?.oneShotMs ?? 0, ratio: r100.text },
    app20: { ts: t20?.appendWorkloadMs ?? 0, base: b20?.appendWorkloadMs ?? 0, ratio: r20.text },
    app50: { ts: t50?.appendWorkloadMs ?? 0, base: b50?.appendWorkloadMs ?? 0, ratio: r50.text },
  }
}

function main(){
  const args = process.argv.slice(2)
  const argVar = args.find(a=>a.startsWith('--variant='))
  const all = args.includes('--all')
  const variant = argVar ? argVar.split('=')[1] : 'classic'
  const variants = all ? ['classic','neon','glass','grid'] : [variant]
  const data = buildDataFromPerf()
  for (const v of variants){
    const svg = v === 'neon' ? generateSVGNeon(data)
      : v === 'glass' ? generateSVGGitGlass(data)
      : v === 'grid' ? generateSVGGrid(data)
      : generateSVGClassic(data)
    const outUrl = new URL(`../assets/social-card-${v}.svg`, import.meta.url)
    const outPath = outUrl.pathname
    const outDir = outPath.slice(0, outPath.lastIndexOf('/'))
    try { mkdirSync(outDir, { recursive: true }) } catch {}
    writeFileSync(outPath, svg)
    console.log('Wrote', outPath)
  }
}
main()
