import type { State } from '../../parse/state'

// Mirror upstream markdown-it behavior for typographic replacements.
const RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/

const SCOPED_ABBR_TEST_RE = /\((?:c|tm|r)\)/i
const SCOPED_ABBR_RE = /\((c|tm|r)\)/gi
const SCOPED_ABBR: Record<string, string> = {
  c: '©',
  r: '®',
  tm: '™',
}

function replaceFn(_match: string, name: string) {
  return SCOPED_ABBR[name.toLowerCase()]
}

function replace_scoped(inlineTokens: any[]) {
  let inside_autolink = 0

  for (let i = inlineTokens.length - 1; i >= 0; i--) {
    const token = inlineTokens[i]

    if (token.type === 'text' && !inside_autolink) {
      token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn)
    }

    if (token.type === 'link_open' && token.info === 'auto') {
      inside_autolink--
    }

    if (token.type === 'link_close' && token.info === 'auto') {
      inside_autolink++
    }
  }
}

function replace_rare(inlineTokens: any[]) {
  let inside_autolink = 0

  for (let i = inlineTokens.length - 1; i >= 0; i--) {
    const token = inlineTokens[i]

    if (token.type === 'text' && !inside_autolink) {
      if (RARE_RE.test(token.content)) {
        token.content = token.content
          // +- -> ±
          .replace(/\+-/g, '±')
          // multiple dots -> ellipsis, but ?/! followed by dots -> ?.. / !..
          .replace(/\.{2,}/g, '…')
          .replace(/([?!])…/g, '$1..')
          // squash long runs of ? or ! to three
          .replace(/([?!]){4,}/g, '$1$1$1')
          // duplicate commas -> single
          .replace(/,{2,}/g, ',')
          // em-dash
          .replace(/(^|[^-])---(?=[^-]|$)/gm, '$1\u2014')
          // en-dash (two variants to match upstream behavior)
          .replace(/(^|\s)--(?=\s|$)/gm, '$1\u2013')
          .replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, '$1\u2013')
      }
    }

    if (token.type === 'link_open' && token.info === 'auto') {
      inside_autolink--
    }

    if (token.type === 'link_close' && token.info === 'auto') {
      inside_autolink++
    }
  }
}

export function replacements(state: State): void {
  if (!state.md?.options?.typographer) {
    return
  }

  for (let blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    const blk = state.tokens[blkIdx]
    if (blk.type !== 'inline') {
      continue
    }

    // Inline `content` may be empty in unit tests; use children text as fallback
    const blkContent = blk.content || (Array.isArray(blk.children) ? blk.children.map((c: any) => (c.type === 'text' ? c.content : '')).join('') : '')

    if (SCOPED_ABBR_TEST_RE.test(blkContent)) {
      replace_scoped(blk.children || [])
    }

    if (RARE_RE.test(blkContent)) {
      replace_rare(blk.children || [])
    }
  }
}

export default replacements
