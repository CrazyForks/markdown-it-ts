# Performance Report (latest run)

| Size (chars) | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | E1 one | MM1 one | S1 append(par) | S2 append(par) | S3 append(par) | S4 append(par) | S5 append(par) | M1 append(par) | E1 append(par) | MM1 append(par) | S1 append(line) | S2 append(line) | S3 append(line) | S4 append(line) | S5 append(line) | M1 append(line) | E1 append(line) | MM1 append(line) | S1 replace | S2 replace | S3 replace | S4 replace | S5 replace | M1 replace | E1 replace | MM1 replace |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 0.0141ms | 0.0002ms | **0.0002ms** | 0.3332ms | 0.2604ms | 0.3639ms | 0.4558ms | 5.2452ms | 1.6882ms | 0.4444ms | **0.3979ms** | 0.8789ms | 0.8228ms | 0.8398ms | 1.0784ms | 16.38ms | 3.3081ms | **0.9957ms** | 1.0419ms | 2.5511ms | 2.5334ms | 2.2814ms | 2.9108ms | 51.15ms | 0.8289ms | 0.6548ms | 0.4007ms | 0.2879ms | **0.2738ms** | 0.5306ms | 0.6205ms | 5.8401ms |
| 20000 | 0.0009ms | 0.0003ms | **0.0002ms** | 1.2107ms | 0.9141ms | 0.8784ms | 1.1783ms | 21.71ms | 3.9952ms | 1.3050ms | **1.1582ms** | 4.0221ms | 3.2802ms | 2.8399ms | 3.8064ms | 70.82ms | 10.83ms | **4.9292ms** | 5.9038ms | 10.93ms | 8.6102ms | 7.6522ms | 10.67ms | 193.80ms | 1.2599ms | **0.8962ms** | 1.0534ms | 1.3650ms | 1.0877ms | 0.9606ms | 1.1592ms | 20.82ms |
| 50000 | 0.0007ms | 0.0004ms | **0.0004ms** | 3.1835ms | 2.5397ms | 2.2133ms | 2.7472ms | 60.63ms | 10.18ms | 3.3048ms | **3.0812ms** | 9.9437ms | 8.5523ms | 7.1706ms | 9.3274ms | 207.10ms | 27.25ms | **3.9881ms** | 4.3957ms | 27.04ms | 22.61ms | 19.14ms | 25.67ms | 520.13ms | 2.9151ms | 2.4560ms | 2.6795ms | 2.8848ms | 2.4769ms | **2.0037ms** | 2.9526ms | 52.62ms |
| 100000 | 0.0017ms | **0.0006ms** | 0.0008ms | 7.4324ms | 6.9832ms | 5.1376ms | 7.7383ms | 118.54ms | 24.29ms | 7.6431ms | **6.1647ms** | 21.33ms | 18.84ms | 14.36ms | 19.08ms | 411.80ms | 62.44ms | **6.5164ms** | 7.1213ms | 87.39ms | 52.06ms | 39.11ms | 52.80ms | 1156.35ms | 14.80ms | 6.0343ms | 7.2565ms | 6.6547ms | 6.0563ms | **4.0029ms** | 6.0814ms | 142.93ms |
| 200000 | 16.76ms | **13.65ms** | 18.79ms | 18.82ms | 14.15ms | 17.81ms | 32.73ms | 267.65ms | 58.11ms | 29.60ms | **28.54ms** | 60.61ms | 49.21ms | 34.01ms | 52.77ms | 1279.29ms | 131.98ms | **41.24ms** | 57.19ms | 170.39ms | 144.65ms | 96.76ms | 121.09ms | 3682.22ms | 25.21ms | 33.08ms | 16.48ms | 17.06ms | 14.78ms | **9.4930ms** | 11.97ms | 281.33ms |

Best (one-shot) per size:
- 5000: S3 0.0002ms (stream ON, cache ON, chunk ON)
- 20000: S3 0.0002ms (stream ON, cache ON, chunk ON)
- 50000: S3 0.0004ms (stream ON, cache ON, chunk ON)
- 100000: S2 0.0006ms (stream ON, cache ON, chunk OFF)
- 200000: S2 13.65ms (stream ON, cache ON, chunk OFF)

Best (append workload) per size:
- 5000: S3 0.3979ms (stream ON, cache ON, chunk ON)
- 20000: S3 1.1582ms (stream ON, cache ON, chunk ON)
- 50000: S3 3.0812ms (stream ON, cache ON, chunk ON)
- 100000: S3 6.1647ms (stream ON, cache ON, chunk ON)
- 200000: S3 28.54ms (stream ON, cache ON, chunk ON)

Best (line-append workload) per size:
- 5000: S2 0.9957ms (stream ON, cache ON, chunk OFF)
- 20000: S2 4.9292ms (stream ON, cache ON, chunk OFF)
- 50000: S2 3.9881ms (stream ON, cache ON, chunk OFF)
- 100000: S2 6.5164ms (stream ON, cache ON, chunk OFF)
- 200000: S2 41.24ms (stream ON, cache ON, chunk OFF)

Best (replace-paragraph workload) per size:
- 5000: S5 0.2738ms (stream OFF, chunk OFF)
- 20000: S2 0.8962ms (stream ON, cache ON, chunk OFF)
- 50000: M1 2.0037ms (markdown-it (baseline))
- 100000: M1 4.0029ms (markdown-it (baseline))
- 200000: M1 9.4930ms (markdown-it (baseline))

