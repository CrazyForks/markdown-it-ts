# Performance Report (latest run)

| Size (chars) | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | E1 one | S1 append(par) | S2 append(par) | S3 append(par) | S4 append(par) | S5 append(par) | M1 append(par) | E1 append(par) | S1 append(line) | S2 append(line) | S3 append(line) | S4 append(line) | S5 append(line) | M1 append(line) | E1 append(line) | S1 replace | S2 replace | S3 replace | S4 replace | S5 replace | M1 replace | E1 replace |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 0.0128ms | 0.0002ms | **0.0001ms** | 0.2751ms | 0.2099ms | 0.3454ms | 0.3569ms | 1.2536ms | **0.3590ms** | 0.3660ms | 0.7520ms | 0.7512ms | 0.6324ms | 0.8756ms | 2.5115ms | 1.0653ms | **0.7155ms** | 2.0396ms | 2.0384ms | 1.8337ms | 2.1602ms | 0.5250ms | 0.2183ms | 0.2258ms | 0.2540ms | **0.1972ms** | 0.4761ms | 0.5512ms |
| 20000 | 0.0003ms | **0.0002ms** | 0.0002ms | 0.9691ms | 0.7098ms | 0.7351ms | 0.8849ms | 3.2004ms | 1.3269ms | **1.1896ms** | 2.9843ms | 2.4744ms | 2.3402ms | 2.9851ms | 8.5924ms | **4.4186ms** | 5.6486ms | 8.8827ms | 6.9849ms | 6.1634ms | 8.1514ms | 1.1104ms | 0.8469ms | 0.9020ms | 1.0396ms | **0.6897ms** | 0.8855ms | 0.8361ms |
| 50000 | **0.0003ms** | 0.0003ms | 0.0003ms | 2.4838ms | 1.9411ms | 1.6991ms | 2.2152ms | 8.3130ms | 3.4417ms | **3.3670ms** | 7.8221ms | 6.5239ms | 5.6551ms | 7.3493ms | 21.66ms | **5.5726ms** | 5.7409ms | 21.91ms | 18.07ms | 15.48ms | 19.90ms | 2.6571ms | 2.2589ms | 2.5493ms | 2.2217ms | 1.7274ms | **1.6825ms** | 2.3368ms |
| 100000 | 0.0005ms | 0.0004ms | **0.0004ms** | 5.3897ms | 5.4302ms | 5.2024ms | 5.0447ms | 17.52ms | 6.7248ms | **6.3091ms** | 16.93ms | 14.54ms | 11.37ms | 15.30ms | 45.61ms | 10.28ms | **9.7979ms** | 46.21ms | 40.50ms | 31.21ms | 41.14ms | 9.2529ms | 5.1224ms | 5.7253ms | 5.0677ms | 4.8067ms | **3.4731ms** | 4.6441ms |
| 200000 | 13.22ms | 9.9013ms | 10.32ms | 12.40ms | 9.5088ms | **8.4868ms** | 10.45ms | 35.01ms | 25.32ms | **21.65ms** | 35.92ms | 33.10ms | 28.46ms | 31.98ms | 100.77ms | **35.57ms** | 37.70ms | 113.31ms | 101.33ms | 77.27ms | 87.54ms | 10.24ms | 10.82ms | 9.6870ms | 12.19ms | 10.17ms | **6.7623ms** | 8.5785ms |

Best (one-shot) per size:
- 5000: S3 0.0001ms (stream ON, cache ON, chunk ON)
- 20000: S2 0.0002ms (stream ON, cache ON, chunk OFF)
- 50000: S1 0.0003ms (stream ON, cache OFF, chunk ON)
- 100000: S3 0.0004ms (stream ON, cache ON, chunk ON)
- 200000: M1 8.4868ms (markdown-it (baseline))

Best (append workload) per size:
- 5000: S2 0.3590ms (stream ON, cache ON, chunk OFF)
- 20000: S3 1.1896ms (stream ON, cache ON, chunk ON)
- 50000: S3 3.3670ms (stream ON, cache ON, chunk ON)
- 100000: S3 6.3091ms (stream ON, cache ON, chunk ON)
- 200000: S3 21.65ms (stream ON, cache ON, chunk ON)

Best (line-append workload) per size:
- 5000: S3 0.7155ms (stream ON, cache ON, chunk ON)
- 20000: S2 4.4186ms (stream ON, cache ON, chunk OFF)
- 50000: S2 5.5726ms (stream ON, cache ON, chunk OFF)
- 100000: S3 9.7979ms (stream ON, cache ON, chunk ON)
- 200000: S2 35.57ms (stream ON, cache ON, chunk OFF)

