# Performance Report (latest run)

| Size (chars) | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | S1 append(par) | S2 append(par) | S3 append(par) | S4 append(par) | S5 append(par) | M1 append(par) | S1 append(line) | S2 append(line) | S3 append(line) | S4 append(line) | S5 append(line) | M1 append(line) | S1 replace | S2 replace | S3 replace | S4 replace | S5 replace | M1 replace |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 0.0134ms | 0.0003ms | **0.0002ms** | 0.3298ms | 0.2485ms | 0.5357ms | 1.6475ms | 0.5302ms | **0.4102ms** | 0.8744ms | 0.7695ms | 0.7985ms | 3.2181ms | 1.2304ms | **1.1109ms** | 2.4797ms | 2.5319ms | 2.6284ms | 0.6661ms | 0.3017ms | 0.2895ms | 0.2912ms | **0.2716ms** | 0.5622ms |
| 20000 | 0.0004ms | 0.0002ms | **0.0002ms** | 1.1810ms | 0.9020ms | 0.9343ms | 4.1214ms | 1.6558ms | **1.4922ms** | 3.8068ms | 3.1202ms | 2.8707ms | 10.56ms | **5.5815ms** | 6.9725ms | 34.76ms | 8.8825ms | 7.7022ms | 1.3504ms | 1.0957ms | 1.1635ms | 3.3384ms | **0.8538ms** | 0.9228ms |
| 50000 | 0.0007ms | 0.0005ms | **0.0005ms** | 4.1195ms | 2.5888ms | 2.9890ms | 17.20ms | **5.3295ms** | 5.7956ms | 14.27ms | 10.84ms | 8.3082ms | 41.13ms | **7.2811ms** | 9.2497ms | 41.10ms | 28.14ms | 19.78ms | 4.1494ms | 3.7100ms | 6.5056ms | 3.5021ms | 2.9287ms | **2.0161ms** |
| 100000 | 0.0006ms | **0.0005ms** | 0.0006ms | 6.9437ms | 6.6840ms | 6.1295ms | 20.97ms | 8.7833ms | **7.9940ms** | 21.00ms | 17.96ms | 13.91ms | 55.19ms | 13.28ms | **12.36ms** | 56.78ms | 49.43ms | 37.64ms | 11.10ms | 6.6306ms | 7.4135ms | 6.3625ms | 5.7349ms | **4.8031ms** |
| 200000 | 12.26ms | 11.70ms | 12.07ms | 14.90ms | 11.72ms | **10.14ms** | 45.77ms | 28.34ms | **26.66ms** | 44.35ms | 39.46ms | 32.25ms | 126.50ms | 44.56ms | **43.87ms** | 136.03ms | 106.82ms | 96.13ms | 12.28ms | 13.45ms | 12.56ms | 14.59ms | 18.75ms | **8.1069ms** |

Best (one-shot) per size:
- 5000: S3 0.0002ms (stream ON, cache ON, chunk ON)
- 20000: S3 0.0002ms (stream ON, cache ON, chunk ON)
- 50000: S3 0.0005ms (stream ON, cache ON, chunk ON)
- 100000: S2 0.0005ms (stream ON, cache ON, chunk OFF)
- 200000: M1 10.14ms (markdown-it (baseline))

Best (append workload) per size:
- 5000: S3 0.4102ms (stream ON, cache ON, chunk ON)
- 20000: S3 1.4922ms (stream ON, cache ON, chunk ON)
- 50000: S2 5.3295ms (stream ON, cache ON, chunk OFF)
- 100000: S3 7.9940ms (stream ON, cache ON, chunk ON)
- 200000: S3 26.66ms (stream ON, cache ON, chunk ON)

Best (line-append workload) per size:
- 5000: S3 1.1109ms (stream ON, cache ON, chunk ON)
- 20000: S2 5.5815ms (stream ON, cache ON, chunk OFF)
- 50000: S2 7.2811ms (stream ON, cache ON, chunk OFF)
- 100000: S3 12.36ms (stream ON, cache ON, chunk ON)
- 200000: S3 43.87ms (stream ON, cache ON, chunk ON)

Best (replace-paragraph workload) per size:
- 5000: S5 0.2716ms (stream OFF, chunk OFF)
- 20000: S5 0.8538ms (stream OFF, chunk OFF)
- 50000: M1 2.0161ms (markdown-it (baseline))
- 100000: M1 4.8031ms (markdown-it (baseline))
- 200000: M1 8.1069ms (markdown-it (baseline))

Recommendations (by majority across sizes):
- One-shot: S3(3), S2(1), M1(1)
- Append-heavy: S3(4), S2(1)

