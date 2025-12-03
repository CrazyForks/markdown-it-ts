# Performance Report (latest run)

| Size (chars) | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | E1 one | S1 append(par) | S2 append(par) | S3 append(par) | S4 append(par) | S5 append(par) | M1 append(par) | E1 append(par) | S1 append(line) | S2 append(line) | S3 append(line) | S4 append(line) | S5 append(line) | M1 append(line) | E1 append(line) | S1 replace | S2 replace | S3 replace | S4 replace | S5 replace | M1 replace | E1 replace |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 0.0183ms | 0.0002ms | **0.0002ms** | 0.2939ms | 0.2184ms | 0.3564ms | 0.3596ms | 1.3986ms | 0.4119ms | **0.3475ms** | 0.7304ms | 0.8041ms | 0.6954ms | 0.9709ms | 2.9788ms | 1.1454ms | **0.9223ms** | 2.2011ms | 2.0291ms | 1.8581ms | 2.3221ms | 0.5888ms | 0.2194ms | 0.2413ms | 0.2393ms | **0.2038ms** | 0.5096ms | 0.5652ms |
| 20000 | 0.0003ms | 0.0002ms | **0.0002ms** | 0.9544ms | 0.7489ms | 0.7266ms | 0.9080ms | 3.1299ms | 1.4329ms | **1.2507ms** | 3.2531ms | 2.6519ms | 2.3354ms | 2.9633ms | 8.7672ms | **4.3698ms** | 5.4214ms | 8.7364ms | 7.1403ms | 6.2930ms | 8.0163ms | 0.9490ms | **0.6911ms** | 0.9333ms | 0.9675ms | 0.7121ms | 0.7237ms | 0.8576ms |
| 50000 | 0.0005ms | **0.0002ms** | 0.0003ms | 2.5144ms | 1.9301ms | 1.7031ms | 2.2411ms | 8.3903ms | **3.1670ms** | 3.3711ms | 7.9919ms | 6.5370ms | 6.6390ms | 7.2341ms | 21.66ms | **5.7056ms** | 5.7924ms | 21.78ms | 18.13ms | 15.05ms | 19.98ms | 2.6456ms | 1.8619ms | 2.5772ms | 2.1139ms | **1.7538ms** | 1.8497ms | 2.0780ms |
| 100000 | 0.0006ms | **0.0006ms** | 0.0007ms | 6.6984ms | 4.4115ms | 4.1314ms | 5.0952ms | 18.58ms | **6.1443ms** | 6.3905ms | 16.85ms | 15.48ms | 11.10ms | 14.98ms | 48.11ms | 9.9579ms | **9.6271ms** | 45.23ms | 40.39ms | 31.47ms | 41.10ms | 5.8591ms | 5.0950ms | 5.6150ms | 5.3227ms | 7.5226ms | **3.3190ms** | 4.6610ms |
| 200000 | 10.47ms | **9.8789ms** | 10.09ms | 12.66ms | 11.88ms | 10.94ms | 10.42ms | 35.67ms | 26.89ms | 27.40ms | 41.31ms | 33.20ms | **24.87ms** | 30.61ms | 104.91ms | 37.45ms | **36.02ms** | 102.23ms | 98.90ms | 68.72ms | 87.28ms | 10.88ms | 10.39ms | 10.54ms | 12.19ms | 9.2380ms | **6.9265ms** | 8.2989ms |

Best (one-shot) per size:
- 5000: S3 0.0002ms (stream ON, cache ON, chunk ON)
- 20000: S3 0.0002ms (stream ON, cache ON, chunk ON)
- 50000: S2 0.0002ms (stream ON, cache ON, chunk OFF)
- 100000: S2 0.0006ms (stream ON, cache ON, chunk OFF)
- 200000: S2 9.8789ms (stream ON, cache ON, chunk OFF)

Best (append workload) per size:
- 5000: S3 0.3475ms (stream ON, cache ON, chunk ON)
- 20000: S3 1.2507ms (stream ON, cache ON, chunk ON)
- 50000: S2 3.1670ms (stream ON, cache ON, chunk OFF)
- 100000: S2 6.1443ms (stream ON, cache ON, chunk OFF)
- 200000: M1 24.87ms (markdown-it (baseline))

Best (line-append workload) per size:
- 5000: S3 0.9223ms (stream ON, cache ON, chunk ON)
- 20000: S2 4.3698ms (stream ON, cache ON, chunk OFF)
- 50000: S2 5.7056ms (stream ON, cache ON, chunk OFF)
- 100000: S3 9.6271ms (stream ON, cache ON, chunk ON)
- 200000: S3 36.02ms (stream ON, cache ON, chunk ON)

