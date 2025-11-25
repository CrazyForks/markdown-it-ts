# Performance Report (latest run)

| Size (chars) | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | S1 append | S2 append | S3 append | S4 append | S5 append | M1 append |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 0.0056ms | 0.0002ms | **0.0001ms** | 0.2171ms | 0.1351ms | 0.3860ms | 1.4944ms | 0.4649ms | **0.3859ms** | 0.5352ms | 0.4094ms | 0.6090ms |
| 20000 | 0.0002ms | **0.0001ms** | 0.0001ms | 0.7905ms | 0.4547ms | 0.5603ms | 2.0905ms | 1.1433ms | **0.8292ms** | 2.0024ms | 1.5624ms | 1.5181ms |
| 50000 | 0.0003ms | 0.0001ms | **0.0001ms** | 1.7927ms | 1.2850ms | 1.1629ms | 5.0729ms | **1.8071ms** | 1.9680ms | 4.9848ms | 4.1062ms | 7.8287ms |
| 100000 | 0.0003ms | **0.0002ms** | 0.0002ms | 4.2889ms | 2.8836ms | 3.1506ms | 11.10ms | **4.2002ms** | 4.3822ms | 10.55ms | 9.4401ms | 7.2633ms |
| 200000 | 6.9099ms | 6.9033ms | 7.7345ms | 9.9763ms | 6.3584ms | **5.7631ms** | 27.21ms | 13.68ms | **13.40ms** | 23.02ms | 21.25ms | 20.53ms |

Best (one-shot) per size:
- 5000: S3 0.0001ms (stream ON, cache ON, chunk ON)
- 20000: S2 0.0001ms (stream ON, cache ON, chunk OFF)
- 50000: S3 0.0001ms (stream ON, cache ON, chunk ON)
- 100000: S2 0.0002ms (stream ON, cache ON, chunk OFF)
- 200000: M1 5.7631ms (markdown-it (baseline))

Best (append workload) per size:
- 5000: S3 0.3859ms (stream ON, cache ON, chunk ON)
- 20000: S3 0.8292ms (stream ON, cache ON, chunk ON)
- 50000: S2 1.8071ms (stream ON, cache ON, chunk OFF)
- 100000: S2 4.2002ms (stream ON, cache ON, chunk OFF)
- 200000: S3 13.40ms (stream ON, cache ON, chunk ON)

Recommendations (by majority across sizes):
- One-shot: S3(2), S2(2), M1(1)
- Append-heavy: S3(3), S2(2)

Notes: S2/S3 appendHits should equal 5 when append fast-path triggers (shared env).

## Render throughput (markdown → HTML)

This measures end-to-end markdown → HTML rendering throughput across markdown-it-ts, upstream markdown-it, and remark+rehype (parse + stringify). Lower is better.

| Size (chars) | markdown-it-ts.render | markdown-it.render | remark+rehype |
|---:|---:|---:|---:|
| 5000 | 0.1995ms | 0.1726ms | 3.6064ms |
| 20000 | 0.6398ms | 0.5392ms | 17.30ms |
| 50000 | 1.5739ms | 1.5629ms | 43.94ms |
| 100000 | 3.9403ms | 3.3152ms | 130.60ms |
| 200000 | 9.1943ms | 7.4146ms | 342.99ms |

Render vs markdown-it:
- 5,000 chars: 0.1995ms vs 0.1726ms → 0.87× faster
- 20,000 chars: 0.6398ms vs 0.5392ms → 0.84× faster
- 50,000 chars: 1.5739ms vs 1.5629ms → 0.99× faster
- 100,000 chars: 3.9403ms vs 3.3152ms → 0.84× faster
- 200,000 chars: 9.1943ms vs 7.4146ms → 0.81× faster

Render vs remark+rehype:
- 5,000 chars: 0.1995ms vs 3.6064ms → 18.08× faster
- 20,000 chars: 0.6398ms vs 17.30ms → 27.04× faster
- 50,000 chars: 1.5739ms vs 43.94ms → 27.92× faster
- 100,000 chars: 3.9403ms vs 130.60ms → 33.14× faster
- 200,000 chars: 9.1943ms vs 342.99ms → 37.30× faster

## Best-of markdown-it-ts vs markdown-it (baseline)

| Size (chars) | TS best one | Baseline one | One ratio | TS best append | Baseline append | Append ratio | TS scenario (one/append) |
|---:|---:|---:|---:|---:|---:|---:|:--|
| 5000 | 0.0001ms | 0.3860ms | 0.00x | 0.3859ms | 0.6090ms | 0.63x | S3/S3 |
| 20000 | 0.0001ms | 0.5603ms | 0.00x | 0.8292ms | 1.5181ms | 0.55x | S2/S3 |
| 50000 | 0.0001ms | 1.1629ms | 0.00x | 1.8071ms | 7.8287ms | 0.23x | S3/S2 |
| 100000 | 0.0002ms | 3.1506ms | 0.00x | 4.2002ms | 7.2633ms | 0.58x | S2/S2 |
| 200000 | 6.3584ms | 5.7631ms | 1.10x | 13.40ms | 20.53ms | 0.65x | S5/S3 |

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
| markdown-it (baseline) | 0.2058ms | 0.0998ms |
| markdown-it-ts (stream+chunk) | 0.1597ms | 0.1967ms |
| remark (parse only) | 3.0156ms | 3.5462ms |

#### 20,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-it (baseline) | 0.5177ms | 0.4399ms |
| markdown-it-ts (stream+chunk) | 0.4766ms | 0.4599ms |
| remark (parse only) | 12.45ms | 14.64ms |

#### 50,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-it (baseline) | 1.0300ms | 1.1737ms |
| markdown-it-ts (stream+chunk) | 1.2037ms | 1.2777ms |
| remark (parse only) | 37.31ms | 41.32ms |

#### 100,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| markdown-it (baseline) | 3.5051ms | 3.1514ms |
| markdown-it-ts (stream+chunk) | 4.1119ms | 4.1543ms |
| remark (parse only) | 118.62ms | 91.63ms |
