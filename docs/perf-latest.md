# Performance Report (latest run)

| Size (chars) | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | S1 append | S2 append | S3 append | S4 append | S5 append | M1 append |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 6.41ms | 0.90ms | 0.68ms | **0.60ms** | 0.83ms | 6.09ms | 4.22ms | 1.17ms | **0.85ms** | 1.40ms | 1.25ms | 2.73ms |
| 20000 | 2.09ms | 2.06ms | 1.96ms | 1.68ms | **1.31ms** | 2.67ms | 5.92ms | 1.60ms | **1.20ms** | 6.30ms | 3.77ms | 6.51ms |
| 50000 | 4.26ms | 2.66ms | 2.49ms | 3.04ms | **2.26ms** | 2.29ms | 12.88ms | **4.30ms** | 4.30ms | 12.44ms | 10.50ms | 10.89ms |
| 100000 | **5.35ms** | 6.45ms | 13.01ms | 7.74ms | 5.99ms | 5.85ms | 22.39ms | 20.73ms | 20.26ms | 23.51ms | 19.35ms | **16.87ms** |
| 200000 | 11.96ms | 13.42ms | 13.03ms | 42.44ms | 15.25ms | **11.27ms** | 59.86ms | **42.61ms** | 44.49ms | 66.71ms | 47.41ms | 45.34ms |

Best (one-shot) per size:
- 5000: S4 0.60ms (stream OFF, chunk ON)
- 20000: S5 1.31ms (stream OFF, chunk OFF)
- 50000: S5 2.26ms (stream OFF, chunk OFF)
- 100000: S1 5.35ms (stream ON, cache OFF, chunk ON)
- 200000: M1 11.27ms (markdown-it (baseline))

Best (append workload) per size:
- 5000: S3 0.85ms (stream ON, cache ON, chunk ON)
- 20000: S3 1.20ms (stream ON, cache ON, chunk ON)
- 50000: S2 4.30ms (stream ON, cache ON, chunk OFF)
- 100000: M1 16.87ms (markdown-it (baseline))
- 200000: S2 42.61ms (stream ON, cache ON, chunk OFF)

Recommendations (by majority across sizes):
- One-shot: S5(2), S4(1), S1(1), M1(1)
- Append-heavy: S3(2), S2(2), M1(1)

Notes: S2/S3 appendHits should equal 5 when append fast-path triggers (shared env).

## Best-of markdown-it-ts vs markdown-it (baseline)

| Size (chars) | TS best one | Baseline one | One ratio | TS best append | Baseline append | Append ratio | TS scenario (one/append) |
|---:|---:|---:|---:|---:|---:|---:|:--|
| 5000 | 0.60ms | 6.09ms | 0.10x | 0.85ms | 2.73ms | 0.31x | S4/S3 |
| 20000 | 1.31ms | 2.67ms | 0.49x | 1.20ms | 6.51ms | 0.18x | S5/S3 |
| 50000 | 2.26ms | 2.29ms | 0.99x | 4.30ms | 10.89ms | 0.39x | S5/S2 |
| 100000 | 5.35ms | 5.85ms | 0.91x | 19.35ms | 16.87ms | 1.15x | S1/S5 |
| 200000 | 11.96ms | 11.27ms | 1.06x | 42.61ms | 45.34ms | 0.94x | S1/S2 |

- One ratio < 1.00 means markdown-it-ts best one-shot is faster than baseline.
- Append ratio < 1.00 highlights stream cache optimizations (fast-path appends).


### Diagnostic: Chunk Info (if chunked)

| Size (chars) | S1 one chunks | S3 one chunks | S4 one chunks | S1 append last | S3 append last | S4 append last |
|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 4 | 4 | 4 | 4 | 4 | 4 |
| 20000 | 6 | 2 | 8 | 6 | 2 | 8 |
| 50000 | 6 | 6 | 8 | 6 | 6 | 8 |
| 100000 | - | - | 8 | - | - | 8 |
| 200000 | - | - | 8 | - | - | 8 |