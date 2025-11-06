# Performance Report (latest run)

| Size (chars) | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | S1 append | S2 append | S3 append | S4 append | S5 append | M1 append |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 0.01ms | 0.00ms | **0.00ms** | 0.39ms | 0.25ms | 0.39ms | 1.63ms | **0.42ms** | 0.46ms | 0.92ms | 0.83ms | 0.84ms |
| 20000 | 1.08ms | 1.10ms | **0.92ms** | 1.18ms | 0.93ms | 2.33ms | 3.71ms | **1.13ms** | 1.28ms | 3.91ms | 3.43ms | 3.59ms |
| 50000 | 2.63ms | 2.53ms | 2.54ms | 3.21ms | 2.56ms | **2.16ms** | 8.43ms | **3.33ms** | 3.42ms | 9.87ms | 8.36ms | 7.13ms |
| 100000 | 6.59ms | 6.15ms | 5.88ms | 6.79ms | 5.67ms | **4.93ms** | 18.45ms | 18.27ms | 19.51ms | 21.29ms | 20.17ms | **13.84ms** |
| 200000 | 14.90ms | 16.66ms | 12.35ms | 17.20ms | 15.65ms | **10.55ms** | 40.81ms | 41.25ms | 44.78ms | 47.03ms | 47.42ms | **32.42ms** |

Best (one-shot) per size:
- 5000: S3 0.00ms (stream ON, cache ON, chunk ON)
- 20000: S3 0.92ms (stream ON, cache ON, chunk ON)
- 50000: M1 2.16ms (markdown-it (baseline))
- 100000: M1 4.93ms (markdown-it (baseline))
- 200000: M1 10.55ms (markdown-it (baseline))

Best (append workload) per size:
- 5000: S2 0.42ms (stream ON, cache ON, chunk OFF)
- 20000: S2 1.13ms (stream ON, cache ON, chunk OFF)
- 50000: S2 3.33ms (stream ON, cache ON, chunk OFF)
- 100000: M1 13.84ms (markdown-it (baseline))
- 200000: M1 32.42ms (markdown-it (baseline))

Recommendations (by majority across sizes):
- One-shot: M1(3), S3(2)
- Append-heavy: S2(3), M1(2)

Notes: S2/S3 appendHits should equal 5 when append fast-path triggers (shared env).

## Best-of markdown-it-ts vs markdown-it (baseline)

| Size (chars) | TS best one | Baseline one | One ratio | TS best append | Baseline append | Append ratio | TS scenario (one/append) |
|---:|---:|---:|---:|---:|---:|---:|:--|
| 5000 | 0.00ms | 0.39ms | 0.00x | 0.42ms | 0.84ms | 0.50x | S3/S2 |
| 20000 | 0.92ms | 2.33ms | 0.40x | 1.13ms | 3.59ms | 0.32x | S3/S2 |
| 50000 | 2.53ms | 2.16ms | 1.17x | 3.33ms | 7.13ms | 0.47x | S2/S2 |
| 100000 | 5.67ms | 4.93ms | 1.15x | 18.27ms | 13.84ms | 1.32x | S5/S2 |
| 200000 | 12.35ms | 10.55ms | 1.17x | 40.81ms | 32.42ms | 1.26x | S3/S1 |

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