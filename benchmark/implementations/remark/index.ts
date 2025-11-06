// Benchmark implementation for Remark: parse Markdown and stringify to HTML
// This lets our shared benchmark harness call run(data: string) and get HTML output.

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

export function run(data: string) {
  // Synchronous pipeline: Markdown -> MDAST -> HAST -> HTML string
  const file = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(data)

  return String(file)
}
