# Best-of markdown-it-ts vs markdown-it (baseline)

Date: 2025-11-06

This page mirrors the best-of comparison from the latest performance run.
For full details and raw scenario matrix, see `docs/perf-latest.md`.

## Summary table (mirrored)

| Size (chars) | TS best one | Baseline one | One ratio | TS best append | Baseline append | Append ratio | TS scenario (one/append) |
|---:|---:|---:|---:|---:|---:|---:|:--|
| 5000 | 0.70ms | 5.47ms | 0.13x | 0.73ms | 2.71ms | 0.27x | S4/S3 |
| 20000 | 1.10ms | 1.82ms | 0.60x | 1.26ms | 4.77ms | 0.26x | S5/S3 |
| 50000 | 2.50ms | 3.61ms | 0.69x | 2.48ms | 10.09ms | 0.25x | S2/S2 |
| 100000 | 5.50ms | 5.73ms | 0.96x | 18.68ms | 17.24ms | 1.08x | S5/S5 |

Notes:
- One ratio < 1.00 means markdown-it-ts best one-shot is faster than baseline.
- Append ratio < 1.00 highlights stream cache optimizations (fast-path appends).

## Regenerate

- Locally:
  - `npm run perf:generate`
- In CI (on-demand):
  - GitHub → Actions → “Perf Report” → “Run workflow”
  - Optional inputs: ref / Node version / package manager (pnpm or npm)

This page reflects the latest committed results. For fresher numbers, run the generator and commit.
