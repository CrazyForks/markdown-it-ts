import { fileURLToPath } from 'node:url'
import { relative } from 'node:path'
import { load } from 'markdown-it-testgen'
import markdownit from '../../../markdown-it/index.mjs'
import { expect } from 'vitest'

function normalize (text) {
  return text.replace(/<blockquote>\n<\/blockquote>/g, '<blockquote></blockquote>')
}

function generate (path, md) {
  load(path, function (data) {
    data.meta = data.meta || {}

    const desc = data.meta.desc || relative(path, data.file);

    (data.meta.skip ? describe.skip : describe)(desc, function () {
      data.fixtures.forEach(function (fixture) {
        it(fixture.header ? fixture.header : 'line ' + (fixture.first.range[0] - 1), function () {
          expect(md.render(fixture.first.text)).toBe(normalize(fixture.second.text))
        })
      })
    })
  })
}

describe('CommonMark', function () {
  const md = markdownit('commonmark')

  // Use fixtures from sibling markdown-it repo to avoid duplicating large files
  generate(fileURLToPath(new URL('../../../markdown-it/test/fixtures/commonmark/good.txt', import.meta.url)), md)
})
