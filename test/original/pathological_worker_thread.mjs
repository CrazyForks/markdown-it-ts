import { parentPort } from 'node:worker_threads'
import markdownit from '../../../markdown-it/index.mjs'

if (!parentPort) {
  throw new Error('This script must be run as a worker thread')
}

parentPort.on('message', async (str) => {
  try {
    const md = markdownit()
    const res = md.render(str)
    parentPort.postMessage({ ok: true, res })
  } catch (err) {
    parentPort.postMessage({ ok: false, err: err instanceof Error ? err.message : String(err) })
  }
})
