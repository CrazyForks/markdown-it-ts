# Performance Report (latest run)

| Size (chars) | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | E1 one | S1 append(par) | S2 append(par) | S3 append(par) | S4 append(par) | S5 append(par) | M1 append(par) | E1 append(par) | S1 append(line) | S2 append(line) | S3 append(line) | S4 append(line) | S5 append(line) | M1 append(line) | E1 append(line) | S1 replace | S2 replace | S3 replace | S4 replace | S5 replace | M1 replace | E1 replace |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 0.0153ms | 0.0002ms | **0.0002ms** | 0.3314ms | 0.2332ms | 0.3693ms | 0.4497ms | 1.6416ms | 0.5162ms | **0.4173ms** | 0.8811ms | 0.8548ms | 0.8027ms | 1.0236ms | 3.2065ms | 1.2479ms | **1.0219ms** | 2.5253ms | 2.5851ms | 2.4244ms | 2.8599ms | 0.5902ms | 0.3512ms | 0.3124ms | 0.3910ms | **0.2836ms** | 0.5929ms | 0.5544ms |
| 20000 | 0.0003ms | **0.0002ms** | 0.0002ms | 1.1836ms | 0.8790ms | 0.9063ms | 1.1336ms | 4.0435ms | 1.6629ms | **1.5158ms** | 3.8523ms | 3.1555ms | 2.8927ms | 3.7756ms | 10.83ms | **5.6410ms** | 7.0396ms | 10.79ms | 8.7755ms | 7.7773ms | 10.29ms | 1.3790ms | 1.0796ms | 1.1258ms | 1.3376ms | 0.9161ms | **0.8840ms** | 1.1200ms |
| 50000 | 0.0005ms | 0.0005ms | **0.0002ms** | 3.0634ms | 2.4530ms | 2.0944ms | 2.7323ms | 9.9486ms | 4.1887ms | **4.0690ms** | 9.9472ms | 8.1168ms | 7.1008ms | 9.2305ms | 27.19ms | **6.8439ms** | 7.0219ms | 27.01ms | 22.00ms | 19.26ms | 25.26ms | 3.3490ms | 2.7509ms | 3.2499ms | 2.6806ms | 2.1455ms | **2.0846ms** | 2.9319ms |
| 100000 | 0.0005ms | **0.0005ms** | 0.0006ms | 6.7682ms | 6.7350ms | 4.9496ms | 7.3499ms | 21.37ms | **7.6029ms** | 7.9752ms | 20.82ms | 17.95ms | 14.21ms | 18.32ms | 56.28ms | **11.90ms** | 12.19ms | 56.57ms | 50.03ms | 39.02ms | 51.28ms | 7.2808ms | 6.0362ms | 7.0042ms | 6.4016ms | 5.7374ms | **4.0936ms** | 12.80ms |
| 200000 | 12.37ms | 12.01ms | 12.57ms | 14.92ms | 11.75ms | **10.34ms** | 17.62ms | 49.34ms | **26.24ms** | 26.78ms | 50.30ms | 45.70ms | 33.68ms | 44.66ms | 114.89ms | **44.33ms** | 51.54ms | 126.74ms | 106.93ms | 85.32ms | 108.18ms | 11.63ms | 11.68ms | 12.32ms | 19.73ms | 15.67ms | **8.6759ms** | 10.96ms |

Best (one-shot) per size:
- 5000: S3 0.0002ms (stream ON, cache ON, chunk ON)
- 20000: S2 0.0002ms (stream ON, cache ON, chunk OFF)
- 50000: S3 0.0002ms (stream ON, cache ON, chunk ON)
- 100000: S2 0.0005ms (stream ON, cache ON, chunk OFF)
- 200000: M1 10.34ms (markdown-it (baseline))

Best (append workload) per size:
- 5000: S3 0.4173ms (stream ON, cache ON, chunk ON)
- 20000: S3 1.5158ms (stream ON, cache ON, chunk ON)
- 50000: S3 4.0690ms (stream ON, cache ON, chunk ON)
- 100000: S2 7.6029ms (stream ON, cache ON, chunk OFF)
- 200000: S2 26.24ms (stream ON, cache ON, chunk OFF)

Best (line-append workload) per size:
- 5000: S3 1.0219ms (stream ON, cache ON, chunk ON)
- 20000: S2 5.6410ms (stream ON, cache ON, chunk OFF)
- 50000: S2 6.8439ms (stream ON, cache ON, chunk OFF)
- 100000: S2 11.90ms (stream ON, cache ON, chunk OFF)
- 200000: S2 44.33ms (stream ON, cache ON, chunk OFF)

