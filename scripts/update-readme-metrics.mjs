// Update README metric example bullets from docs/perf-latest.json
// Usage: node scripts/update-readme-metrics.mjs

import { readFileSync, writeFileSync } from 'node:fs'

const perfPath = new URL('../docs/perf-latest.json', import.meta.url)
const readmePaths = [
  new URL('../README.md', import.meta.url),
  new URL('../README.zh-CN.md', import.meta.url),
]

function loadJson(p) { return JSON.parse(readFileSync(p, 'utf8')) }

function formatMs(ms) {
  if (ms < 10) return `${ms.toFixed(4)}ms`
  return `${ms.toFixed(2)}ms`
}
function formatNumber(value, digits = 1) {
  return value.toFixed(digits).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '')
}
function formatFx(baseline, ts) { return formatNumber(baseline / ts, 1) + '×' }
function formatTimeSaved(baseline, ts) { return formatNumber((1 - ts / baseline) * 100, 0) + '%' }
function formatComparisonSummary(baseline, ts, locale = 'en') {
  if (ts <= baseline) {
    if (locale === 'zh')
      return `~${formatFx(baseline, ts)} 更快，约少 ${formatTimeSaved(baseline, ts)} 耗时`
    return `~${formatFx(baseline, ts)} faster, ~${formatTimeSaved(baseline, ts)} less time`
  }
  const slowerBy = formatNumber(ts / baseline, 1)
  const moreTime = formatNumber((ts / baseline - 1) * 100, 0)
  if (locale === 'zh')
    return `~${slowerBy} 倍更慢，约多 ${moreTime}% 耗时`
  return `~${slowerBy}× slower, ~${moreTime}% more time`
}

function isTsScenarioId(id) {
  return typeof id === 'string' && id.startsWith('S')
}

function pickBestTsBy(arr, field) {
  const tsOnly = arr.filter(r => isTsScenarioId(r.scenario))
  return tsOnly.sort((a,b)=> a[field] - b[field])[0]
}

function getBySize(results) {
  const map = new Map()
  for (const r of results) {
    if (!map.has(r.size)) map.set(r.size, [])
    map.get(r.size).push(r)
  }
  return map
}

function buildOneExamples(bySize, sizes) {
  const lines = []
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const base = arr.find(r => r.scenario === 'M1')
    const bestTs = pickBestTsBy(arr, 'oneShotMs')
    const l = `- ${size.toLocaleString()} chars: ${formatMs(bestTs.oneShotMs)} vs ${formatMs(base.oneShotMs)} → ${formatComparisonSummary(base.oneShotMs, bestTs.oneShotMs)}`
    lines.push(l)
  }
  return lines
}

function buildAppendExamples(bySize, sizes) {
  const lines = []
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const base = arr.find(r => r.scenario === 'M1')
    const bestTs = pickBestTsBy(arr, 'appendWorkloadMs')
    const l = `- ${size.toLocaleString()} chars: ${formatMs(bestTs.appendWorkloadMs)} vs ${formatMs(base.appendWorkloadMs)} → ${formatComparisonSummary(base.appendWorkloadMs, bestTs.appendWorkloadMs)}`
    lines.push(l)
  }
  return lines
}

function buildRemarkOneExamples(bySize, sizes) {
  const lines = []
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const bestTs = pickBestTsBy(arr, 'oneShotMs')
    const remark = arr.find(r => r.scenario === 'R1')
    if (!remark) continue
    const l = `- ${size.toLocaleString()} chars: ${formatMs(bestTs.oneShotMs)} vs ${formatMs(remark.oneShotMs)} → ${formatFx(remark.oneShotMs, bestTs.oneShotMs)} faster`
    lines.push(l)
  }
  return lines
}

function buildRemarkAppendExamples(bySize, sizes) {
  const lines = []
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const bestTs = pickBestTsBy(arr, 'appendWorkloadMs')
    const remark = arr.find(r => r.scenario === 'R1')
    if (!remark) continue
    const l = `- ${size.toLocaleString()} chars: ${formatMs(bestTs.appendWorkloadMs)} vs ${formatMs(remark.appendWorkloadMs)} → ${formatFx(remark.appendWorkloadMs, bestTs.appendWorkloadMs)} faster`
    lines.push(l)
  }
  return lines
}

