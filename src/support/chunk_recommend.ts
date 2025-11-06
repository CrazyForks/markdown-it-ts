import type { MarkdownItOptions } from '../index'

export interface ChunkRecommendation {
  strategy: 'plain' | 'discrete' | 'adaptive'
  maxChunkChars?: number
  maxChunkLines?: number
  fenceAware: boolean
  maxChunks?: number
  notes?: string
}

const clamp = (v: number, lo: number, hi: number) => v < lo ? lo : (v > hi ? hi : v)

export function recommendFullChunkStrategy(sizeChars: number, sizeLines = Math.max(0, (sizeChars / 40) | 0), opts: Partial<MarkdownItOptions> = {}): ChunkRecommendation {
  const fenceAware = opts.fullChunkFenceAware ?? true
  const target = opts.fullChunkTargetChunks ?? 8
  const adaptive = opts.fullChunkAdaptive !== false
  // Discrete mapping from tuning for one-shot
  if (sizeChars <= 5_000) {
    return { strategy: 'discrete', maxChunkChars: 32_000, maxChunkLines: 150, fenceAware, maxChunks: 8, notes: '<=5k' }
  }
  if (sizeChars <= 20_000) {
    return { strategy: 'discrete', maxChunkChars: 24_000, maxChunkLines: 200, fenceAware, maxChunks: 12, notes: '<=20k' }
  }
  if (sizeChars <= 100_000 && sizeChars <= 50_000) {
    // kept for readability; falls through to plain
  }
  if (sizeChars <= 100_000) {
    return { strategy: 'plain', fenceAware }
  }
  if (sizeChars <= 200_000) {
    return { strategy: 'discrete', maxChunkChars: 20_000, maxChunkLines: 150, fenceAware, maxChunks: 12, notes: '<=200k' }
  }
  // >200k: adaptive
  if (adaptive) {
    const maxChunkChars = clamp(Math.ceil(sizeChars / target), 8000, 32000)
    const maxChunkLines = clamp(Math.ceil(sizeLines / target), 150, 350)
    const maxChunks = Math.max(6, Math.min(12, target))
    return { strategy: 'adaptive', maxChunkChars, maxChunkLines, maxChunks, fenceAware, notes: '>200k adaptive' }
  }
  return { strategy: 'discrete', maxChunkChars: opts.fullChunkSizeChars ?? 10000, maxChunkLines: opts.fullChunkSizeLines ?? 200, fenceAware, maxChunks: opts.fullChunkMaxChunks }
}

export function recommendStreamChunkStrategy(sizeChars: number, sizeLines = Math.max(0, (sizeChars / 40) | 0), opts: Partial<MarkdownItOptions> = {}): ChunkRecommendation {
  const fenceAware = opts.streamChunkFenceAware ?? true
  const target = opts.streamChunkTargetChunks ?? 8
  const adaptive = opts.streamChunkAdaptive !== false
  const explicit = opts.streamChunkSizeChars || opts.streamChunkSizeLines
  if (!explicit) {
    // Discrete mapping from tuning for append-heavy
    if (sizeChars <= 5_000)
      return { strategy: 'discrete', maxChunkChars: 16_000, maxChunkLines: 250, fenceAware, notes: '<=5k' }
    if (sizeChars <= 20_000)
      return { strategy: 'discrete', maxChunkChars: 16_000, maxChunkLines: 200, fenceAware, notes: '<=20k' }
    if (sizeChars <= 50_000)
      return { strategy: 'discrete', maxChunkChars: 16_000, maxChunkLines: 250, fenceAware, notes: '<=50k' }
    if (sizeChars <= 100_000)
      return { strategy: 'discrete', maxChunkChars: 10_000, maxChunkLines: 200, fenceAware, notes: '<=100k' }
    return { strategy: 'discrete', maxChunkChars: 20_000, maxChunkLines: 200, fenceAware, notes: '>100k' }
  }
  if (adaptive) {
    const maxChunkChars = clamp(Math.ceil(sizeChars / target), 8000, 32000)
    const maxChunkLines = clamp(Math.ceil(sizeLines / target), 150, 350)
    return { strategy: 'adaptive', maxChunkChars, maxChunkLines, fenceAware }
  }
  return { strategy: 'discrete', maxChunkChars: opts.streamChunkSizeChars ?? 10000, maxChunkLines: opts.streamChunkSizeLines ?? 200, fenceAware }
}
