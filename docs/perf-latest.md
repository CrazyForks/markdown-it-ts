# Performance Report (latest run)

| Size (chars) | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | S1 append | S2 append | S3 append | S4 append | S5 append | M1 append |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 0.0058ms | 0.0002ms | **0.0001ms** | 0.2415ms | 0.1434ms | 0.3879ms | 1.5962ms | 0.5495ms | **0.3929ms** | 0.5851ms | 0.4632ms | 0.6477ms |
| 20000 | 0.0002ms | 0.0001ms | **0.0001ms** | 0.6059ms | 0.4681ms | 0.5535ms | 2.0915ms | 0.8096ms | **0.7808ms** | 1.9845ms | 1.5990ms | 1.5491ms |
| 50000 | 0.0003ms | **0.0001ms** | 0.0002ms | 1.6019ms | 1.2825ms | 1.2046ms | 5.1313ms | 2.4118ms | **1.9403ms** | 5.0000ms | 4.2807ms | 3.7444ms |
| 100000 | 0.0004ms | **0.0003ms** | 0.0003ms | 3.7103ms | 3.6540ms | 2.7883ms | 10.96ms | 4.9287ms | **3.6803ms** | 10.71ms | 9.4593ms | 7.5342ms |
| 200000 | 7.5549ms | 7.4009ms | 6.6555ms | 9.9548ms | **6.4979ms** | 7.4687ms | 26.98ms | 18.03ms | **14.46ms** | 23.41ms | 22.18ms | 16.14ms |

Best (one-shot) per size:
- 5000: S3 0.0001ms (stream ON, cache ON, chunk ON)
- 20000: S3 0.0001ms (stream ON, cache ON, chunk ON)
- 50000: S2 0.0001ms (stream ON, cache ON, chunk OFF)
- 100000: S2 0.0003ms (stream ON, cache ON, chunk OFF)
- 200000: S5 6.4979ms (stream OFF, chunk OFF)

Best (append workload) per size:
- 5000: S3 0.3929ms (stream ON, cache ON, chunk ON)
- 20000: S3 0.7808ms (stream ON, cache ON, chunk ON)
- 50000: S3 1.9403ms (stream ON, cache ON, chunk ON)
- 100000: S3 3.6803ms (stream ON, cache ON, chunk ON)
- 200000: S3 14.46ms (stream ON, cache ON, chunk ON)

Recommendations (by majority across sizes):
- One-shot: S3(2), S2(2), S5(1)
- Append-heavy: S3(5)

Notes: S2/S3 appendHits should equal 5 when append fast-path triggers (shared env).

## Best-of markdown-it-ts vs markdown-it (baseline)

| Size (chars) | TS best one | Baseline one | One ratio | TS best append | Baseline append | Append ratio | TS scenario (one/append) |
|---:|---:|---:|---:|---:|---:|---:|:--|
| 5000 | 0.0001ms | 0.3879ms | 0.00x | 0.3929ms | 0.6477ms | 0.61x | S3/S3 |
| 20000 | 0.0001ms | 0.5535ms | 0.00x | 0.7808ms | 1.5491ms | 0.50x | S3/S3 |
| 50000 | 0.0001ms | 1.2046ms | 0.00x | 1.9403ms | 3.7444ms | 0.52x | S2/S3 |
| 100000 | 0.0003ms | 2.7883ms | 0.00x | 3.6803ms | 7.5342ms | 0.49x | S2/S3 |
| 200000 | 6.4979ms | 7.4687ms | 0.87x | 14.46ms | 16.14ms | 0.90x | S5/S3 |

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
| markdown-it (baseline) | 0.2167ms | 0.1657ms |
| markdown-it-ts (stream+chunk) | 0.1645ms | 0.1054ms |
| remark (parse only) | 2.4971ms | 2.8176ms |

#### 20,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-it (baseline) | 0.4401ms | 0.4423ms |
| markdown-it-ts (stream+chunk) | 0.4930ms | 0.4666ms |
| remark (parse only) | 12.37ms | 17.28ms |

#### 50,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-it (baseline) | 1.0175ms | 1.1383ms |
| markdown-it-ts (stream+chunk) | 1.1353ms | 1.2303ms |
| remark (parse only) | 42.47ms | 42.45ms |

#### 100,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-it (baseline) | 3.6688ms | 2.7355ms |
| markdown-it-ts (stream+chunk) | 3.2821ms | 3.4526ms |
| remark (parse only) | 119.79ms | 95.92ms |
