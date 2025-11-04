// Test default import as type - this is what users want
import type MarkdownIt from './dist/index.js'
import markdownit from './dist/index.js'

// Should work
const md: MarkdownIt = markdownit()

console.log('Type test passed!')
