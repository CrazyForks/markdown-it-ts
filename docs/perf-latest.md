# Performance Report (latest run)

| Size (chars) | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | E1 one | MM1 one | S1 append(par) | S2 append(par) | S3 append(par) | S4 append(par) | S5 append(par) | M1 append(par) | E1 append(par) | MM1 append(par) | S1 append(line) | S2 append(line) | S3 append(line) | S4 append(line) | S5 append(line) | M1 append(line) | E1 append(line) | MM1 append(line) | S1 replace | S2 replace | S3 replace | S4 replace | S5 replace | M1 replace | E1 replace | MM1 replace |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 0.0134ms | 0.0003ms | **0.0002ms** | 0.3542ms | 0.2431ms | 0.3936ms | 0.4829ms | 5.8611ms | 1.8418ms | 0.5433ms | **0.4003ms** | 0.9144ms | 0.8660ms | 0.9069ms | 1.1322ms | 17.09ms | 3.4590ms | 1.3434ms | **1.2096ms** | 2.5951ms | 2.5385ms | 2.6145ms | 3.0627ms | 44.34ms | 0.7621ms | 0.5842ms | 0.3464ms | 0.4106ms | **0.2982ms** | 0.5459ms | 0.6077ms | 5.7161ms |
| 20000 | 0.0004ms | 0.0002ms | **0.0002ms** | 1.2331ms | 1.0449ms | 0.9498ms | 1.1570ms | 24.76ms | 4.2796ms | 1.9968ms | **1.7064ms** | 4.2836ms | 3.6951ms | 2.9945ms | 3.9258ms | 83.09ms | 15.24ms | **6.1728ms** | 6.7144ms | 11.72ms | 9.8766ms | 7.9001ms | 10.30ms | 216.66ms | 1.3500ms | **0.8724ms** | 1.2489ms | 1.4765ms | 0.9150ms | 0.9757ms | 1.3705ms | 38.76ms |
| 50000 | 0.0005ms | **0.0004ms** | 0.0006ms | 3.2833ms | 2.6982ms | 2.1665ms | 2.9034ms | 62.55ms | 10.88ms | 4.9523ms | **4.3152ms** | 11.00ms | 9.3827ms | 7.0964ms | 9.4014ms | 203.91ms | 29.92ms | **8.0395ms** | 8.1343ms | 30.38ms | 27.74ms | 19.33ms | 26.26ms | 543.04ms | 3.8022ms | 3.1591ms | 3.4658ms | 3.2353ms | 2.8548ms | **2.3430ms** | 2.9214ms | 53.98ms |
| 100000 | 0.0027ms | **0.0004ms** | 0.0006ms | 6.8986ms | 5.5051ms | 5.0462ms | 7.5420ms | 121.10ms | 22.12ms | 8.2884ms | **7.9728ms** | 21.66ms | 20.57ms | 14.01ms | 19.02ms | 394.34ms | 59.30ms | 18.97ms | **12.21ms** | 65.83ms | 51.99ms | 38.16ms | 51.72ms | 1093.81ms | 7.7417ms | 5.2914ms | 7.3086ms | 6.8497ms | 5.6425ms | **4.9053ms** | 5.7430ms | 128.87ms |
| 200000 | 12.17ms | 12.02ms | 12.16ms | 14.82ms | 11.79ms | **10.65ms** | 14.62ms | 228.87ms | 51.31ms | **26.07ms** | 34.99ms | 51.17ms | 44.79ms | 29.99ms | 44.05ms | 815.87ms | 115.30ms | 50.44ms | **46.02ms** | 128.61ms | 109.19ms | 99.86ms | 107.89ms | 2245.48ms | 20.98ms | 13.79ms | 12.78ms | 15.68ms | 12.31ms | **8.6361ms** | 10.81ms | 253.34ms |

Best (one-shot) per size:
- 5000: S3 0.0002ms (stream ON, cache ON, chunk ON)
- 20000: S3 0.0002ms (stream ON, cache ON, chunk ON)
- 50000: S2 0.0004ms (stream ON, cache ON, chunk OFF)
- 100000: S2 0.0004ms (stream ON, cache ON, chunk OFF)
- 200000: M1 10.65ms (markdown-it (baseline))

Best (append workload) per size:
- 5000: S3 0.4003ms (stream ON, cache ON, chunk ON)
- 20000: S3 1.7064ms (stream ON, cache ON, chunk ON)
- 50000: S3 4.3152ms (stream ON, cache ON, chunk ON)
- 100000: S3 7.9728ms (stream ON, cache ON, chunk ON)
- 200000: S2 26.07ms (stream ON, cache ON, chunk OFF)

Best (line-append workload) per size:
- 5000: S3 1.2096ms (stream ON, cache ON, chunk ON)
- 20000: S2 6.1728ms (stream ON, cache ON, chunk OFF)
- 50000: S2 8.0395ms (stream ON, cache ON, chunk OFF)
- 100000: S3 12.21ms (stream ON, cache ON, chunk ON)
- 200000: S3 46.02ms (stream ON, cache ON, chunk ON)

Best (replace-paragraph workload) per size:
- 5000: S5 0.2982ms (stream OFF, chunk OFF)
- 20000: S2 0.8724ms (stream ON, cache ON, chunk OFF)
- 50000: M1 2.3430ms (markdown-it (baseline))
- 100000: M1 4.9053ms (markdown-it (baseline))
- 200000: M1 8.6361ms (markdown-it (baseline))

