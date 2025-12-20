// Local wrapper for 'commonmark-reference' benchmark implementation.
// Prefer micromark as a CommonMark-oriented reference for Markdown → HTML.

import { micromark } from 'micromark'

export function run(data: string) {
  return micromark(data)
}