function buildMicromarkOneExamples(bySize, sizes) {
  const lines = []
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const bestTs = pickBestTsBy(arr, 'oneShotMs')
    const micro = arr.find(r => r.scenario === 'MM1')
    if (!micro) continue
    const l = `- ${size.toLocaleString()} chars: ${formatMs(bestTs.oneShotMs)} vs ${formatMs(micro.oneShotMs)} → ${formatFx(micro.oneShotMs, bestTs.oneShotMs)} faster`
    lines.push(l)
  }
  return lines
}

function buildMicromarkAppendExamples(bySize, sizes) {
  const lines = []
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const bestTs = pickBestTsBy(arr, 'appendWorkloadMs')
    const micro = arr.find(r => r.scenario === 'MM1')
    if (!micro) continue
    const l = `- ${size.toLocaleString()} chars: ${formatMs(bestTs.appendWorkloadMs)} vs ${formatMs(micro.appendWorkloadMs)} → ${formatFx(micro.appendWorkloadMs, bestTs.appendWorkloadMs)} faster`
    lines.push(l)
  }
  return lines
}

function buildOxOneExamples(bySize, sizes, locale = 'en') {
  const lines = []
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const bestTs = pickBestTsBy(arr, 'oneShotMs')
    const ox = arr.find(r => r.scenario === 'OX1')
    if (!bestTs || !ox) continue
    const l = `- ${size.toLocaleString()} chars: ${formatMs(bestTs.oneShotMs)} vs ${formatMs(ox.oneShotMs)} → ${formatComparisonSummary(ox.oneShotMs, bestTs.oneShotMs, locale)}`
    lines.push(l)
  }
  return lines
}

function buildOxJsonOneExamples(bySize, sizes, locale = 'en') {
  const lines = []
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const bestTs = pickBestTsBy(arr, 'oneShotMs')
    const ox = arr.find(r => r.scenario === 'OXJ')
    if (!bestTs || !ox) continue
    const l = `- ${size.toLocaleString()} chars: ${formatMs(bestTs.oneShotMs)} vs ${formatMs(ox.oneShotMs)} → ${formatComparisonSummary(ox.oneShotMs, bestTs.oneShotMs, locale)}`
    lines.push(l)
  }
  return lines
}

function buildStockAstJsonExamples(rows, sizes, locale = 'en') {
  const bySize = getBySize(rows || [])
  const lines = []
  for (const size of sizes) {
    const row = bySize.get(size)?.[0]
    if (!row) continue
    const l = `- ${size.toLocaleString()} chars: ${formatMs(row.tsAstJsonMs)} vs ${formatMs(row.oxParseMs)} → ${formatComparisonSummary(row.oxParseMs, row.tsAstJsonMs, locale)}`
    lines.push(l)
  }
  return lines
}

function buildRenderVsMarkdownIt(bySize, sizes) {
  const lines = []
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const ts = arr.find(r => r.scenario === 'TS_RENDER')
    const baseline = arr.find(r => r.scenario === 'MD_RENDER')
    if (!ts || !baseline) continue
    const l = `- ${size.toLocaleString()} chars: ${formatMs(ts.renderMs)} vs ${formatMs(baseline.renderMs)} → ~${formatFx(baseline.renderMs, ts.renderMs)} faster`
    lines.push(l)
  }
  return lines
}

function buildRenderVsOx(bySize, sizes, locale = 'en') {
  const lines = []
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const ts = arr.find(r => r.scenario === 'TS_RENDER')
    const ox = arr.find(r => r.scenario === 'OX_RENDER')
    if (!ts || !ox) continue
    const l = `- ${size.toLocaleString()} chars: ${formatMs(ts.renderMs)} vs ${formatMs(ox.renderMs)} → ${formatComparisonSummary(ox.renderMs, ts.renderMs, locale)}`
    lines.push(l)
  }
  return lines
}

