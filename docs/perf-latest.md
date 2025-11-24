# Performance Report (latest run)

| Size (chars) | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | S1 append | S2 append | S3 append | S4 append | S5 append | M1 append |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 0.0062ms | 0.0002ms | **0.0001ms** | 0.2408ms | 0.1379ms | 0.3870ms | 1.4954ms | 0.5422ms | **0.3864ms** | 0.5651ms | 0.4467ms | 0.6117ms |
| 20000 | 0.0002ms | 0.0001ms | **0.0001ms** | 0.6212ms | 0.4690ms | 0.5521ms | 2.1233ms | 0.8322ms | **0.7998ms** | 2.0131ms | 1.6146ms | 1.5351ms |
| 50000 | 0.0004ms | 0.0002ms | **0.0002ms** | 1.6285ms | 1.5024ms | 1.1349ms | 5.3213ms | 1.8980ms | **1.8767ms** | 5.2081ms | 4.3698ms | 3.6577ms |
| 100000 | 0.0004ms | **0.0003ms** | 0.0005ms | 3.7338ms | 3.0487ms | 2.7125ms | 11.13ms | 4.4367ms | **4.0870ms** | 10.90ms | 9.7263ms | 7.5369ms |
| 200000 | 7.4164ms | 9.3891ms | 8.2620ms | 8.4713ms | 7.8902ms | **7.1888ms** | 23.65ms | **14.29ms** | 14.93ms | 24.77ms | 23.08ms | 17.67ms |

Best (one-shot) per size:
- 5000: S3 0.0001ms (stream ON, cache ON, chunk ON)
- 20000: S3 0.0001ms (stream ON, cache ON, chunk ON)
- 50000: S3 0.0002ms (stream ON, cache ON, chunk ON)
- 100000: S2 0.0003ms (stream ON, cache ON, chunk OFF)
- 200000: M1 7.1888ms (markdown-it (baseline))

Best (append workload) per size:
- 5000: S3 0.3864ms (stream ON, cache ON, chunk ON)
- 20000: S3 0.7998ms (stream ON, cache ON, chunk ON)
- 50000: S3 1.8767ms (stream ON, cache ON, chunk ON)
- 100000: S3 4.0870ms (stream ON, cache ON, chunk ON)
- 200000: S2 14.29ms (stream ON, cache ON, chunk OFF)

Recommendations (by majority across sizes):
- One-shot: S3(3), S2(1), M1(1)
- Append-heavy: S3(4), S2(1)

Notes: S2/S3 appendHits should equal 5 when append fast-path triggers (shared env).

## Best-of markdown-it-ts vs markdown-it (baseline)

| Size (chars) | TS best one | Baseline one | One ratio | TS best append | Baseline append | Append ratio | TS scenario (one/append) |
|---:|---:|---:|---:|---:|---:|---:|:--|
| 5000 | 0.0001ms | 0.3870ms | 0.00x | 0.3864ms | 0.6117ms | 0.63x | S3/S3 |
| 20000 | 0.0001ms | 0.5521ms | 0.00x | 0.7998ms | 1.5351ms | 0.52x | S3/S3 |
| 50000 | 0.0002ms | 1.1349ms | 0.00x | 1.8767ms | 3.6577ms | 0.51x | S3/S3 |
| 100000 | 0.0003ms | 2.7125ms | 0.00x | 4.0870ms | 7.5369ms | 0.54x | S2/S3 |
| 200000 | 7.4164ms | 7.1888ms | 1.03x | 14.29ms | 17.67ms | 0.81x | S1/S2 |

- One ratio < 1.00 means markdown-it-ts best one-shot is faster than baseline.
- Append ratio < 1.00 highlights stream cache optimizations (fast-path appends).


### Diagnostic: Chunk Info (if chunked)

| Size (chars) | S1 one chunks | S3 one chunks | S4 one chunks | S1 append last | S3 append last | S4 append last |
|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 4 | 1 | 4 | 4 | 1 | 4 |
| 20000 | 8 | 1 | 8 | 8 | 1 | 8 |
| 50000 | 14 | 3 | 8 | 14 | 3 | 8 |
| 100000 | 27 | 5 | 8 | 27 | 5 | 8 |
| 200000 | 26 | 9 | 8 | 26 | 9 | 8 |

## Cold vs Hot (one-shot)

Cold-start parses instantiate a new parser and run once with no warmup. Hot parses use a fresh instance with warmup plus averaged runs. 表格按不同文档大小分别列出 markdown-it 与 remark 对照。

#### 5,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-it (baseline) | 0.2223ms | 0.1021ms |
| markdown-it-ts (stream+chunk) | 0.1642ms | 0.2124ms |
| remark (parse only) | 3.2366ms | 2.9032ms |

#### 20,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-it (baseline) | 0.4428ms | 0.4851ms |
| markdown-it-ts (stream+chunk) | 0.5043ms | 0.5555ms |
| remark (parse only) | 11.66ms | 17.79ms |

#### 50,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-it (baseline) | 1.0430ms | 1.1165ms |
| markdown-it-ts (stream+chunk) | 1.8573ms | 1.3491ms |
| remark (parse only) | 122.35ms | 41.80ms |

#### 100,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-it (baseline) | 2.1311ms | 3.1237ms |
| markdown-it-ts (stream+chunk) | 3.7076ms | 3.2714ms |
| remark (parse only) | 121.51ms | 94.88ms |
