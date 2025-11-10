# Performance Report (latest run)

| Size (chars) | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | S1 append | S2 append | S3 append | S4 append | S5 append | M1 append |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 0.01ms | 0.00ms | **0.00ms** | 0.37ms | 0.25ms | 0.43ms | 1.54ms | 0.45ms | **0.41ms** | 0.97ms | 0.89ms | 0.84ms |
| 20000 | 1.09ms | 0.96ms | 0.96ms | 1.20ms | 0.95ms | **0.84ms** | 3.50ms | **1.20ms** | 1.32ms | 3.96ms | 3.33ms | 2.79ms |
| 50000 | 2.67ms | 2.59ms | 2.60ms | 3.18ms | 2.61ms | **2.18ms** | 8.46ms | **3.38ms** | 3.42ms | 9.91ms | 8.67ms | 7.09ms |
| 100000 | 6.57ms | 7.06ms | 5.94ms | 8.16ms | **5.60ms** | 5.90ms | 18.67ms | 18.37ms | 18.51ms | 21.19ms | 19.07ms | **14.08ms** |
| 200000 | **12.77ms** | 15.13ms | 16.22ms | 16.87ms | 14.63ms | 13.68ms | 43.57ms | 41.63ms | 42.33ms | 44.44ms | 42.37ms | **30.34ms** |

Best (one-shot) per size:
- 5000: S3 0.00ms (stream ON, cache ON, chunk ON)
- 20000: M1 0.84ms (markdown-it (baseline))
- 50000: M1 2.18ms (markdown-it (baseline))
- 100000: S5 5.60ms (stream OFF, chunk OFF)
- 200000: S1 12.77ms (stream ON, cache OFF, chunk ON)

Best (append workload) per size:
- 5000: S3 0.41ms (stream ON, cache ON, chunk ON)
- 20000: S2 1.20ms (stream ON, cache ON, chunk OFF)
- 50000: S2 3.38ms (stream ON, cache ON, chunk OFF)
- 100000: M1 14.08ms (markdown-it (baseline))
- 200000: M1 30.34ms (markdown-it (baseline))

Recommendations (by majority across sizes):
- One-shot: M1(2), S3(1), S5(1), S1(1)
- Append-heavy: S2(2), M1(2), S3(1)

Notes: S2/S3 appendHits should equal 5 when append fast-path triggers (shared env).

## Best-of markdown-it-ts vs markdown-it (baseline)

| Size (chars) | TS best one | Baseline one | One ratio | TS best append | Baseline append | Append ratio | TS scenario (one/append) |
|---:|---:|---:|---:|---:|---:|---:|:--|
| 5000 | 0.00ms | 0.43ms | 0.00x | 0.41ms | 0.84ms | 0.49x | S3/S3 |
| 20000 | 0.95ms | 0.84ms | 1.13x | 1.20ms | 2.79ms | 0.43x | S5/S2 |
| 50000 | 2.59ms | 2.18ms | 1.19x | 3.38ms | 7.09ms | 0.48x | S2/S2 |
| 100000 | 5.60ms | 5.90ms | 0.95x | 18.37ms | 14.08ms | 1.30x | S5/S2 |
| 200000 | 12.77ms | 13.68ms | 0.93x | 41.63ms | 30.34ms | 1.37x | S1/S2 |

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