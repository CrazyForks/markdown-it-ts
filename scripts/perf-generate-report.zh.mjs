// 从 docs/perf-latest.json 生成中文版性能报告。
// 先运行 `pnpm run perf:generate` 刷新 JSON，再运行本脚本。

import { readFileSync, writeFileSync } from 'node:fs'

const perfUrl = new URL('../docs/perf-latest.json', import.meta.url)
const outputUrl = new URL('../docs/perf-latest.zh-CN.md', import.meta.url)

function fmt(ms) {
  if (ms == null)
    return '-'
  return ms < 10 ? `${ms.toFixed(4)}ms` : `${ms.toFixed(2)}ms`
}

function ratio(candidate, baseline) {
  if (!candidate || !baseline)
    return '-'
  return `${(candidate / baseline).toFixed(2)}x`
}

function groupBySize(rows) {
  const bySize = new Map()
  for (const row of rows || []) {
    if (!bySize.has(row.size))
      bySize.set(row.size, [])
    bySize.get(row.size).push(row)
  }
  return bySize
}

function pick(rows, scenario) {
  return rows?.find(row => row.scenario === scenario)
}

function pickBestTs(rows, metric) {
  return rows
    ?.filter(row => /^S\d$/.test(row.scenario))
    .sort((a, b) => a[metric] - b[metric])[0]
}

function comparisonText(baseline, candidate) {
  if (candidate <= baseline)
    return `${(baseline / candidate).toFixed(2)}x 更快`
  return `${(candidate / baseline).toFixed(2)}x 更慢`
}

const perf = JSON.parse(readFileSync(perfUrl, 'utf8'))
const parseBySize = groupBySize(perf.results)
const renderBySize = groupBySize(perf.renderComparisons || [])
const astBySize = new Map((perf.stockAstJsonComparisons || []).map(row => [row.size, row]))
const sizes = Array.from(parseBySize.keys()).sort((a, b) => a - b)
const parseIds = ['S1', 'S2', 'S3', 'S4', 'S5', 'M1', 'E1', 'OX1', 'OXJ', 'MM1']
const renderIds = ['TS_RENDER', 'TS_RENDER_ASYNC', 'MD_RENDER', 'OX_RENDER', 'MM_RENDER', 'RM_RENDER', 'EX_RENDER']

const lines = []
lines.push('# 性能报告（最新一次）')
lines.push('')
lines.push('## 运行环境')
lines.push('')
lines.push(`- 生成时间：${perf.environment?.generatedAt ?? 'unknown'}`)
lines.push(`- Node.js：${perf.environment?.node ?? 'unknown'}`)
lines.push(`- 平台：${perf.environment?.platform ?? 'unknown'}`)
lines.push(`- CPU：${perf.environment?.cpu ?? 'unknown'}`)
lines.push(`- Commit：${perf.environment?.commit ?? 'unknown'}`)
lines.push('')
lines.push('默认 API 说明：普通 `md.parse(src)` / `md.render(src)` 面对超大但有限的字符串时，可能自动启用内部大文本优化。外部 parser 行保留各自原生输出形态；`OXJ` 表示在 `@ox-content/napi` 的 AST JSON 字符串后追加 `JSON.parse`。')
lines.push('')
lines.push('## Parse 吞吐（one-shot）')
lines.push('')
lines.push('| 字数 | ' + parseIds.map(id => `${id} one`).join(' | ') + ' |')
lines.push('|---:|' + parseIds.map(() => '---:').join('|') + '|')
for (const size of sizes) {
  const rows = parseBySize.get(size)
  const values = parseIds.map(id => pick(rows, id)?.oneShotMs)
  const best = Math.min(...values.filter(value => value != null))
  const cells = values.map((value) => {
    const cell = fmt(value)
    return value === best ? `**${cell}**` : cell
  })
  lines.push(`| ${size.toLocaleString()} | ${cells.join(' | ')} |`)
}
lines.push('')
lines.push('## Render API 吞吐（parse + HTML 输出）')
lines.push('')
lines.push('| 字数 | markdown-it-ts.render | markdown-it-ts.renderAsync | markdown-it.render | @ox-content/napi | micromark | remark+rehype | markdown-exit |')
lines.push('|---:|' + renderIds.map(() => '---:').join('|') + '|')
for (const size of sizes) {
  const rows = renderBySize.get(size)
  const cells = renderIds.map(id => fmt(pick(rows, id)?.renderMs))
  lines.push(`| ${size.toLocaleString()} | ${cells.join(' | ')} |`)
}
lines.push('')
lines.push('## markdown-it-ts vs @ox-content/napi')
lines.push('')
lines.push('| 字数 | TS 最佳 parse | ox parse-only | Parse 对比 | TS AST JSON | AST JSON 对比 | TS render | ox render | Render 对比 |')
lines.push('|---:|---:|---:|:--|---:|:--|---:|---:|:--|')
for (const size of sizes) {
  const parseRows = parseBySize.get(size)
  const renderRows = renderBySize.get(size)
  const bestTs = pickBestTs(parseRows, 'oneShotMs')
  const ox = pick(parseRows, 'OX1')
  const ast = astBySize.get(size)
  const tsRender = pick(renderRows, 'TS_RENDER')
  const oxRender = pick(renderRows, 'OX_RENDER')
  lines.push(`| ${size.toLocaleString()} | ${fmt(bestTs?.oneShotMs)} | ${fmt(ox?.oneShotMs)} | ${comparisonText(ox?.oneShotMs, bestTs?.oneShotMs)} | ${fmt(ast?.tsAstJsonMs)} | ${comparisonText(ast?.oxParseMs, ast?.tsAstJsonMs)} | ${fmt(tsRender?.renderMs)} | ${fmt(oxRender?.renderMs)} | ${comparisonText(oxRender?.renderMs, tsRender?.renderMs)} |`)
}
lines.push('')
lines.push('## 结论')
lines.push('')
lines.push('- `@ox-content/napi` 的 parse-only 很快，因为它返回 AST JSON 字符串，而不是 JavaScript `Token[]` 对象图。')
lines.push('- `parseStockFastAstJson` 在本基准中已经快于 ox parse-only，说明扫描与紧凑字符串输出不是主要瓶颈。')
lines.push('- 默认 `md.parse()` 仍要返回 markdown-it 兼容、可变的 tokens，剩余差距主要来自 Token、children、map 数组与 GC 成本。')
lines.push('- 默认 `md.render()` 走 stock render 快路径后，在本快照中全尺寸都快于或接近 `@ox-content/napi` render。')
lines.push('')
lines.push('场景说明：S1~S5 为 markdown-it-ts 配置矩阵；M1 为 markdown-it；E1 为 markdown-exit；OX1 为 `@ox-content/napi` parse-only；OXJ 为 ox parse + `JSON.parse`；MM1 为 micromark parse-only。')

writeFileSync(outputUrl, `${lines.join('\n')}\n`)
console.log('已写入 docs/perf-latest.zh-CN.md')
