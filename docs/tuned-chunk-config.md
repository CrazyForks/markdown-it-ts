# Tuned chunk configurations (latest run)

This page records the best-performing chunk configurations measured on the current machine for both non-stream full parse and stream hybrid modes. Data from `scripts/tune-chunk-config.mjs`.

Sizes tested: 5k, 20k, 50k, 100k, 200k chars. Append workload = 1 initial + 5 appends.

## Recommendations

- Non-stream (full parse, one-shot):
  - 5k: full-chunk, maxChunkChars=32000, maxChunkLines=150, maxChunks=8
  - 20k: full-chunk, maxChunkChars=24000, maxChunkLines=200, maxChunks=12
  - 50k: full-plain (chunking did not beat plain full parse)
  - 100k: full-plain
  - 200k: full-chunk, maxChunkChars=20000, maxChunkLines=150, maxChunks=12

- Stream hybrid (stream=true, streamChunkedFallback=true):
  - 5k: streamChunkSizeChars=16000, streamChunkSizeLines=250 (best append)
  - 20k: streamChunkSizeChars=16000, streamChunkSizeLines=200
  - 50k: streamChunkSizeChars=16000, streamChunkSizeLines=250
  - 100k: streamChunkSizeChars=10000, streamChunkSizeLines=200
  - 200k: streamChunkSizeChars=20000, streamChunkSizeLines=200

Notes:
- These settings reflect synthetic paragraph/list/code-block content. Real-world content (tables, long lists without blanks, heavy fenced blocks) can shift break-evens. Re-run `node scripts/tune-chunk-config.mjs` on your corpus for more accurate per-project defaults.
- For non-stream, chunking mainly helps on very large or long-tail-prone inputs. For medium sizes (50k–100k), plain full parse can still be best.
- For stream hybrid, the chosen sizes affect "first large parse" or fallback on non-append edits; append path itself benefits from cache even without chunking.

## Raw summary (from last run)

```
Size=5000 chars
- Baseline (markdown-it) one-shot: 5.07ms
- Full plain (S5) one-shot:       6.53ms
- Full chunk (best):               0.28ms  cfg: chars=32000, lines=150, maxChunks=8
- Stream hybrid (best append):     0.26ms  cfg: sChars=16000, sLines=250
- Stream hybrid (best one-shot):   0.26ms  cfg: sChars=10000, sLines=300

Size=20000 chars
- Baseline (markdown-it) one-shot: 4.03ms
- Full plain (S5) one-shot:       1.22ms
- Full chunk (best):               1.06ms  cfg: chars=24000, lines=200, maxChunks=12
- Stream hybrid (best append):     0.95ms  cfg: sChars=16000, sLines=200
- Stream hybrid (best one-shot):   0.85ms  cfg: sChars=20000, sLines=200

Size=50000 chars
- Baseline (markdown-it) one-shot: 4.94ms
- Full plain (S5) one-shot:       2.37ms
- Full chunk (best):               2.37ms (no chunk beats full-plain here)
- Stream hybrid (best append):     2.39ms  cfg: sChars=16000, sLines=250
- Stream hybrid (best one-shot):   2.11ms  cfg: sChars=16000, sLines=250

Size=100000 chars
- Baseline (markdown-it) one-shot: 7.78ms
- Full plain (S5) one-shot:       4.45ms
- Full chunk (best):               4.45ms (no chunk beats full-plain here)
- Stream hybrid (best append):     20.00ms  cfg: sChars=10000, sLines=200
- Stream hybrid (best one-shot):   5.12ms  cfg: sChars=16000, sLines=300

Size=200000 chars
- Baseline (markdown-it) one-shot: 19.04ms
- Full plain (S5) one-shot:       15.06ms
- Full chunk (best):               13.87ms  cfg: chars=20000, lines=150, maxChunks=12
- Stream hybrid (best append):     43.92ms  cfg: sChars=20000, sLines=200
- Stream hybrid (best one-shot):   12.64ms  cfg: sChars=16000, sLines=250
```

## How to re-run

```bash
npm run build
node scripts/tune-chunk-config.mjs
```

This script prints a summary and the recommended configs block.
