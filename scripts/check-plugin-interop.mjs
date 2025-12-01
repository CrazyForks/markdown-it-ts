#!/usr/bin/env node
import { createRequire } from 'module'

const requireFromCjs = createRequire(import.meta.url)

async function tryImport(name) {
  try {
    const mod = await import(name)
    return { ok: true, mod }
  }
  catch (e) {
    return { ok: false, error: e }
  }
}

function tryRequire(name) {
  try {
    const mod = requireFromCjs(name)
    return { ok: true, mod }
  }
  catch (e) {
    return { ok: false, error: e }
  }
}

function inspect(name, mod) {
  const type = typeof mod
  const hasDefault = mod && typeof mod.default === 'function'
  return { name, type, hasDefault }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Usage: node check-plugin-interop.mjs <plugin-names...>')
    process.exit(2)
  }

  for (const name of args) {
    console.log(`\n== ${name} ==`)
    const imp = await tryImport(name)
    if (imp.ok) {
      console.log('import() succeeded')
      console.log('  ->', inspect(name, imp.mod))
    }
    else {
      console.log('import() failed:', imp.error && imp.error.message ? imp.error.message.split('\n')[0] : String(imp.error))
    }

    const req = tryRequire(name)
    if (req.ok) {
      console.log('require() succeeded')
      console.log('  ->', inspect(name, req.mod))
    }
    else {
      console.log('require() failed:', req.error && req.error.message ? req.error.message.split('\n')[0] : String(req.error))
    }
  }
}

main().catch((err) => {
  console.error('Unexpected error', err)
  process.exit(1)
})