Recommendations (by majority across sizes):
- One-shot: S3(2), S2(2), M1(1)
- Append-heavy: S3(4), S2(1)

Notes: S2/S3 appendHits should equal 5 when append fast-path triggers (shared env).

## Render throughput (markdown → HTML)

This measures end-to-end markdown → HTML rendering throughput across markdown-it-ts, upstream markdown-it, micromark (CommonMark reference), and remark+rehype (parse + stringify). Lower is better.

| Size (chars) | markdown-it-ts.render | markdown-it.render | micromark | remark+rehype | markdown-exit |
|---:|---:|---:|---:|---:|---:|
| 5000 | 0.4013ms | 0.2947ms | 6.0247ms | 7.1699ms | 0.4324ms |
| 20000 | 1.3057ms | 1.0596ms | 32.12ms | 35.70ms | 1.5153ms |
| 50000 | 3.4224ms | 2.8393ms | 80.69ms | 89.82ms | 3.2369ms |
| 100000 | 7.4702ms | 6.2038ms | 137.53ms | 189.36ms | 7.2846ms |
| 200000 | 18.66ms | 16.53ms | 273.06ms | 470.58ms | 20.88ms |

Render vs markdown-it:
- 5,000 chars: 0.4013ms vs 0.2947ms → 0.73× faster
- 20,000 chars: 1.3057ms vs 1.0596ms → 0.81× faster
- 50,000 chars: 3.4224ms vs 2.8393ms → 0.83× faster
- 100,000 chars: 7.4702ms vs 6.2038ms → 0.83× faster
- 200,000 chars: 18.66ms vs 16.53ms → 0.89× faster

Render vs micromark:
- 5,000 chars: 0.4013ms vs 6.0247ms → 15.01× faster
- 20,000 chars: 1.3057ms vs 32.12ms → 24.60× faster
- 50,000 chars: 3.4224ms vs 80.69ms → 23.58× faster
- 100,000 chars: 7.4702ms vs 137.53ms → 18.41× faster
- 200,000 chars: 18.66ms vs 273.06ms → 14.63× faster

Render vs remark+rehype:
- 5,000 chars: 0.4013ms vs 7.1699ms → 17.87× faster
- 20,000 chars: 1.3057ms vs 35.70ms → 27.34× faster
- 50,000 chars: 3.4224ms vs 89.82ms → 26.25× faster
- 100,000 chars: 7.4702ms vs 189.36ms → 25.35× faster
- 200,000 chars: 18.66ms vs 470.58ms → 25.22× faster

Render vs markdown-exit:
- 5,000 chars: 0.4013ms vs 0.4324ms → 1.08× faster
- 20,000 chars: 1.3057ms vs 1.5153ms → 1.16× faster
- 50,000 chars: 3.4224ms vs 3.2369ms → 0.95× faster
- 100,000 chars: 7.4702ms vs 7.2846ms → 0.98× faster
- 200,000 chars: 18.66ms vs 20.88ms → 1.12× faster

## Best-of markdown-it-ts vs markdown-it (baseline)

| Size (chars) | TS best one | Baseline one | One ratio | TS best append | Baseline append | Append ratio | TS scenario (one/append) |
|---:|---:|---:|---:|---:|---:|---:|:--|
| 5000 | 0.0002ms | 0.3936ms | 0.00x | 0.4003ms | 0.9069ms | 0.44x | S3/S3 |
| 20000 | 0.0002ms | 0.9498ms | 0.00x | 1.7064ms | 2.9945ms | 0.57x | S3/S3 |
| 50000 | 0.0004ms | 2.1665ms | 0.00x | 4.3152ms | 7.0964ms | 0.61x | S2/S3 |
| 100000 | 0.0004ms | 5.0462ms | 0.00x | 7.9728ms | 14.01ms | 0.57x | S2/S3 |
| 200000 | 11.79ms | 10.65ms | 1.11x | 26.07ms | 29.99ms | 0.87x | S5/S2 |

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
| markdown-exit | 0.4218ms | 0.2722ms |
| markdown-it (baseline) | 0.3909ms | 0.1954ms |
| markdown-it-ts (stream+chunk) | 0.3357ms | 0.5286ms |
| micromark (parse only) | 9.0223ms | 5.0810ms |
| remark (parse only) | 6.9293ms | 5.9386ms |

#### 20,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 2.6355ms | 1.1833ms |
| markdown-it (baseline) | 1.5503ms | 0.8490ms |
| markdown-it-ts (stream+chunk) | 1.7605ms | 0.9478ms |
| micromark (parse only) | 20.54ms | 22.62ms |
| remark (parse only) | 29.42ms | 32.29ms |

#### 50,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 4.3982ms | 2.7705ms |
| markdown-it (baseline) | 3.1093ms | 2.0496ms |
| markdown-it-ts (stream+chunk) | 5.5777ms | 2.7625ms |
| micromark (parse only) | 65.12ms | 60.19ms |
| remark (parse only) | 79.03ms | 79.52ms |

#### 100,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-exit | 5.8127ms | 7.6761ms |
| markdown-it (baseline) | 6.0774ms | 5.9955ms |
| markdown-it-ts (stream+chunk) | 5.3241ms | 5.8905ms |
| micromark (parse only) | 130.06ms | 117.12ms |
| remark (parse only) | 181.49ms | 216.99ms |
