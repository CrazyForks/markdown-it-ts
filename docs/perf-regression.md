# Performance regression guard

This repo ships a simple, repeatable harness to track performance across sizes and scenarios, and a comparator that flags regressions.

## What it measures

The matrix covers:
- Sizes: 5k, 20k, 50k, 100k (chars)
- Scenarios:
  - S1: stream ON, cache OFF, chunk ON
  - S2: stream ON, cache ON, chunk OFF
  - S3: stream ON, cache ON, chunk ON
  - S4: stream OFF, chunk ON
  - S5: stream OFF, chunk OFF
  - M1: markdown-it baseline
- Metrics per scenario:
  - oneShotMs: one full parse time
  - appendWorkloadMs: 1 initial + 5 appends total time
  - chunkInfo diagnostics when chunked

## Generate a fresh snapshot

```bash
npm run perf:generate
```

This writes:
- docs/perf-latest.md — human report
- docs/perf-latest.json — machine-readable snapshot
- docs/perf-history/perf-<shortSHA>.json — archived copy (if git is available)

## Compare two snapshots

```bash
# Compare latest vs a baseline file with a 10% regression threshold
node scripts/perf-compare.mjs docs/perf-latest.json docs/perf-history/perf-<baselineSHA>.json --threshold=0.10
```

The comparator prints deltas for one-shot and append workloads per size/scenario and exits with code 1 if any delta > threshold.

## Quick check against the most recent archive

```bash
npm run perf:check
```

This finds the most recent archived snapshot (excluding current SHA when available) and compares it against docs/perf-latest.json.

## CI tips

We include a ready-to-use GitHub Actions workflow at `.github/workflows/perf-regression.yml` which:

1) Checks out the PR base and head into separate folders
2) Installs deps, builds, and runs `perf:generate` for both
3) Compares `head/docs/perf-latest.json` against `base/docs/perf-latest.json` and fails on regressions over the threshold

General guidance:
- Pin Node version (e.g., Node 20.x) to avoid runtime variance.
- Use pnpm with frozen lockfile for deterministic installs.
- Consider increasing iterations in the harness for smoother numbers if needed.
- Use a slightly higher threshold (e.g., 0.15) if your CI is noisy.
