import MarkdownIt from '../src/index'
import { readFileSync } from 'fs'
import { join } from 'path'

function hrToMs(ns: bigint) {
  return Number(ns) / 1e6
}

function runScenario(mdFactory: () => any, input: string, iterations: number) {
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

const strategies: Array<{ name: string, opts: any }> = [
  { name: 'chars', opts: { stream: true, streamContextParseStrategy: 'chars', streamContextParseMinChars: 200 } },
  { name: 'lines', opts: { stream: true, streamContextParseStrategy: 'lines', streamContextParseMinLines: 2 } },
  { name: 'constructs', opts: { stream: true, streamContextParseStrategy: 'constructs', streamContextParseMinChars: 200, streamContextParseMinLines: 2 } },
]

const samples = [
  { name: 'small-plain', text: 'Short line.\nAnother short line.\n', iters: 2000 },
  { name: 'small-list', text: 'List:\n- item one\n- item two\n', iters: 2000 },
  { name: 'mid-paragraphs', text: ('Paragraph line.\n'.repeat(50)) + '\n', iters: 200 },
  { name: 'mid-constructs', text: '1. numbered\n2. numbered\n\n> blockquote line\n\n'.repeat(5), iters: 200 },
  { name: 'large', text: ('Line \n'.repeat(2000)) + '\n', iters: 20 },
]

console.log('Stream parse benchmark (full parse via parse API)')
console.log('Note: run `pnpm run build` first to use built output, or run via ts-node for direct source')
console.log('')

for (const sample of samples) {
  console.log(`Sample: ${sample.name} (len=${sample.text.length}) iters=${sample.iters}`)
  for (const s of strategies) {
    const mdFactory = () => MarkdownIt(s.opts)
    // run once to ensure any lazy inits
    const ns = runScenario(mdFactory, sample.text, sample.iters)
    const ms = hrToMs(ns)
    console.log(`  ${s.name.padEnd(12)}: ${ms.toFixed(3)} ms total  avg=${(ms / sample.iters).toFixed(3)} ms`) 
  }
  console.log('')
}

console.log('Done')