function buildOxSummaryTable(bySize, renderBySize, sizes, locale = 'en') {
  const lines = [
    locale === 'zh'
      ? '| Size | markdown-it-ts parse | @ox-content/napi parse | Parse 对比 | markdown-it-ts render | @ox-content/napi render | Render 对比 |'
      : '| Size | markdown-it-ts parse | @ox-content/napi parse | Parse comparison | markdown-it-ts render | @ox-content/napi render | Render comparison |',
    '|---:|---:|---:|:--|---:|---:|:--|',
  ]
  for (const size of sizes) {
    const parseRows = bySize.get(size)
    const renderRows = renderBySize.get(size)
    if (!parseRows || !renderRows) continue

    const bestTs = pickBestTsBy(parseRows, 'oneShotMs')
    const oxParse = parseRows.find(r => r.scenario === 'OX1')
    const tsRender = renderRows.find(r => r.scenario === 'TS_RENDER')
    const oxRender = renderRows.find(r => r.scenario === 'OX_RENDER')
    if (!bestTs || !oxParse || !tsRender || !oxRender) continue

    lines.push(`| ${size.toLocaleString()} | ${formatMs(bestTs.oneShotMs)} | ${formatMs(oxParse.oneShotMs)} | ${formatComparisonSummary(oxParse.oneShotMs, bestTs.oneShotMs, locale)} | ${formatMs(tsRender.renderMs)} | ${formatMs(oxRender.renderMs)} | ${formatComparisonSummary(oxRender.renderMs, tsRender.renderMs, locale)} |`)
  }
  return lines
}

function buildRenderVsRemark(bySize, sizes) {
  const lines = []
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const ts = arr.find(r => r.scenario === 'TS_RENDER')
    const remark = arr.find(r => r.scenario === 'RM_RENDER')
    if (!ts || !remark) continue
    const l = `- ${size.toLocaleString()} chars: ${formatMs(ts.renderMs)} vs ${formatMs(remark.renderMs)} → ~${formatFx(remark.renderMs, ts.renderMs)} faster`
    lines.push(l)
  }
  return lines
}

function buildRenderVsMicromark(bySize, sizes) {
  const lines = []
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const ts = arr.find(r => r.scenario === 'TS_RENDER')
    const micro = arr.find(r => r.scenario === 'MM_RENDER')
    if (!ts || !micro) continue
    const l = `- ${size.toLocaleString()} chars: ${formatMs(ts.renderMs)} vs ${formatMs(micro.renderMs)} → ~${formatFx(micro.renderMs, ts.renderMs)} faster`
    lines.push(l)
  }
  return lines
}

function buildRenderVsExit(bySize, sizes) {
  const lines = []
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const ts = arr.find(r => r.scenario === 'TS_RENDER')
    const exit = arr.find(r => r.scenario === 'EX_RENDER')
    if (!ts || !exit) continue
    const l = `- ${size.toLocaleString()} chars: ${formatMs(ts.renderMs)} vs ${formatMs(exit.renderMs)} → ~${formatFx(exit.renderMs, ts.renderMs)} faster`
    lines.push(l)
  }
  return lines
}

function buildExitOneTable(bySize, sizes) {
  const lines = [
    '| Size (chars) | markdown-it-ts (best one-shot) | markdown-exit (one-shot) |',
    '|---:|---:|---:|',
  ]
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const bestTs = pickBestTsBy(arr, 'oneShotMs')
    const exit = arr.find(r => r.scenario === 'E1')
    if (!bestTs || !exit) continue
    lines.push(`| ${size.toLocaleString()} | ${formatMs(bestTs.oneShotMs)} | ${formatMs(exit.oneShotMs)} |`)
  }
  return lines
}

