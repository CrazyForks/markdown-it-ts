# Performance Report (latest run)

| Size (chars) | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | E1 one | S1 append(par) | S2 append(par) | S3 append(par) | S4 append(par) | S5 append(par) | M1 append(par) | E1 append(par) | S1 append(line) | S2 append(line) | S3 append(line) | S4 append(line) | S5 append(line) | M1 append(line) | E1 append(line) | S1 replace | S2 replace | S3 replace | S4 replace | S5 replace | M1 replace | E1 replace |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 0.0123ms | 0.0002ms | **0.0002ms** | 0.2634ms | 0.1946ms | 0.3455ms | 0.3570ms | 1.2480ms | **0.3739ms** | 0.3796ms | 0.7154ms | 0.7251ms | 0.6314ms | 0.8882ms | 2.6825ms | 0.9369ms | **0.7318ms** | 1.9661ms | 2.0073ms | 1.7420ms | 2.1953ms | 0.6491ms | 0.2491ms | 0.2247ms | 0.2230ms | **0.1753ms** | 0.4800ms | 0.5967ms |
| 20000 | 0.0003ms | **0.0002ms** | 0.0002ms | 0.9009ms | 0.6799ms | 0.7093ms | 0.8425ms | 3.1655ms | 1.2614ms | **1.1675ms** | 3.0100ms | 2.4098ms | 2.2312ms | 2.8643ms | 8.2727ms | **4.3818ms** | 5.4496ms | 8.3387ms | 6.8497ms | 5.8751ms | 7.8228ms | 1.0766ms | 0.8236ms | 0.8568ms | 1.0991ms | **0.6859ms** | 0.8477ms | 0.8448ms |
| 50000 | 0.0006ms | **0.0003ms** | 0.0003ms | 2.4659ms | 1.8287ms | 1.6495ms | 2.1455ms | 7.8377ms | 3.4275ms | **3.3584ms** | 7.7162ms | 6.4062ms | 5.6364ms | 7.1410ms | 20.92ms | **5.3699ms** | 5.6184ms | 20.54ms | 17.29ms | 15.08ms | 20.00ms | 2.6064ms | 2.1324ms | 2.5437ms | 2.0286ms | 1.6875ms | **1.6495ms** | 2.3735ms |
| 100000 | 0.0005ms | 0.0005ms | **0.0003ms** | 5.2953ms | 4.1253ms | 4.0234ms | 5.7721ms | 16.49ms | **5.7955ms** | 7.1731ms | 16.07ms | 13.94ms | 10.85ms | 14.08ms | 42.41ms | **9.0168ms** | 9.1385ms | 43.27ms | 38.39ms | 29.41ms | 38.36ms | 5.5531ms | 4.6861ms | 5.3553ms | 5.0545ms | 4.6720ms | **2.9947ms** | 4.4131ms |
| 200000 | 11.11ms | 9.9958ms | 9.8809ms | 11.84ms | 8.9896ms | **8.0486ms** | 9.8088ms | 32.74ms | 25.12ms | **20.56ms** | 34.92ms | 35.26ms | 23.94ms | 32.87ms | 105.55ms | **34.32ms** | 35.40ms | 104.63ms | 95.09ms | 63.24ms | 85.94ms | 10.26ms | 10.28ms | 9.1963ms | 11.49ms | 9.6917ms | **6.3080ms** | 7.9868ms |

Best (one-shot) per size:
- 5000: S3 0.0002ms (stream ON, cache ON, chunk ON)
- 20000: S2 0.0002ms (stream ON, cache ON, chunk OFF)
- 50000: S2 0.0003ms (stream ON, cache ON, chunk OFF)
- 100000: S3 0.0003ms (stream ON, cache ON, chunk ON)
- 200000: M1 8.0486ms (markdown-it (baseline))

Best (append workload) per size:
- 5000: S2 0.3739ms (stream ON, cache ON, chunk OFF)
- 20000: S3 1.1675ms (stream ON, cache ON, chunk ON)
- 50000: S3 3.3584ms (stream ON, cache ON, chunk ON)
- 100000: S2 5.7955ms (stream ON, cache ON, chunk OFF)
- 200000: S3 20.56ms (stream ON, cache ON, chunk ON)

Best (line-append workload) per size:
- 5000: S3 0.7318ms (stream ON, cache ON, chunk ON)
- 20000: S2 4.3818ms (stream ON, cache ON, chunk OFF)
- 50000: S2 5.3699ms (stream ON, cache ON, chunk OFF)
- 100000: S2 9.0168ms (stream ON, cache ON, chunk OFF)
- 200000: S2 34.32ms (stream ON, cache ON, chunk OFF)

