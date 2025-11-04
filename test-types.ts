// Test backward compatibility
import type MarkdownIt from './dist/index.js'
import markdownit from './dist/index.js'

// Should work
const md: MarkdownIt = markdownit()

console.log('Type test passed!')
