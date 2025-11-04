import { fileURLToPath } from 'node:url'
import generate from 'markdown-it-testgen'
import markdownit from '../../../markdown-it/index.mjs'

describe('markdown-it', function () {
  const md = markdownit({
    html: true,
    langPrefix: '',
    typographer: true,
    linkify: true
  })

  // Use fixtures from sibling markdown-it repo to avoid duplicating large files
  generate(fileURLToPath(new URL('../../../markdown-it/test/fixtures/markdown-it', import.meta.url)), md)
})