Recommendations (by majority across sizes):
- One-shot: S3(3), S2(2)
- Append-heavy: S3(5)

Notes: S2/S3 appendHits should equal 5 when append fast-path triggers (shared env).

## Render throughput (markdown → HTML)

This measures end-to-end markdown → HTML rendering throughput across markdown-it-ts, upstream markdown-it, micromark (CommonMark reference), and remark+rehype (parse + stringify). Lower is better.

| Size (chars) | markdown-it-ts.render | markdown-it.render | micromark | remark+rehype | markdown-exit |
|---:|---:|---:|---:|---:|---:|
| 5000 | 0.7986ms | 0.3598ms | 7.2509ms | 8.6005ms | 1.0433ms |
| 20000 | 1.6156ms | 1.3819ms | 44.40ms | 53.85ms | 2.0440ms |
| 50000 | 4.0051ms | 3.7130ms | 80.38ms | 93.52ms | 3.6178ms |
| 100000 | 8.2731ms | 12.47ms | 173.34ms | 256.76ms | 8.7731ms |
| 200000 | 19.82ms | 17.90ms | 298.09ms | 454.49ms | 17.28ms |

Render vs markdown-it:
- 5,000 chars: 0.7986ms vs 0.3598ms → 0.45× faster
- 20,000 chars: 1.6156ms vs 1.3819ms → 0.86× faster
- 50,000 chars: 4.0051ms vs 3.7130ms → 0.93× faster
- 100,000 chars: 8.2731ms vs 12.47ms → 1.51× faster
- 200,000 chars: 19.82ms vs 17.90ms → 0.90× faster

Render vs micromark:
- 5,000 chars: 0.7986ms vs 7.2509ms → 9.08× faster
- 20,000 chars: 1.6156ms vs 44.40ms → 27.48× faster
- 50,000 chars: 4.0051ms vs 80.38ms → 20.07× faster
- 100,000 chars: 8.2731ms vs 173.34ms → 20.95× faster
- 200,000 chars: 19.82ms vs 298.09ms → 15.04× faster

Render vs remark+rehype:
- 5,000 chars: 0.7986ms vs 8.6005ms → 10.77× faster
- 20,000 chars: 1.6156ms vs 53.85ms → 33.33× faster
- 50,000 chars: 4.0051ms vs 93.52ms → 23.35× faster
- 100,000 chars: 8.2731ms vs 256.76ms → 31.04× faster
- 200,000 chars: 19.82ms vs 454.49ms → 22.93× faster

Render vs markdown-exit:
- 5,000 chars: 0.7986ms vs 1.0433ms → 1.31× faster
- 20,000 chars: 1.6156ms vs 2.0440ms → 1.27× faster
- 50,000 chars: 4.0051ms vs 3.6178ms → 0.90× faster
- 100,000 chars: 8.2731ms vs 8.7731ms → 1.06× faster
- 200,000 chars: 19.82ms vs 17.28ms → 0.87× faster

## Best-of markdown-it-ts vs markdown-it (baseline)

| Size (chars) | TS best one | Baseline one | One ratio | TS best append | Baseline append | Append ratio | TS scenario (one/append) |
|---:|---:|---:|---:|---:|---:|---:|:--|
| 5000 | 0.0002ms | 0.3639ms | 0.00x | 0.3979ms | 0.8398ms | 0.47x | S3/S3 |
| 20000 | 0.0002ms | 0.8784ms | 0.00x | 1.1582ms | 2.8399ms | 0.41x | S3/S3 |
| 50000 | 0.0004ms | 2.2133ms | 0.00x | 3.0812ms | 7.1706ms | 0.43x | S3/S3 |
| 100000 | 0.0006ms | 5.1376ms | 0.00x | 6.1647ms | 14.36ms | 0.43x | S2/S3 |
| 200000 | 13.65ms | 17.81ms | 0.77x | 28.54ms | 34.01ms | 0.84x | S2/S3 |

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
| markdown-exit | 0.5917ms | 0.5404ms |
| markdown-it (baseline) | 1.6097ms | 0.9792ms |
| markdown-it-ts (stream+chunk) | 0.3610ms | 0.3063ms |
| micromark (parse only) | 13.70ms | 11.74ms |
| remark (parse only) | 16.06ms | 10.33ms |

#### 20,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 1.2533ms | 1.4578ms |
| markdown-it (baseline) | 0.8340ms | 1.3210ms |
| markdown-it-ts (stream+chunk) | 1.3494ms | 1.5285ms |
| micromark (parse only) | 36.32ms | 51.87ms |
| remark (parse only) | 87.17ms | 44.99ms |

#### 50,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 5.2166ms | 2.9875ms |
| markdown-it (baseline) | 3.2481ms | 3.2716ms |
| markdown-it-ts (stream+chunk) | 5.7673ms | 2.8309ms |
| micromark (parse only) | 108.63ms | 68.63ms |
| remark (parse only) | 80.24ms | 84.94ms |

#### 100,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 8.6585ms | 7.8119ms |
| markdown-it (baseline) | 6.6560ms | 5.6328ms |
| markdown-it-ts (stream+chunk) | 5.5297ms | 7.5204ms |
| micromark (parse only) | 199.65ms | 133.22ms |
| remark (parse only) | 226.69ms | 293.13ms |