Best (replace-paragraph workload) per size:
- 5000: S5 0.2836ms (stream OFF, chunk OFF)
- 20000: M1 0.8840ms (markdown-it (baseline))
- 50000: M1 2.0846ms (markdown-it (baseline))
- 100000: M1 4.0936ms (markdown-it (baseline))
- 200000: M1 8.6759ms (markdown-it (baseline))

Recommendations (by majority across sizes):
- One-shot: S3(2), S2(2), M1(1)
- Append-heavy: S3(3), S2(2)

Notes: S2/S3 appendHits should equal 5 when append fast-path triggers (shared env).

## Render throughput (markdown → HTML)

This measures end-to-end markdown → HTML rendering throughput across markdown-it-ts, upstream markdown-it, and remark+rehype (parse + stringify). Lower is better.

| Size (chars) | markdown-it-ts.render | markdown-it.render | remark+rehype | markdown-exit |
|---:|---:|---:|---:|---:|
| 5000 | 0.3162ms | 0.2625ms | 6.3421ms | 0.3462ms |
| 20000 | 1.1741ms | 1.0104ms | 29.74ms | 1.2948ms |
| 50000 | 3.0457ms | 2.5441ms | 84.72ms | 3.3085ms |
| 100000 | 7.0078ms | 6.0285ms | 189.38ms | 7.3030ms |
| 200000 | 15.94ms | 13.57ms | 616.25ms | 16.65ms |

Render vs markdown-it:
- 5,000 chars: 0.3162ms vs 0.2625ms → 0.83× faster
- 20,000 chars: 1.1741ms vs 1.0104ms → 0.86× faster
- 50,000 chars: 3.0457ms vs 2.5441ms → 0.84× faster
- 100,000 chars: 7.0078ms vs 6.0285ms → 0.86× faster
- 200,000 chars: 15.94ms vs 13.57ms → 0.85× faster

Render vs remark+rehype:
- 5,000 chars: 0.3162ms vs 6.3421ms → 20.06× faster
- 20,000 chars: 1.1741ms vs 29.74ms → 25.33× faster
- 50,000 chars: 3.0457ms vs 84.72ms → 27.82× faster
- 100,000 chars: 7.0078ms vs 189.38ms → 27.02× faster
- 200,000 chars: 15.94ms vs 616.25ms → 38.66× faster

Render vs markdown-exit:
- 5,000 chars: 0.3162ms vs 0.3462ms → 1.09× faster
- 20,000 chars: 1.1741ms vs 1.2948ms → 1.10× faster
- 50,000 chars: 3.0457ms vs 3.3085ms → 1.09× faster
- 100,000 chars: 7.0078ms vs 7.3030ms → 1.04× faster
- 200,000 chars: 15.94ms vs 16.65ms → 1.04× faster

## Best-of markdown-it-ts vs markdown-it (baseline)

| Size (chars) | TS best one | Baseline one | One ratio | TS best append | Baseline append | Append ratio | TS scenario (one/append) |
|---:|---:|---:|---:|---:|---:|---:|:--|
| 5000 | 0.0002ms | 0.3693ms | 0.00x | 0.4173ms | 0.8027ms | 0.52x | S3/S3 |
| 20000 | 0.0002ms | 0.9063ms | 0.00x | 1.5158ms | 2.8927ms | 0.52x | S2/S3 |
| 50000 | 0.0002ms | 2.0944ms | 0.00x | 4.0690ms | 7.1008ms | 0.57x | S3/S3 |
| 100000 | 0.0005ms | 4.9496ms | 0.00x | 7.6029ms | 14.21ms | 0.54x | S2/S2 |
| 200000 | 11.75ms | 10.34ms | 1.14x | 26.24ms | 33.68ms | 0.78x | S5/S2 |

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
| markdown-exit | 0.4253ms | 0.2595ms |
| markdown-it (baseline) | 0.3667ms | 0.1911ms |
| markdown-it-ts (stream+chunk) | 0.3096ms | 0.3897ms |
| remark (parse only) | 5.9785ms | 5.6399ms |

#### 20,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 1.1520ms | 1.1810ms |
| markdown-it (baseline) | 0.8592ms | 0.8247ms |
| markdown-it-ts (stream+chunk) | 0.9960ms | 0.9105ms |
| remark (parse only) | 25.31ms | 25.58ms |

#### 50,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 2.6131ms | 2.7732ms |
| markdown-it (baseline) | 1.8949ms | 2.1289ms |
| markdown-it-ts (stream+chunk) | 2.2287ms | 2.5688ms |
| remark (parse only) | 88.52ms | 76.59ms |

#### 100,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 5.4245ms | 6.2754ms |
| markdown-it (baseline) | 5.0579ms | 4.9727ms |
| markdown-it-ts (stream+chunk) | 6.1129ms | 6.4002ms |
| remark (parse only) | 191.93ms | 172.56ms |