function buildZhRanking(bySize, renderBySize, sizes) {
  const lines = []
  lines.push('为了更直观地查看主要实现（markdown-it-ts、@ox-content/napi、markdown-it、markdown-exit、remark）在不同规模下的 parse / render 名次，下面直接基于最新 `docs/perf-latest.json` 的快照生成。')
  lines.push('其中 parse 排名取 markdown-it-ts 在对应规模下 oneShotMs 最低的场景（S1~S5）；render 排名则使用默认 `MarkdownIt().render()` 的端到端耗时，因此两张表不能直接理解为“同一条 parse + renderer 链路”的组合排名。')
  lines.push('')
  lines.push('**Parse 排名（one-shot 解析耗时，单位：ms）**')
  lines.push('')
  lines.push('| Size | Rank | Library | oneShotMs |')
  lines.push('|---:|---:|---|---:|')
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const rows = []
    const bestTs = pickBestTsBy(arr, 'oneShotMs')
    const ox = arr.find(r => r.scenario === 'OX1')
    const baseline = arr.find(r => r.scenario === 'M1')
    const exit = arr.find(r => r.scenario === 'E1')
    const remark = arr.find(r => r.scenario === 'R1')
    if (bestTs) rows.push({ library: 'markdown-it-ts', value: bestTs.oneShotMs })
    if (ox) rows.push({ library: '@ox-content/napi', value: ox.oneShotMs })
    if (baseline) rows.push({ library: 'markdown-it', value: baseline.oneShotMs })
    if (exit) rows.push({ library: 'markdown-exit', value: exit.oneShotMs })
    if (remark) rows.push({ library: 'remark', value: remark.oneShotMs })
    rows.sort((a, b) => a.value - b.value)
    rows.forEach((row, index) => {
      lines.push(`| ${size.toLocaleString()} | ${index + 1} | ${row.library} | ${formatMs(row.value)} |`)
    })
  }
  lines.push('')
  lines.push('**Render 排名（解析 + HTML 输出耗时，单位：ms）**')
  lines.push('')
  lines.push('| Size | Rank | Library | renderMs |')
  lines.push('|---:|---:|---|---:|')
  for (const size of sizes) {
    const arr = renderBySize.get(size)
    if (!arr) continue
    const rows = []
    const ts = arr.find(r => r.scenario === 'TS_RENDER')
    const ox = arr.find(r => r.scenario === 'OX_RENDER')
    const baseline = arr.find(r => r.scenario === 'MD_RENDER')
    const exit = arr.find(r => r.scenario === 'EX_RENDER')
    const remark = arr.find(r => r.scenario === 'RM_RENDER')
    if (ts) rows.push({ library: 'markdown-it-ts', value: ts.renderMs })
    if (ox) rows.push({ library: '@ox-content/napi', value: ox.renderMs })
    if (baseline) rows.push({ library: 'markdown-it', value: baseline.renderMs })
    if (exit) rows.push({ library: 'markdown-exit', value: exit.renderMs })
    if (remark) rows.push({ library: 'remark + rehype', value: remark.renderMs })
    rows.sort((a, b) => a.value - b.value)
    rows.forEach((row, index) => {
      lines.push(`| ${size.toLocaleString()} | ${index + 1} | ${row.library} | ${formatMs(row.value)} |`)
    })
  }
  return lines
}

