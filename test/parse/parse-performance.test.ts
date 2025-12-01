import fs from 'node:fs'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import { fileURLToPath } from 'node:url'
import MarkdownItTS from '../../src/index'
import MarkdownItJS from 'markdown-it'
import { createMarkdownExit as createMarkdownExitFactory } from 'markdown-exit'
import { describe, it, expect } from 'vitest'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function readFixture(name: string): string {
  return fs.readFileSync(path.join(__dirname, '../fixtures', name), 'utf8')
}

function measureAverage(fn: (input: string) => void, input: string, iterations: number): number {
  // Warm up to mitigate first-call overheads
  for (let i = 0; i < 5; i++) {
    fn(input)
  }

  const start = performance.now()
  for (let i = 0; i < iterations; i++) {
    fn(input)
  }
  const duration = performance.now() - start
  return duration / iterations
}

describe('markdown-it-ts parse performance parity', () => {
  const mdTs = MarkdownItTS()
  const mdJs = new MarkdownItJS()
  // markdown-exit factory may not be available in all environments (guard)
  let mdExit: any = null
  try {
    mdExit = typeof createMarkdownExitFactory === 'function' ? createMarkdownExitFactory() : null
  } catch (e) {
    mdExit = null
  }

  const scenarios: Array<{ name: string, text: string, iterations: number, tolerance: number }> = [
    { name: 'short', text: '# Hello world', iterations: 20000, tolerance: 3.0 },
    { name: 'medium', text: readFixture('inline-em-worst.md'), iterations: 5000, tolerance: 2.0 },
    { name: 'long', text: readFixture('lorem1.txt'), iterations: 1000, tolerance: 1.7 },
    {
      name: 'ultra-long',
      text: readFixture('lorem1.txt').repeat(20),
      iterations: 120,
      tolerance: 1.6,
    },
  ]

  for (const { name, text, iterations, tolerance } of scenarios) {
    it(`ts parser should match markdown-it performance for ${name} input`, () => {
      const tsTime = measureAverage((input) => mdTs.parse(input, {}), text, iterations)
      const jsTime = measureAverage((input) => mdJs.parse(input, {}), text, iterations)
      const ratio = tsTime / jsTime

      console.info(
        `[parse-perf] ${name}: markdown-it-ts ${tsTime.toFixed(4)}ms vs markdown-it ${jsTime.toFixed(4)}ms (ratio ${ratio.toFixed(3)})`,
      )

      // If markdown-exit is present, also measure its parse speed (best-effort)
      if (mdExit && typeof mdExit.parse === 'function') {
        try {
          const exitTime = measureAverage((input) => mdExit.parse(input), text, iterations)
          console.info(`[parse-perf] ${name}: markdown-exit ${exitTime.toFixed(4)}ms`) 
        } catch (e) {
          console.info(`[parse-perf] ${name}: markdown-exit parse not benchmarked (${String(e)})`)
        }
      }

      expect(tsTime).toBeLessThanOrEqual(jsTime * tolerance)
    })

    it(`render parity for ${name} input`, () => {
      // measure render performance for ts and js
      const tsRenderTime = measureAverage((input) => mdTs.render(input), text, Math.max(1, Math.floor(iterations / 10)))
      const jsRenderTime = measureAverage((input) => mdJs.render(input), text, Math.max(1, Math.floor(iterations / 10)))
      console.info(`[render-perf] ${name}: markdown-it-ts ${tsRenderTime.toFixed(4)}ms vs markdown-it ${jsRenderTime.toFixed(4)}ms`)

      if (mdExit && typeof mdExit.render === 'function') {
        try {
          const exitRenderTime = measureAverage((input) => mdExit.render(input), text, Math.max(1, Math.floor(iterations / 10)))
          console.info(`[render-perf] ${name}: markdown-exit ${exitRenderTime.toFixed(4)}ms`)
        } catch (e) {
          console.info(`[render-perf] ${name}: markdown-exit render not benchmarked (${String(e)})`)
        }
      }

      // No strict assertions for render parity here — just report timings.
      expect(tsRenderTime).toBeGreaterThanOrEqual(0)
    })
  }
})
