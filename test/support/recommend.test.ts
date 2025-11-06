import { describe, expect, it } from 'vitest'
import { recommendFullChunkStrategy, recommendStreamChunkStrategy } from '../../src/support/chunk_recommend'

describe('chunk recommendation helpers', () => {
  it('full: uses discrete small configs at <=20k, plain at 50k/100k, discrete at 200k, adaptive beyond', () => {
    expect(recommendFullChunkStrategy(4_000).strategy).toBe('discrete')
    expect(recommendFullChunkStrategy(4_000).maxChunkChars).toBe(32000)

    expect(recommendFullChunkStrategy(20_000).maxChunkChars).toBe(24000)

    expect(recommendFullChunkStrategy(50_000).strategy).toBe('plain')
    expect(recommendFullChunkStrategy(100_000).strategy).toBe('plain')

    const r200 = recommendFullChunkStrategy(200_000)
    expect(r200.strategy).toBe('discrete')
    expect(r200.maxChunkChars).toBe(20000)

    const rBig = recommendFullChunkStrategy(1_000_000)
    expect(rBig.strategy).toBe('adaptive')
    expect(rBig.maxChunkChars).toBeGreaterThanOrEqual(8000)
    expect(rBig.maxChunkChars).toBeLessThanOrEqual(32000)
  })

  it('stream: uses discrete tuned configs by size', () => {
    expect(recommendStreamChunkStrategy(4_000).maxChunkChars).toBe(16000)
    expect(recommendStreamChunkStrategy(20_000).maxChunkLines).toBe(200)
    expect(recommendStreamChunkStrategy(50_000).maxChunkLines).toBe(250)
    expect(recommendStreamChunkStrategy(100_000).maxChunkChars).toBe(10000)
    expect(recommendStreamChunkStrategy(300_000).maxChunkChars).toBe(20000)
  })
})