function buildEnRanking(bySize, renderBySize, sizes) {
  const lines = []
  lines.push('This compact ranking includes the native `@ox-content/napi` baseline alongside markdown-it-ts and JS implementations. It is generated from the latest `docs/perf-latest.json` snapshot.')
  lines.push('Parse ranking uses the fastest markdown-it-ts one-shot scenario for each size; render ranking uses the default `MarkdownIt().render()` end-to-end API.')
  lines.push('')
  lines.push('**Parse ranking (one-shot parse, ms)**')
  lines.push('')
  lines.push('| Size | Rank | Library | oneShotMs |')
  lines.push('|---:|---:|---|---:|')
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    const rows = []
    const bestTs = pickBestTsBy(arr, 'oneShotMs')
    const ox = arr.find(r => r.scenario === 'OX1')
    const baseline = arr.find(r => r.scenario === 'M1')
    const exit = arr.find(r => r.scenario === 'E1')
    const remark = arr.find(r => r.scenario === 'R1')
    if (bestTs) rows.push({ library: 'markdown-it-ts', value: bestTs.oneShotMs })
    if (ox) rows.push({ library: '@ox-content/napi', value: ox.oneShotMs })
    if (baseline) rows.push({ library: 'markdown-it', value: baseline.oneShotMs })
    if (exit) rows.push({ library: 'markdown-exit', value: exit.oneShotMs })
    if (remark) rows.push({ library: 'remark', value: remark.oneShotMs })
    rows.sort((a, b) => a.value - b.value)
    rows.forEach((row, index) => {
      lines.push(`| ${size.toLocaleString()} | ${index + 1} | ${row.library} | ${formatMs(row.value)} |`)
    })
  }
  lines.push('')
  lines.push('**Render ranking (parse + HTML output, ms)**')
  lines.push('')
  lines.push('| Size | Rank | Library | renderMs |')
  lines.push('|---:|---:|---|---:|')
  for (const size of sizes) {
    const arr = renderBySize.get(size)
    if (!arr) continue
    const rows = []
    const ts = arr.find(r => r.scenario === 'TS_RENDER')
    const ox = arr.find(r => r.scenario === 'OX_RENDER')
    const baseline = arr.find(r => r.scenario === 'MD_RENDER')
    const exit = arr.find(r => r.scenario === 'EX_RENDER')
    const remark = arr.find(r => r.scenario === 'RM_RENDER')
    if (ts) rows.push({ library: 'markdown-it-ts', value: ts.renderMs })
    if (ox) rows.push({ library: '@ox-content/napi', value: ox.renderMs })
    if (baseline) rows.push({ library: 'markdown-it', value: baseline.renderMs })
    if (exit) rows.push({ library: 'markdown-exit', value: exit.renderMs })
    if (remark) rows.push({ library: 'remark + rehype', value: remark.renderMs })
    rows.sort((a, b) => a.value - b.value)
    rows.forEach((row, index) => {
      lines.push(`| ${size.toLocaleString()} | ${index + 1} | ${row.library} | ${formatMs(row.value)} |`)
    })
  }
  return lines
}

function buildComparisonTable(bySize, sizes) {
  // Build a markdown table with columns: Scenario, Config, One-shot, Append(par), Append(line), Replace
  const header = ['| Scenario | Config summary | One-shot | Append (paragraph) | Append (line) | Replace (paragraph) |', '|:--|:--|---:|---:|---:|---:|']
  const rows = []
  for (const size of sizes) {
    const arr = bySize.get(size)
    if (!arr) continue
    // Order rows by scenario id for stable output
    const order = ['S1','S2','S3','S4','S5','M1']
    rows.push(`\n**${size.toLocaleString()} chars**\n`)
    rows.push('')
    rows.push(...header)
    for (const id of order) {
      const r = arr.find(x => x.scenario === id)
      if (!r) continue
      const cfg = r.label
      const one = r.oneShotMs != null ? formatMs(r.oneShotMs) : '-'
      const app = r.appendWorkloadMs != null ? formatMs(r.appendWorkloadMs) : '-'
      const lineApp = r.appendLineMs != null ? formatMs(r.appendLineMs) : '-'
      const repl = r.replaceParagraphMs != null ? formatMs(r.replaceParagraphMs) : '-'
      rows.push(`| ${id} | ${cfg} | ${one} | ${app} | ${lineApp} | ${repl} |`)
    }
    rows.push('')
  }
  return rows
}

function replaceBetween(content, startTag, endTag, newLines) {
  const startIdx = content.indexOf(startTag)
  const endIdx = content.indexOf(endTag)
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return content
  const before = content.slice(0, startIdx + startTag.length)
  const after = content.slice(endIdx)
  const body = '\n' + newLines.join('\n') + '\n'
  return before + body + after
}

function buildColdHot(perf) {
  const rows = perf.coldHot ?? []
  const grouped = rows.reduce((m, r) => {
    if (!m.has(r.size)) m.set(r.size, [])
    m.get(r.size).push(r)
    return m
  }, new Map())
  const lines = []
  for (const [size, arr] of Array.from(grouped.entries()).sort((a, b) => a[0] - b[0])) {
    lines.push(`#### ${Number(size).toLocaleString()} chars`)
    lines.push('')
    lines.push('| Impl | Cold | Hot |')
    lines.push('|:--|---:|---:|')
    for (const row of arr.sort((a, b) => a.label.localeCompare(b.label))) {
      lines.push(`| ${row.label} | ${formatMs(row.coldMs)} | ${formatMs(row.hotMs)} |`)
    }
    lines.push('')
  }
  return lines
}

