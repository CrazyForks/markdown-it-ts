import { describe, expect, it } from 'vitest'
import { State } from '../../src/parse/state'
import { replacements } from '../../src/rules/core/replacements'

describe('core replacements', () => {
  it('replaces ellipsis and dashes', () => {
    const state = new State('')
    state.md = {
      options: { typographer: true },
    } as any
    state.tokens = [
      {
        type: 'inline',
        children: [
          { type: 'text', content: 'Wait... -- really --- no', level: 0 },
        ],
        level: 0,
      } as any,
    ]

    replacements(state as any)

    const inline = state.tokens[0] as any
    expect(inline.children.length).toBe(1)
    expect(inline.children[0].content).toBe('Wait… – really — no')
  })

  it('replaces (c)/(r)/(tm) but leaves (p) alone (scoped abbreviations)', () => {
    const state = new State('')
    state.md = {
      options: { typographer: true },
    } as any
    state.tokens = [
      {
        type: 'inline',
        children: [
          { type: 'text', content: '(c) (C) (r) (R) (tm) (TM) (p) (P)', level: 0 },
        ],
        level: 0,
      } as any,
    ]

    replacements(state as any)

    const inline = state.tokens[0] as any
    expect(inline.children[0].content).toBe('© © ® ® ™ ™ (p) (P)')
  })

  it('replaces +\- to ± and honors other rare rules', () => {
    const state = new State('')
    state.md = {
      options: { typographer: true },
    } as any
    state.tokens = [
      {
        type: 'inline',
        children: [{ type: 'text', content: '+- -- ...!!!!!', level: 0 }],
        level: 0,
      } as any,
    ]

    replacements(state as any)

    const inline = state.tokens[0] as any
    expect(inline.children[0].content).toBe('± – …!!!')
  })
})
