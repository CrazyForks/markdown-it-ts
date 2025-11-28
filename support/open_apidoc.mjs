#!/usr/bin/env node
// Cross-platform helper to open apidoc/index.html in the default browser.
import { spawn } from 'node:child_process'
import process from 'node:process'

const target = 'apidoc/index.html'

function openFile() {
  const platform = process.platform
  let cmd
  let args = []

  if (platform === 'win32') {
    cmd = 'cmd'
    args = ['/c', 'start', '', target]
  }
  else if (platform === 'darwin') {
    cmd = 'open'
    args = [target]
  }
  else {
    cmd = 'xdg-open'
    args = [target]
  }

  const p = spawn(cmd, args, { stdio: 'inherit' })

  p.on('error', (err) => {
    console.error('Failed to open', target, '->', err && err.message)
    process.exit(0)
  })

  p.on('exit', (code) => {
    process.exit(code || 0)
  })
}

openFile()
