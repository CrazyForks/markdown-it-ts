import type { State } from '../../parse/state'
import { Token } from '../../common/token'

// Join adjacent text nodes inside inline tokens
export function text_join(state: State): void {
  const tokens = state.tokens || []
  tokens.forEach((tk) => {
    if (tk.type === 'inline' && Array.isArray(tk.children)) {
      const out: Token[] = []
      for (let i = 0; i < tk.children.length; i++) {
        const ch = tk.children[i]
        if (ch.type === 'text') {
          let content = ch.content || ''
          while (i + 1 < tk.children.length && tk.children[i + 1].type === 'text') {
            i++
            content += tk.children[i].content || ''
          }
          const textToken = new Token('text', '', 0)
          textToken.content = content
          textToken.level = ch.level
          out.push(textToken)
        }
        else {
          out.push(ch)
        }
      }
      tk.children = out
    }
  })
}

export default text_join