function main() {
  const perf = loadJson(perfPath)
  const bySize = getBySize(perf.results)
  const renderBySize = getBySize(perf.renderComparisons || [])

  const oneSizes = [5000, 20000, 100000, 500000, 1000000]
  const appendSizes = [5000, 20000, 100000, 500000, 1000000]
  const renderSizes = [5000, 20000, 100000, 500000, 1000000]
  const oxSizes = [5000, 20000, 100000]
  const exitSizes = [5000, 20000, 50000, 100000, 200000]
  const rankingSizes = [5000, 20000, 50000, 100000, 200000]

  const blocks = {
    one: buildOneExamples(bySize, oneSizes),
    append: buildAppendExamples(bySize, appendSizes),
    remarkOne: buildRemarkOneExamples(bySize, oneSizes),
    remarkAppend: buildRemarkAppendExamples(bySize, appendSizes),
    micromarkOne: buildMicromarkOneExamples(bySize, oneSizes),
    micromarkAppend: buildMicromarkAppendExamples(bySize, appendSizes),
    oxOneEn: buildOxOneExamples(bySize, oxSizes),
    oxOneZh: buildOxOneExamples(bySize, oxSizes, 'zh'),
    oxJsonOneEn: buildOxJsonOneExamples(bySize, oxSizes),
    oxJsonOneZh: buildOxJsonOneExamples(bySize, oxSizes, 'zh'),
    stockAstJsonEn: buildStockAstJsonExamples(perf.stockAstJsonComparisons, oxSizes),
    stockAstJsonZh: buildStockAstJsonExamples(perf.stockAstJsonComparisons, oxSizes, 'zh'),
    oxSummaryEn: buildOxSummaryTable(bySize, renderBySize, oxSizes),
    oxSummaryZh: buildOxSummaryTable(bySize, renderBySize, oxSizes, 'zh'),
    renderMd: buildRenderVsMarkdownIt(renderBySize, renderSizes),
    renderOxEn: buildRenderVsOx(renderBySize, oxSizes),
    renderOxZh: buildRenderVsOx(renderBySize, oxSizes, 'zh'),
    renderRemark: buildRenderVsRemark(renderBySize, renderSizes),
    renderMicromark: buildRenderVsMicromark(renderBySize, renderSizes),
    renderExit: buildRenderVsExit(renderBySize, exitSizes),
    exitOne: buildExitOneTable(bySize, exitSizes),
    rankingEn: buildEnRanking(bySize, renderBySize, rankingSizes),
    rankingZh: buildZhRanking(bySize, renderBySize, rankingSizes),
    comparison: buildComparisonTable(bySize, oneSizes),
  }

  for (const path of readmePaths) {
    const content = readFileSync(path, 'utf8')
    const locale = path.pathname.endsWith('README.zh-CN.md') ? 'zh' : 'en'
    const updated = applyBlocks(content, blocks, locale)
    writeFileSync(path, updated)
  }

  console.log('README metrics updated in', readmePaths.map(p => p.pathname).join(', '))
}

