#!/usr/bin/env node
// Micro-benchmark for stream context-parse heuristics
// Usage: node benchmark/stream-context-heuristic-bench.mjs

function countLines(s) {
  if (!s) return 0
  return s.split('\n').length
}

function appendedHasBlockConstructs(s) {
  return /(^|\n)\s{0,3}(?:#{1,6}\s|>\s|(?:[-*+]\s)|(?:\d+\.\s)|```|~~~| {4,})/.test(s)
}

function decideStrategy(strategy, appended, opts = {}) {
  const minChars = opts.minChars ?? 200
  const minLines = opts.minLines ?? 2
  switch (strategy) {
    case 'lines': {
      const appendedLines = countLines(appended)
      return appendedLines >= minLines
    }
    case 'constructs': {
      const appendedLines = countLines(appended)
      return appendedHasBlockConstructs(appended) || appendedLines >= minLines || appended.length >= minChars
    }
    case 'chars':
    default:
      return appended.length >= minChars
  }
}

const scenarios = [
  { name: 'small-plain', text: 'Short line.\nAnother short line.\n', iterations: 100000 },
  { name: 'small-construct', text: 'List:\n- item one\n- item two\n', iterations: 100000 },
  { name: 'mid-plain', text: 'Paragraph line\n'.repeat(10) + '\n', iterations: 20000 },
  { name: 'mid-construct', text: '1. numbered\n2. numbered\n\n> blockquote line\n\n', iterations: 20000 },
  { name: 'large-plain', text: 'Line\n'.repeat(500) + '\n', iterations: 2000 },
  { name: 'large-construct', text: 'Heading\n# h1\n\n' + 'Code block\n```js\nconsole.log(1)\n```\n'.repeat(10), iterations: 2000 },
]

const strategies = ['chars', 'lines', 'constructs']
const opts = { minChars: 200, minLines: 2 }

console.log('stream context-parse heuristic benchmark')
console.log('opts:', opts)
console.log('')

for (const s of scenarios) {
  console.log('Scenario:', s.name, `(len=${s.text.length})`, 'iters=', s.iterations)
  for (const strat of strategies) {
    const start = process.hrtime.bigint()
    for (let i = 0; i < s.iterations; i++) {
      decideStrategy(strat, s.text, opts)
    }
    const end = process.hrtime.bigint()
    const ns = Number(end - start)
    const per = ns / s.iterations
    console.log(`  ${strat.padEnd(10)}: total ${(ns/1e6).toFixed(3)}ms  per=${per.toFixed(0)}ns`)
  }
  console.log('')
}

console.log('Hint: try varying minChars/minLines via opts in the script or pass env vars in a wrapper.')
