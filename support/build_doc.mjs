#!/usr/bin/env node

import shell from 'shelljs'

shell.rm('-rf', 'apidoc')

const head = shell.exec('git show-ref --hash HEAD').stdout.slice(0, 6)

const link_format = `https://github.com/{package.repository}/blob/${head}/{file}#L{line}`

// execute the ndoc binary wrapper directly (don't prefix with `node` — the
// wrapper is a shell script and will be executed via its shebang). Using
// `node node_modules/.bin/ndoc` caused Node to attempt to parse the wrapper
// shell script which produces a syntax error.
// Generate API docs for the `src` folder and use README.md as index. Place
// output in `apidoc` (we removed it above). This avoids ndoc complaining about
// missing PATH arguments.
// Prefer using pnpm or npx so the script works even when the binary wrapper
// isn't directly invoked. Fall back to the local node_modules wrapper if
// neither tool is found.
if (shell.which('pnpm')) {
  shell.exec(`pnpm dlx ndoc --alias mjs:js --link-format "${link_format}" --index README.md -o apidoc src`)
}
else if (shell.which('npx')) {
  shell.exec(`npx ndoc --alias mjs:js --link-format "${link_format}" --index README.md -o apidoc src`)
}
else {
  shell.exec(`node_modules/.bin/ndoc --alias mjs:js --link-format "${link_format}" --index README.md -o apidoc src`)
}
