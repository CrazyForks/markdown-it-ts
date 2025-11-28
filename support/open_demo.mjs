#!/usr/bin/env node
// Cross-platform helper to open demo/index.html in the default browser.
import { spawn } from 'node:child_process'
import process from 'node:process'

const target = 'demo/index.html'

function openFile() {
  const platform = process.platform
  let cmd
  let args = []

  if (platform === 'win32') {
    // Use cmd /c start "" <file> to open with default app
    cmd = 'cmd'
    args = ['/c', 'start', '', target]
  }
  else if (platform === 'darwin') {
    cmd = 'open'
    args = [target]
  }
  else {
    // linux / other unix
    cmd = 'xdg-open'
    args = [target]
  }

  const p = spawn(cmd, args, { stdio: 'inherit' })

  p.on('error', (err) => {
    console.error('Failed to open', target, '->', err && err.message)
    // Not a fatal error for build scripts
    process.exit(0)
  })

  p.on('exit', (code) => {
    // exit with child's code when non-zero; otherwise success
    process.exit(code || 0)
  })
}

openFile()