Best (replace-paragraph workload) per size:
- 5000: S5 0.2038ms (stream OFF, chunk OFF)
- 20000: S2 0.6911ms (stream ON, cache ON, chunk OFF)
- 50000: S5 1.7538ms (stream OFF, chunk OFF)
- 100000: M1 3.3190ms (markdown-it (baseline))
- 200000: M1 6.9265ms (markdown-it (baseline))

Recommendations (by majority across sizes):
- One-shot: S2(3), S3(2)
- Append-heavy: S3(2), S2(2), M1(1)

Notes: S2/S3 appendHits should equal 5 when append fast-path triggers (shared env).

## Render throughput (markdown → HTML)

This measures end-to-end markdown → HTML rendering throughput across markdown-it-ts, upstream markdown-it, and remark+rehype (parse + stringify). Lower is better.

| Size (chars) | markdown-it-ts.render | markdown-it.render | remark+rehype | markdown-exit |
|---:|---:|---:|---:|---:|
| 5000 | 0.2931ms | 0.2113ms | 4.7301ms | 0.2651ms |
| 20000 | 0.9327ms | 0.7883ms | 26.95ms | 1.1856ms |
| 50000 | 2.4636ms | 2.0520ms | 70.14ms | 2.6550ms |
| 100000 | 6.0068ms | 4.8248ms | 186.00ms | 5.9397ms |
| 200000 | 13.93ms | 10.85ms | 370.97ms | 15.05ms |

Render vs markdown-it:
- 5,000 chars: 0.2931ms vs 0.2113ms → 0.72× faster
- 20,000 chars: 0.9327ms vs 0.7883ms → 0.85× faster
- 50,000 chars: 2.4636ms vs 2.0520ms → 0.83× faster
- 100,000 chars: 6.0068ms vs 4.8248ms → 0.80× faster
- 200,000 chars: 13.93ms vs 10.85ms → 0.78× faster

Render vs remark+rehype:
- 5,000 chars: 0.2931ms vs 4.7301ms → 16.14× faster
- 20,000 chars: 0.9327ms vs 26.95ms → 28.89× faster
- 50,000 chars: 2.4636ms vs 70.14ms → 28.47× faster
- 100,000 chars: 6.0068ms vs 186.00ms → 30.96× faster
- 200,000 chars: 13.93ms vs 370.97ms → 26.63× faster

Render vs markdown-exit:
- 5,000 chars: 0.2931ms vs 0.2651ms → 0.90× faster
- 20,000 chars: 0.9327ms vs 1.1856ms → 1.27× faster
- 50,000 chars: 2.4636ms vs 2.6550ms → 1.08× faster
- 100,000 chars: 6.0068ms vs 5.9397ms → 0.99× faster
- 200,000 chars: 13.93ms vs 15.05ms → 1.08× faster

## Best-of markdown-it-ts vs markdown-it (baseline)

| Size (chars) | TS best one | Baseline one | One ratio | TS best append | Baseline append | Append ratio | TS scenario (one/append) |
|---:|---:|---:|---:|---:|---:|---:|:--|
| 5000 | 0.0002ms | 0.3564ms | 0.00x | 0.3475ms | 0.6954ms | 0.50x | S3/S3 |
| 20000 | 0.0002ms | 0.7266ms | 0.00x | 1.2507ms | 2.3354ms | 0.54x | S3/S3 |
| 50000 | 0.0002ms | 1.7031ms | 0.00x | 3.1670ms | 6.6390ms | 0.48x | S2/S2 |
| 100000 | 0.0006ms | 4.1314ms | 0.00x | 6.1443ms | 11.10ms | 0.55x | S2/S2 |
| 200000 | 9.8789ms | 10.94ms | 0.90x | 26.89ms | 24.87ms | 1.08x | S2/S2 |

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
| markdown-exit | 0.3533ms | 0.2004ms |
| markdown-it (baseline) | 0.4555ms | 0.1611ms |
| markdown-it-ts (stream+chunk) | 0.2463ms | 0.2930ms |
| remark (parse only) | 5.7125ms | 4.2866ms |

#### 20,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 0.8163ms | 0.9381ms |
| markdown-it (baseline) | 0.6874ms | 0.6596ms |
| markdown-it-ts (stream+chunk) | 0.7374ms | 0.7457ms |
| remark (parse only) | 20.06ms | 20.59ms |

#### 50,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 2.0084ms | 2.2301ms |
| markdown-it (baseline) | 1.5616ms | 1.6983ms |
| markdown-it-ts (stream+chunk) | 1.7536ms | 2.0914ms |
| remark (parse only) | 56.45ms | 62.26ms |

#### 100,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 5.0540ms | 5.6267ms |
| markdown-it (baseline) | 4.2545ms | 4.0249ms |
| markdown-it-ts (stream+chunk) | 5.0433ms | 5.3399ms |
| remark (parse only) | 158.56ms | 140.46ms |
