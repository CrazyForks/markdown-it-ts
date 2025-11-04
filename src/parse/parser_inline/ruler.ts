/**
 * InlineRuler - manages inline parsing rules
 * Similar to original markdown-it/lib/ruler.mjs but for inline rules
 */

export interface InlineRule {
  name: string
  fn: (state: any, silent?: boolean) => boolean | void
  alt?: string[]
  enabled: boolean
}

export class InlineRuler {
  private rules: InlineRule[] = []

  /**
   * Push new rule to the end of chain
   */
  public push(name: string, fn: (state: any, silent?: boolean) => boolean | void, options?: { alt?: string[] }) {
    // ensure uniqueness by name
    const idx = this.rules.findIndex(r => r.name === name)
    if (idx >= 0)
      this.rules.splice(idx, 1)
    this.rules.push({
      name,
      fn,
      alt: options?.alt || [],
      enabled: true,
    })
  }

  public at(name: string): InlineRule | undefined {
    return this.rules.find(rule => rule.name === name)
  }

  public before(beforeName: string, name: string, fn: (state: any, silent?: boolean) => boolean | void, options?: { alt?: string[] }) {
    const i = this.rules.findIndex(r => r.name === beforeName)
    if (i < 0)
      throw new Error(`Parser rule not found: ${beforeName}`)
    const exists = this.rules.findIndex(r => r.name === name)
    if (exists >= 0)
      this.rules.splice(exists, 1)
    this.rules.splice(i, 0, { name, fn, alt: options?.alt || [], enabled: true })
  }

  public after(afterName: string, name: string, fn: (state: any, silent?: boolean) => boolean | void, options?: { alt?: string[] }) {
    const i = this.rules.findIndex(r => r.name === afterName)
    if (i < 0)
      throw new Error(`Parser rule not found: ${afterName}`)
    const exists = this.rules.findIndex(r => r.name === name)
    if (exists >= 0)
      this.rules.splice(exists, 1)
    this.rules.splice(i + 1, 0, { name, fn, alt: options?.alt || [], enabled: true })
  }

  public enable(names: string | string[], ignoreInvalid?: boolean): string[] {
    const list = Array.isArray(names) ? names : [names]
    const changed: string[] = []
    for (const n of list) {
      const idx = this.rules.findIndex(r => r.name === n)
      if (idx < 0) {
        if (!ignoreInvalid)
          throw new Error(`Rules manager: invalid rule name ${n}`)
        continue
      }
      this.rules[idx].enabled = true
      changed.push(n)
    }
    return changed
  }

  public disable(names: string | string[], ignoreInvalid?: boolean): string[] {
    const list = Array.isArray(names) ? names : [names]
    const changed: string[] = []
    for (const n of list) {
      const idx = this.rules.findIndex(r => r.name === n)
      if (idx < 0) {
        if (!ignoreInvalid)
          throw new Error(`Rules manager: invalid rule name ${n}`)
        continue
      }
      this.rules[idx].enabled = false
      changed.push(n)
    }
    return changed
  }

  public enableOnly(names: string[]): void {
    if (!Array.isArray(names)) {
      throw new TypeError('enableOnly accepts only an array of rule names')
    }
    const allow = new Set(names)
    for (const r of this.rules) r.enabled = allow.has(r.name)
  }

  /**
   * Get rules for specified chain name (or empty string for default)
   */
  public getRules(_chainName: string): Array<(state: any, silent?: boolean) => boolean | void> {
    return this.rules.filter(rule => rule.enabled).map(rule => rule.fn)
  }
}

export default InlineRuler