Notes: S2/S3 appendHits should equal 5 when append fast-path triggers (shared env).

## Render throughput (markdown → HTML)

This measures end-to-end markdown → HTML rendering throughput across markdown-it-ts, upstream markdown-it, and remark+rehype (parse + stringify). Lower is better.

| Size (chars) | markdown-it-ts.render | markdown-it.render | remark+rehype |
|---:|---:|---:|---:|
| 5000 | 0.3276ms | 0.2595ms | 5.7914ms |
| 20000 | 1.2303ms | 0.9931ms | 28.93ms |
| 50000 | 3.1365ms | 2.4237ms | 79.81ms |
| 100000 | 7.3150ms | 5.7146ms | 180.24ms |
| 200000 | 17.42ms | 13.23ms | 441.68ms |

Render vs markdown-it:
- 5,000 chars: 0.3276ms vs 0.2595ms → 0.79× faster
- 20,000 chars: 1.2303ms vs 0.9931ms → 0.81× faster
- 50,000 chars: 3.1365ms vs 2.4237ms → 0.77× faster
- 100,000 chars: 7.3150ms vs 5.7146ms → 0.78× faster
- 200,000 chars: 17.42ms vs 13.23ms → 0.76× faster

Render vs remark+rehype:
- 5,000 chars: 0.3276ms vs 5.7914ms → 17.68× faster
- 20,000 chars: 1.2303ms vs 28.93ms → 23.51× faster
- 50,000 chars: 3.1365ms vs 79.81ms → 25.45× faster
- 100,000 chars: 7.3150ms vs 180.24ms → 24.64× faster
- 200,000 chars: 17.42ms vs 441.68ms → 25.35× faster

## Best-of markdown-it-ts vs markdown-it (baseline)

| Size (chars) | TS best one | Baseline one | One ratio | TS best append | Baseline append | Append ratio | TS scenario (one/append) |
|---:|---:|---:|---:|---:|---:|---:|:--|
| 5000 | 0.0002ms | 0.5357ms | 0.00x | 0.4102ms | 0.7985ms | 0.51x | S3/S3 |
| 20000 | 0.0002ms | 0.9343ms | 0.00x | 1.4922ms | 2.8707ms | 0.52x | S3/S3 |
| 50000 | 0.0005ms | 2.9890ms | 0.00x | 5.3295ms | 8.3082ms | 0.64x | S3/S2 |
| 100000 | 0.0005ms | 6.1295ms | 0.00x | 7.9940ms | 13.91ms | 0.57x | S2/S3 |
| 200000 | 11.70ms | 10.14ms | 1.15x | 26.66ms | 32.25ms | 0.83x | S2/S3 |

- One ratio < 1.00 means markdown-it-ts best one-shot is faster than baseline.
- Append ratio < 1.00 highlights stream cache optimizations (fast-path appends).


### Diagnostic: Chunk Info (if chunked)

| Size (chars) | S1 one chunks | S3 one chunks | S4 one chunks | S1 append last | S3 append last | S4 append last |
|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 4 | 2 | 4 | 4 | 2 | 4 |
| 20000 | 8 | 6 | 8 | 8 | 6 | 8 |
| 50000 | 14 | 14 | 8 | 14 | 14 | 8 |
| 100000 | 27 | 27 | 8 | 27 | 27 | 8 |
| 200000 | 27 | 3 | 8 | 27 | 3 | 8 |

## Cold vs Hot (one-shot)

Cold-start parses instantiate a new parser and run once with no warmup. Hot parses use a fresh instance with warmup plus averaged runs. 表格按不同文档大小分别列出 markdown-it 与 remark 对照。

#### 5,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-it (baseline) | 0.3708ms | 0.2967ms |
| markdown-it-ts (stream+chunk) | 0.3166ms | 0.2277ms |
| remark (parse only) | 4.3190ms | 5.1434ms |

#### 20,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-it (baseline) | 0.8203ms | 0.8076ms |
| markdown-it-ts (stream+chunk) | 0.9026ms | 0.8963ms |
| remark (parse only) | 22.22ms | 23.45ms |

#### 50,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-it (baseline) | 1.8858ms | 2.1606ms |
| markdown-it-ts (stream+chunk) | 2.1416ms | 2.3893ms |
| remark (parse only) | 65.54ms | 70.16ms |

#### 100,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-it (baseline) | 5.1495ms | 4.8449ms |
| markdown-it-ts (stream+chunk) | 4.7437ms | 6.2685ms |
| remark (parse only) | 181.58ms | 195.56ms |
