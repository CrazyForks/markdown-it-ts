// Token attribute helpers for markdown-it-ts
import type { Token } from '../types'

export function attrIndex(token: Token, name: string): number {
  if (!token.attrs)
    return -1
  for (let i = 0; i < token.attrs.length; i++) {
    if (token.attrs[i][0] === name)
      return i
  }
  return -1
}

export function attrPush(token: Token, attrData: [string, string]): void {
  if (!token.attrs)
    token.attrs = []
  token.attrs.push(attrData)
}

export function attrSet(token: Token, name: string, value: string): void {
  const idx = attrIndex(token, name)
  const attrData: [string, string] = [name, value]
  if (idx < 0) {
    attrPush(token, attrData)
  }
  else {
    token.attrs![idx] = attrData
  }
}

export function attrGet(token: Token, name: string): string | null {
  const idx = attrIndex(token, name)
  if (idx >= 0) {
    return token.attrs![idx][1]
  }
  return null
}

export function attrJoin(token: Token, name: string, value: string): void {
  const idx = attrIndex(token, name)
  if (idx < 0) {
    attrPush(token, [name, value])
  }
  else {
    token.attrs![idx][1] = `${token.attrs![idx][1]} ${value}`
  }
}