Best (replace-paragraph workload) per size:
- 5000: S5 0.1753ms (stream OFF, chunk OFF)
- 20000: S5 0.6859ms (stream OFF, chunk OFF)
- 50000: M1 1.6495ms (markdown-it (baseline))
- 100000: M1 2.9947ms (markdown-it (baseline))
- 200000: M1 6.3080ms (markdown-it (baseline))

Recommendations (by majority across sizes):
- One-shot: S3(2), S2(2), M1(1)
- Append-heavy: S3(3), S2(2)

Notes: S2/S3 appendHits should equal 5 when append fast-path triggers (shared env).

## Render throughput (markdown → HTML)

This measures end-to-end markdown → HTML rendering throughput across markdown-it-ts, upstream markdown-it, and remark+rehype (parse + stringify). Lower is better.

| Size (chars) | markdown-it-ts.render | markdown-it.render | remark+rehype | markdown-exit |
|---:|---:|---:|---:|---:|
| 5000 | 0.2481ms | 0.2052ms | 5.1964ms | 0.2746ms |
| 20000 | 0.8604ms | 0.7351ms | 22.75ms | 0.9816ms |
| 50000 | 2.3565ms | 1.9403ms | 63.11ms | 2.4406ms |
| 100000 | 5.2186ms | 4.5278ms | 144.18ms | 5.7371ms |
| 200000 | 12.43ms | 12.05ms | 456.53ms | 13.02ms |

Render vs markdown-it:
- 5,000 chars: 0.2481ms vs 0.2052ms → 0.83× faster
- 20,000 chars: 0.8604ms vs 0.7351ms → 0.85× faster
- 50,000 chars: 2.3565ms vs 1.9403ms → 0.82× faster
- 100,000 chars: 5.2186ms vs 4.5278ms → 0.87× faster
- 200,000 chars: 12.43ms vs 12.05ms → 0.97× faster

Render vs remark+rehype:
- 5,000 chars: 0.2481ms vs 5.1964ms → 20.94× faster
- 20,000 chars: 0.8604ms vs 22.75ms → 26.45× faster
- 50,000 chars: 2.3565ms vs 63.11ms → 26.78× faster
- 100,000 chars: 5.2186ms vs 144.18ms → 27.63× faster
- 200,000 chars: 12.43ms vs 456.53ms → 36.74× faster

Render vs markdown-exit:
- 5,000 chars: 0.2481ms vs 0.2746ms → 1.11× faster
- 20,000 chars: 0.8604ms vs 0.9816ms → 1.14× faster
- 50,000 chars: 2.3565ms vs 2.4406ms → 1.04× faster
- 100,000 chars: 5.2186ms vs 5.7371ms → 1.10× faster
- 200,000 chars: 12.43ms vs 13.02ms → 1.05× faster

## Best-of markdown-it-ts vs markdown-it (baseline)

| Size (chars) | TS best one | Baseline one | One ratio | TS best append | Baseline append | Append ratio | TS scenario (one/append) |
|---:|---:|---:|---:|---:|---:|---:|:--|
| 5000 | 0.0002ms | 0.3455ms | 0.00x | 0.3739ms | 0.6314ms | 0.59x | S3/S2 |
| 20000 | 0.0002ms | 0.7093ms | 0.00x | 1.1675ms | 2.2312ms | 0.52x | S2/S3 |
| 50000 | 0.0003ms | 1.6495ms | 0.00x | 3.3584ms | 5.6364ms | 0.60x | S2/S3 |
| 100000 | 0.0003ms | 4.0234ms | 0.00x | 5.7955ms | 10.85ms | 0.53x | S3/S2 |
| 200000 | 8.9896ms | 8.0486ms | 1.12x | 20.56ms | 23.94ms | 0.86x | S5/S3 |

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
| markdown-exit | 0.3267ms | 0.2819ms |
| markdown-it (baseline) | 0.2929ms | 0.3251ms |
| markdown-it-ts (stream+chunk) | 0.2461ms | 0.1888ms |
| remark (parse only) | 4.8779ms | 4.2537ms |

#### 20,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 0.8732ms | 0.8405ms |
| markdown-it (baseline) | 0.6331ms | 0.6034ms |
| markdown-it-ts (stream+chunk) | 0.6803ms | 0.7671ms |
| remark (parse only) | 18.79ms | 19.48ms |

#### 50,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 1.9324ms | 2.1231ms |
| markdown-it (baseline) | 2.0694ms | 1.5483ms |
| markdown-it-ts (stream+chunk) | 2.2029ms | 1.8400ms |
| remark (parse only) | 52.57ms | 80.28ms |

#### 100,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 3.9225ms | 4.9353ms |
| markdown-it (baseline) | 4.2897ms | 3.8116ms |
| markdown-it-ts (stream+chunk) | 4.5608ms | 4.3767ms |
| remark (parse only) | 147.71ms | 159.43ms |