function applyBlocks(content, blocks, locale = 'en') {
  const startOne = '<!-- perf-auto:one-examples:start -->'
  const endOne = '<!-- perf-auto:one-examples:end -->'
  const startApp = '<!-- perf-auto:append-examples:start -->'
  const endApp = '<!-- perf-auto:append-examples:end -->'
  const startRemarkOne = '<!-- perf-auto:remark-one:start -->'
  const endRemarkOne = '<!-- perf-auto:remark-one:end -->'
  const startRemarkApp = '<!-- perf-auto:remark-append:start -->'
  const endRemarkApp = '<!-- perf-auto:remark-append:end -->'
  const startMicromarkOne = '<!-- perf-auto:micromark-one:start -->'
  const endMicromarkOne = '<!-- perf-auto:micromark-one:end -->'
  const startMicromarkApp = '<!-- perf-auto:micromark-append:start -->'
  const endMicromarkApp = '<!-- perf-auto:micromark-append:end -->'
  const startOxOne = '<!-- perf-auto:ox-one:start -->'
  const endOxOne = '<!-- perf-auto:ox-one:end -->'
  const startOxJsonOne = '<!-- perf-auto:ox-json-one:start -->'
  const endOxJsonOne = '<!-- perf-auto:ox-json-one:end -->'
  const startStockAstJson = '<!-- perf-auto:stock-ast-json:start -->'
  const endStockAstJson = '<!-- perf-auto:stock-ast-json:end -->'
  const startOxSummary = '<!-- perf-auto:ox-summary:start -->'
  const endOxSummary = '<!-- perf-auto:ox-summary:end -->'
  const startRenderMd = '<!-- perf-auto:render-md:start -->'
  const endRenderMd = '<!-- perf-auto:render-md:end -->'
  const startRenderOx = '<!-- perf-auto:render-ox:start -->'
  const endRenderOx = '<!-- perf-auto:render-ox:end -->'
  const startRenderMicromark = '<!-- perf-auto:render-micromark:start -->'
  const endRenderMicromark = '<!-- perf-auto:render-micromark:end -->'
  const startRenderRemark = '<!-- perf-auto:render-remark:start -->'
  const endRenderRemark = '<!-- perf-auto:render-remark:end -->'
  const startRenderExit = '<!-- perf-auto:render-exit:start -->'
  const endRenderExit = '<!-- perf-auto:render-exit:end -->'
  const startExitOne = '<!-- perf-auto:exit-one:start -->'
  const endExitOne = '<!-- perf-auto:exit-one:end -->'
  const startRankingZh = '<!-- perf-auto:ranking-zh:start -->'
  const endRankingZh = '<!-- perf-auto:ranking-zh:end -->'
  const startRankingEn = '<!-- perf-auto:ranking-en:start -->'
  const endRankingEn = '<!-- perf-auto:ranking-en:end -->'
  const startComparison = '<!-- perf-auto:comparison:start -->'
  const endComparison = '<!-- perf-auto:comparison:end -->'

  let updated = content
  updated = replaceBetween(updated, startOne, endOne, blocks.one)
  updated = replaceBetween(updated, startApp, endApp, blocks.append)
  updated = replaceBetween(updated, startRemarkOne, endRemarkOne, blocks.remarkOne)
  updated = replaceBetween(updated, startRemarkApp, endRemarkApp, blocks.remarkAppend)
  updated = replaceBetween(updated, startMicromarkOne, endMicromarkOne, blocks.micromarkOne)
  updated = replaceBetween(updated, startMicromarkApp, endMicromarkApp, blocks.micromarkAppend)
  updated = replaceBetween(updated, startOxOne, endOxOne, locale === 'zh' ? blocks.oxOneZh : blocks.oxOneEn)
  updated = replaceBetween(updated, startOxJsonOne, endOxJsonOne, locale === 'zh' ? blocks.oxJsonOneZh : blocks.oxJsonOneEn)
  updated = replaceBetween(updated, startStockAstJson, endStockAstJson, locale === 'zh' ? blocks.stockAstJsonZh : blocks.stockAstJsonEn)
  updated = replaceBetween(updated, startOxSummary, endOxSummary, locale === 'zh' ? blocks.oxSummaryZh : blocks.oxSummaryEn)
  updated = replaceBetween(updated, startRenderMd, endRenderMd, blocks.renderMd)
  updated = replaceBetween(updated, startRenderOx, endRenderOx, locale === 'zh' ? blocks.renderOxZh : blocks.renderOxEn)
  updated = replaceBetween(updated, startRenderMicromark, endRenderMicromark, blocks.renderMicromark)
  updated = replaceBetween(updated, startRenderRemark, endRenderRemark, blocks.renderRemark)
  updated = replaceBetween(updated, startRenderExit, endRenderExit, blocks.renderExit)
  updated = replaceBetween(updated, startExitOne, endExitOne, blocks.exitOne)
  updated = replaceBetween(updated, startRankingEn, endRankingEn, blocks.rankingEn)
  updated = replaceBetween(updated, startRankingZh, endRankingZh, blocks.rankingZh)
  updated = replaceBetween(updated, startComparison, endComparison, blocks.comparison)
  return updated
}

main()
