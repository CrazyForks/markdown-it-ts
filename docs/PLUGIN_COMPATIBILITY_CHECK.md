**Plugin Compatibility Check — Notes & How-to**

This document lists markdown-it related plugins found in the repository metadata and provides a reproducible check to validate import/interop behavior in your environment.

Found plugin packages (from `package.json` devDependencies / dependencies):

- `markdown-it` (dev)
- `markdown-exit` (dev)
- `markdown-it-abbr`
- `markdown-it-container`
- `markdown-it-deflist`
- `markdown-it-emoji`
- `markdown-it-footnote`
- `markdown-it-for-inline`
- `markdown-it-ins`
- `markdown-it-mark`
- `markdown-it-sub`
- `markdown-it-sup`
- `markdown-it-testgen`

Guidance
- Most of the above are small plugins that implement the conventional plugin signature `function (md, opts)` and are expected to work. However, verify the following for each plugin you use in your project:
  - Module entry format (ESM vs CJS). If your app is CommonJS, test dynamic `import()` or `createRequire` interop.
  - Whether the plugin imports internal `markdown-it` internals (e.g. `markdown-it/lib/...`) — such imports are brittle and will break if internals are restructured.

Reproducible check (script)
- Run `node ./scripts/check-plugin-interop.mjs plugin-name ...` to test how each plugin behaves when imported from an ESM environment and as a require() fallback. The script will print whether the imported value is a function and whether it has `.default`.

Example

```bash
node ./scripts/check-plugin-interop.mjs markdown-it-emoji markdown-it-footnote
```

Interpretation
- If the script reports `imported: function` → plugin likely works when used as `import plugin from 'pkg'`.
- If the script reports `imported: object, has default function` → when using `import pkg from 'pkg'`, you may need `pkg.default` (or build tooling will handle it). If using CJS `require`, the plugin usually comes back as the function directly.
- If both import and require fail, open an issue on the plugin repo or fix by forking/patching.

Next steps I can run for you (pick one):
- Run the interop script here in the workspace (requires installed node_modules).
- Try dynamic import checks and report results for the plugin list.

Repository scan notes
- The repository contains test helpers that import internal upstream `markdown-it` files (only in `test/original/*`), for example:
  - `test/original/token.mjs` imports `../../../markdown-it/lib/token.mjs`
  - `test/original/ruler.mjs` imports `../../../markdown-it/lib/ruler.mjs`
  - `test/original/utils.mjs` imports `../../../markdown-it/lib/common/utils.mjs`

These are test-only references and indicate the project runs some upstream tests by pointing to a local upstream checkout. They do not affect normal plugin usage, but they do illustrate that any code relying on upstream private paths will break if upstream files are moved or re-exported differently.