Best (replace-paragraph workload) per size:
- 5000: S5 0.1972ms (stream OFF, chunk OFF)
- 20000: S5 0.6897ms (stream OFF, chunk OFF)
- 50000: M1 1.6825ms (markdown-it (baseline))
- 100000: M1 3.4731ms (markdown-it (baseline))
- 200000: M1 6.7623ms (markdown-it (baseline))

Recommendations (by majority across sizes):
- One-shot: S3(2), S2(1), S1(1), M1(1)
- Append-heavy: S3(4), S2(1)

Notes: S2/S3 appendHits should equal 5 when append fast-path triggers (shared env).

## Render throughput (markdown → HTML)

This measures end-to-end markdown → HTML rendering throughput across markdown-it-ts, upstream markdown-it, and remark+rehype (parse + stringify). Lower is better.

| Size (chars) | markdown-it-ts.render | markdown-it.render | remark+rehype | markdown-exit |
|---:|---:|---:|---:|---:|
| 5000 | 0.3030ms | 0.2115ms | 5.2532ms | 0.3168ms |
| 20000 | 0.9943ms | 0.7940ms | 23.29ms | 1.0380ms |
| 50000 | 2.5626ms | 1.9901ms | 69.32ms | 2.6650ms |
| 100000 | 5.8341ms | 4.6943ms | 151.76ms | 5.9143ms |
| 200000 | 13.06ms | 11.39ms | 492.86ms | 13.65ms |

Render vs markdown-it:
- 5,000 chars: 0.3030ms vs 0.2115ms → 0.70× faster
- 20,000 chars: 0.9943ms vs 0.7940ms → 0.80× faster
- 50,000 chars: 2.5626ms vs 1.9901ms → 0.78× faster
- 100,000 chars: 5.8341ms vs 4.6943ms → 0.80× faster
- 200,000 chars: 13.06ms vs 11.39ms → 0.87× faster

Render vs remark+rehype:
- 5,000 chars: 0.3030ms vs 5.2532ms → 17.34× faster
- 20,000 chars: 0.9943ms vs 23.29ms → 23.43× faster
- 50,000 chars: 2.5626ms vs 69.32ms → 27.05× faster
- 100,000 chars: 5.8341ms vs 151.76ms → 26.01× faster
- 200,000 chars: 13.06ms vs 492.86ms → 37.74× faster

Render vs markdown-exit:
- 5,000 chars: 0.3030ms vs 0.3168ms → 1.05× faster
- 20,000 chars: 0.9943ms vs 1.0380ms → 1.04× faster
- 50,000 chars: 2.5626ms vs 2.6650ms → 1.04× faster
- 100,000 chars: 5.8341ms vs 5.9143ms → 1.01× faster
- 200,000 chars: 13.06ms vs 13.65ms → 1.05× faster

## Best-of markdown-it-ts vs markdown-it (baseline)

| Size (chars) | TS best one | Baseline one | One ratio | TS best append | Baseline append | Append ratio | TS scenario (one/append) |
|---:|---:|---:|---:|---:|---:|---:|:--|
| 5000 | 0.0001ms | 0.3454ms | 0.00x | 0.3590ms | 0.6324ms | 0.57x | S3/S2 |
| 20000 | 0.0002ms | 0.7351ms | 0.00x | 1.1896ms | 2.3402ms | 0.51x | S2/S3 |
| 50000 | 0.0003ms | 1.6991ms | 0.00x | 3.3670ms | 5.6551ms | 0.60x | S1/S3 |
| 100000 | 0.0004ms | 5.2024ms | 0.00x | 6.3091ms | 11.37ms | 0.55x | S3/S3 |
| 200000 | 9.5088ms | 8.4868ms | 1.12x | 21.65ms | 28.46ms | 0.76x | S5/S3 |

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
| markdown-exit | 0.3385ms | 0.4461ms |
| markdown-it (baseline) | 0.3626ms | 0.4785ms |
| markdown-it-ts (stream+chunk) | 0.2592ms | 0.2228ms |
| remark (parse only) | 3.6878ms | 4.6024ms |

#### 20,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 0.9059ms | 0.9965ms |
| markdown-it (baseline) | 0.7318ms | 0.6820ms |
| markdown-it-ts (stream+chunk) | 0.7410ms | 0.8425ms |
| remark (parse only) | 21.49ms | 21.90ms |

#### 50,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 1.9679ms | 2.3140ms |
| markdown-it (baseline) | 1.4656ms | 1.6862ms |
| markdown-it-ts (stream+chunk) | 2.0674ms | 2.0676ms |
| remark (parse only) | 60.73ms | 66.55ms |

#### 100,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 5.1878ms | 5.0790ms |
| markdown-it (baseline) | 7.3817ms | 4.0644ms |
| markdown-it-ts (stream+chunk) | 4.9809ms | 5.1481ms |
| remark (parse only) | 157.86ms | 146.89ms |
