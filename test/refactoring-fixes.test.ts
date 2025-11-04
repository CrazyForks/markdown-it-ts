import { describe, it, expect } from 'vitest'
import markdownit, { Token } from '../src/index'

describe('Refactoring fixes', () => {
  describe('Token export accessibility', () => {
    it('should export Token at top level', () => {
      expect(Token).toBeDefined()
      expect(typeof Token).toBe('function')
      const token = new Token('test', '', 0)
      expect(token.type).toBe('test')
    })

    it('should export Token through md.helpers for plugin compatibility', () => {
      const md = markdownit()
      expect(md.helpers.Token).toBeDefined()
      expect(typeof md.helpers.Token).toBe('function')
      const token = new md.helpers.Token('test', 'div', 1)
      expect(token.type).toBe('test')
      expect(token.tag).toBe('div')
      expect(token.nesting).toBe(1)
    })

    it('should create tokens with correct initial values', () => {
      const token = new Token('paragraph_open', 'p', 1)
      expect(token.type).toBe('paragraph_open')
      expect(token.tag).toBe('p')
      expect(token.nesting).toBe(1)
      expect(token.attrs).toBe(null)
      expect(token.map).toBe(null)
      expect(token.level).toBe(0)
      expect(token.children).toBe(null)
      expect(token.content).toBe('')
      expect(token.markup).toBe('')
      expect(token.info).toBe('')
      expect(token.meta).toBe(null)
      expect(token.block).toBe(false)
      expect(token.hidden).toBe(false)
    })
  })

  describe('Ruler enableOnly validation', () => {
    it('should throw TypeError when core ruler enableOnly gets non-array', () => {
      const md = markdownit()
      expect(() => {
        // @ts-expect-error - intentionally passing wrong type to test runtime validation
        md.core.ruler.enableOnly('normalize')
      }).toThrow(TypeError)
      expect(() => {
        // @ts-expect-error - intentionally passing wrong type to test runtime validation
        md.core.ruler.enableOnly('normalize')
      }).toThrow('enableOnly accepts only an array of rule names')
    })

    it('should throw TypeError when block ruler enableOnly gets non-array', () => {
      const md = markdownit()
      expect(() => {
        // @ts-expect-error - intentionally passing wrong type to test runtime validation
        md.block.ruler.enableOnly({ rules: ['paragraph'] })
      }).toThrow(TypeError)
      expect(() => {
        // @ts-expect-error - intentionally passing wrong type to test runtime validation
        md.block.ruler.enableOnly({ rules: ['paragraph'] })
      }).toThrow('enableOnly accepts only an array of rule names')
    })

    it('should throw TypeError when inline ruler enableOnly gets non-array', () => {
      const md = markdownit()
      expect(() => {
        // @ts-expect-error - intentionally passing wrong type to test runtime validation
        md.inline.ruler.enableOnly(123)
      }).toThrow(TypeError)
      expect(() => {
        // @ts-expect-error - intentionally passing wrong type to test runtime validation
        md.inline.ruler.enableOnly(123)
      }).toThrow('enableOnly accepts only an array of rule names')
    })

    it('should work correctly with valid array input for core ruler', () => {
      const md = markdownit()
      expect(() => {
        md.core.ruler.enableOnly(['normalize', 'block'])
      }).not.toThrow()
      const result = md.render('# Test')
      expect(result).toBeTruthy()
    })

    it('should work correctly with valid array input for block ruler', () => {
      const md = markdownit()
      expect(() => {
        md.block.ruler.enableOnly(['paragraph', 'heading'])
      }).not.toThrow()
      const result = md.render('# Test\n\nParagraph')
      expect(result).toBeTruthy()
    })

    it('should work correctly with valid array input for inline ruler', () => {
      const md = markdownit()
      expect(() => {
        md.inline.ruler.enableOnly(['text', 'escape'])
      }).not.toThrow()
      const result = md.render('Test text')
      expect(result).toBeTruthy()
    })

    it('should work correctly with empty array', () => {
      const md = markdownit()
      expect(() => {
        md.core.ruler.enableOnly([])
      }).not.toThrow()
    })
  })

  describe('Token constructor via helpers', () => {
    it('should allow plugins to access Token constructor from helpers', () => {
      const md = markdownit()
      
      // Simulate a plugin that needs to create tokens
      const pluginFunction = (md: any) => {
        const TokenConstructor = md.helpers.Token
        expect(TokenConstructor).toBeDefined()
        
        const customToken = new TokenConstructor('custom_token', 'span', 0)
        expect(customToken).toBeInstanceOf(Token)
        expect(customToken.type).toBe('custom_token')
        expect(customToken.tag).toBe('span')
      }
      
      expect(() => pluginFunction(md)).not.toThrow()
    })
  })

  describe('Integration with preset configurations', () => {
    it('should handle zero preset with enableOnly correctly', () => {
      const md = markdownit('zero')
      expect(md).toBeDefined()
      const result = md.render('Test')
      expect(result).toBe('<p>Test</p>\n')
    })

    it('should handle default preset', () => {
      const md = markdownit('default')
      expect(md).toBeDefined()
      const result = md.render('# Hello\n\nWorld')
      expect(result).toContain('<h1>')
      expect(result).toContain('Hello')
    })

    it('should handle commonmark preset', () => {
      const md = markdownit('commonmark')
      expect(md).toBeDefined()
      const result = md.render('**bold**')
      expect(result).toContain('<strong>')
    })
  })
})
