# Performance Report (latest run)

## Environment

- Generated at: 2026-06-24T01:00:39.398Z
- Node.js: v23.11.0
- Platform: darwin arm64
- CPU: Apple M1 Pro
- CPU count: 10
- Commit: cd1e8839977c67b7b5b24449e0bc08b6d96b8ce2

Default API note: normal `md.parse(src)` / `md.render(src)` calls may auto-activate an internal large-input path for very large finite strings only when no plugin has been installed and parser rulers have not been modified. Explicit chunk-stream APIs such as `parseIterable` / `UnboundedBuffer` are advanced tools for sources that already arrive as chunks.
External parser rows use each library's native output shape; this matrix compares throughput, not byte-for-byte output compatibility. `OXJ` adds `JSON.parse` on top of @ox-content/napi's AST JSON string to show the cost of materializing a JavaScript object tree.

| Size (chars) | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | E1 one | OX1 one | OXJ one | MM1 one | S1 append(par) | S2 append(par) | S3 append(par) | S4 append(par) | S5 append(par) | M1 append(par) | E1 append(par) | OX1 append(par) | OXJ append(par) | MM1 append(par) | S1 append(line) | S2 append(line) | S3 append(line) | S4 append(line) | S5 append(line) | M1 append(line) | E1 append(line) | OX1 append(line) | OXJ append(line) | MM1 append(line) | S1 replace | S2 replace | S3 replace | S4 replace | S5 replace | M1 replace | E1 replace | OX1 replace | OXJ replace | MM1 replace |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 0.2196ms | 0.1661ms | 0.2070ms | 0.2086ms | 0.0425ms | 0.2052ms | 0.2656ms | **0.0350ms** | 0.1717ms | 4.4276ms | 0.6623ms | 0.2863ms | 0.2541ms | 0.6172ms | 0.1206ms | 0.6793ms | 0.8818ms | **0.0570ms** | 0.1939ms | 14.55ms | 1.8913ms | 0.5632ms | 0.4055ms | 1.7349ms | 0.6689ms | 1.9365ms | 2.5204ms | **0.0885ms** | 0.2308ms | 40.87ms | 0.2400ms | 0.1676ms | 0.2143ms | 0.2290ms | 0.2184ms | 0.2751ms | 0.2817ms | **0.0342ms** | 0.1678ms | 5.6459ms |
| 20000 | 0.8461ms | 0.6606ms | 0.8612ms | 0.8456ms | 0.1586ms | 0.8322ms | 1.0668ms | **0.1338ms** | 0.6691ms | 20.39ms | 2.8844ms | 1.0488ms | 1.0540ms | 2.8894ms | 0.5437ms | 2.8558ms | 3.6545ms | **0.1702ms** | 0.7107ms | 66.93ms | 7.9504ms | 1.2554ms | 1.2773ms | 7.9326ms | 2.5465ms | 7.8261ms | 10.04ms | **0.2338ms** | 0.7683ms | 187.22ms | 0.8657ms | 0.7356ms | 0.8196ms | 0.8931ms | 0.7893ms | 0.8795ms | 1.0758ms | **0.1313ms** | 0.6630ms | 21.95ms |
| 50000 | 2.2164ms | 1.7290ms | 2.2308ms | 2.2136ms | 0.4542ms | 2.1523ms | 2.8315ms | **0.3757ms** | 1.7326ms | 52.18ms | 7.2568ms | 2.1570ms | 2.2397ms | 7.4131ms | 1.4549ms | 7.2152ms | 9.1643ms | **0.4193ms** | 1.7441ms | 175.04ms | 19.67ms | 2.7624ms | 2.7016ms | 20.10ms | 3.7243ms | 20.06ms | 25.04ms | **0.4484ms** | 1.8132ms | 482.81ms | 2.1362ms | 1.6781ms | 2.1310ms | 2.1646ms | 1.9986ms | 2.1158ms | 2.6594ms | **0.3580ms** | 1.7197ms | 50.85ms |
| 100000 | 5.0934ms | 4.7390ms | 5.4697ms | 5.2654ms | 1.4812ms | 5.3313ms | 6.5396ms | **0.7522ms** | 3.5254ms | 104.55ms | 15.46ms | 5.8761ms | 5.8676ms | 15.52ms | 2.8146ms | 14.43ms | 18.20ms | **0.8190ms** | 3.4793ms | 359.59ms | 40.64ms | 9.1001ms | 9.1258ms | 41.05ms | 7.5783ms | 39.00ms | 51.01ms | **0.8598ms** | 3.5091ms | 976.69ms | 4.3233ms | 3.8482ms | 4.2965ms | 4.3033ms | 6.0025ms | 4.4402ms | 5.7515ms | **0.8361ms** | 3.4851ms | 100.68ms |
| 200000 | 11.56ms | 10.43ms | 11.77ms | 11.79ms | 3.7401ms | 12.02ms | 14.28ms | **1.7581ms** | 7.3258ms | 208.36ms | 33.34ms | 13.07ms | 12.13ms | 33.45ms | 6.5684ms | 30.97ms | 44.87ms | **1.9593ms** | 7.4591ms | 757.00ms | 93.38ms | 21.58ms | 22.05ms | 107.10ms | 18.40ms | 92.81ms | 109.38ms | **1.9207ms** | 7.3288ms | 2038.95ms | 8.8159ms | 10.15ms | 9.2445ms | 8.9361ms | 12.55ms | 8.2247ms | 12.32ms | **1.5899ms** | 7.3273ms | 214.33ms |
| 500000 | 31.37ms | 25.57ms | 29.15ms | 30.67ms | 11.65ms | 33.24ms | 38.18ms | **4.6458ms** | 19.00ms | - | 95.45ms | 33.30ms | 33.21ms | 106.92ms | 29.56ms | 99.71ms | 124.05ms | **5.2358ms** | 18.85ms | - | 265.23ms | 36.51ms | 33.67ms | 279.28ms | 119.88ms | 289.28ms | 334.99ms | **6.2040ms** | 19.07ms | - | 27.48ms | 27.21ms | 27.39ms | 28.29ms | 44.11ms | 30.11ms | 39.09ms | **4.3727ms** | 18.17ms | - |
| 1000000 | 57.66ms | 68.65ms | 85.03ms | 55.67ms | 25.81ms | 63.77ms | 79.08ms | **9.0787ms** | 39.64ms | - | 214.02ms | 79.07ms | 84.14ms | 202.50ms | 73.39ms | 233.72ms | 293.28ms | **10.33ms** | 38.38ms | - | 640.50ms | 85.66ms | 97.32ms | 641.93ms | 230.50ms | 646.92ms | 817.99ms | **11.47ms** | 37.82ms | - | 58.30ms | 60.16ms | 57.04ms | 71.22ms | 88.11ms | 84.43ms | 81.19ms | **8.4499ms** | 37.71ms | - |

Best (one-shot) per size:
- 5000: OX1 0.0350ms (@ox-content/napi (parse only))
- 20000: OX1 0.1338ms (@ox-content/napi (parse only))
- 50000: OX1 0.3757ms (@ox-content/napi (parse only))
- 100000: OX1 0.7522ms (@ox-content/napi (parse only))
- 200000: OX1 1.7581ms (@ox-content/napi (parse only))
- 500000: OX1 4.6458ms (@ox-content/napi (parse only))
- 1000000: OX1 9.0787ms (@ox-content/napi (parse only))

Best (append workload) per size:
- 5000: OX1 0.0570ms (@ox-content/napi (parse only))
- 20000: OX1 0.1702ms (@ox-content/napi (parse only))
- 50000: OX1 0.4193ms (@ox-content/napi (parse only))
- 100000: OX1 0.8190ms (@ox-content/napi (parse only))
- 200000: OX1 1.9593ms (@ox-content/napi (parse only))
- 500000: OX1 5.2358ms (@ox-content/napi (parse only))
- 1000000: OX1 10.33ms (@ox-content/napi (parse only))

Best (line-append workload) per size:
- 5000: OX1 0.0885ms (@ox-content/napi (parse only))
- 20000: OX1 0.2338ms (@ox-content/napi (parse only))
- 50000: OX1 0.4484ms (@ox-content/napi (parse only))
- 100000: OX1 0.8598ms (@ox-content/napi (parse only))
- 200000: OX1 1.9207ms (@ox-content/napi (parse only))
- 500000: OX1 6.2040ms (@ox-content/napi (parse only))
- 1000000: OX1 11.47ms (@ox-content/napi (parse only))

Best (replace-paragraph workload) per size:
- 5000: OX1 0.0342ms (@ox-content/napi (parse only))
- 20000: OX1 0.1313ms (@ox-content/napi (parse only))
- 50000: OX1 0.3580ms (@ox-content/napi (parse only))
- 100000: OX1 0.8361ms (@ox-content/napi (parse only))
- 200000: OX1 1.5899ms (@ox-content/napi (parse only))
- 500000: OX1 4.3727ms (@ox-content/napi (parse only))
- 1000000: OX1 8.4499ms (@ox-content/napi (parse only))

Recommendations (by majority across sizes):
- One-shot: OX1(7)
- Append-heavy: OX1(7)

Notes: S2/S3 appendHits should equal 5 when append fast-path triggers (shared env).
Large-size rows may show `-` for especially heavy parse-only or render-only baselines (currently remark/micromark above 200k) so `perf:all` stays practical.

## Render API throughput (markdown → HTML)

This measures end-to-end render API throughput across markdown-it-ts, upstream markdown-it, @ox-content/napi, micromark (CommonMark reference), and remark+rehype (parse + stringify). Lower is better.
It is intentionally a full render-API benchmark (`parse + render`), not a renderer-only hot-path benchmark.

| Size (chars) | markdown-it-ts.render | markdown-it-ts.renderAsync | markdown-it.render | @ox-content/napi | micromark | remark+rehype | markdown-exit |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 0.0275ms | 0.0268ms | 0.2659ms | 0.0318ms | 5.5840ms | 6.3510ms | 0.3139ms |
| 20000 | 0.0936ms | 0.0943ms | 1.0115ms | 0.1778ms | 24.96ms | 28.95ms | 1.2538ms |
| 50000 | 0.2493ms | 0.2432ms | 2.5732ms | 0.3882ms | 64.60ms | 86.39ms | 3.2280ms |
| 100000 | 0.5141ms | 0.5057ms | 6.5609ms | 0.8094ms | 129.65ms | 199.22ms | 8.0743ms |
| 200000 | 0.9076ms | 1.0686ms | 15.38ms | 1.7079ms | 251.64ms | 502.82ms | 18.83ms |
| 500000 | 3.0155ms | 3.1505ms | 42.60ms | 4.4320ms | - | - | 50.21ms |
| 1000000 | 7.0260ms | 7.5847ms | 90.57ms | 7.6613ms | - | - | 106.46ms |

Render vs markdown-it:
- 5,000 chars: 0.0275ms vs 0.2659ms → 9.67× faster
- 20,000 chars: 0.0936ms vs 1.0115ms → 10.81× faster
- 50,000 chars: 0.2493ms vs 2.5732ms → 10.32× faster
- 100,000 chars: 0.5141ms vs 6.5609ms → 12.76× faster
- 200,000 chars: 0.9076ms vs 15.38ms → 16.95× faster
- 500,000 chars: 3.0155ms vs 42.60ms → 14.13× faster
- 1,000,000 chars: 7.0260ms vs 90.57ms → 12.89× faster

Render vs @ox-content/napi:
- 5,000 chars: 0.0275ms vs 0.0318ms → 1.16× faster, 13.6% less time
- 20,000 chars: 0.0936ms vs 0.1778ms → 1.9× faster, 47.4% less time
- 50,000 chars: 0.2493ms vs 0.3882ms → 1.56× faster, 35.8% less time
- 100,000 chars: 0.5141ms vs 0.8094ms → 1.57× faster, 36.5% less time
- 200,000 chars: 0.9076ms vs 1.7079ms → 1.88× faster, 46.9% less time
- 500,000 chars: 3.0155ms vs 4.4320ms → 1.47× faster, 32% less time
- 1,000,000 chars: 7.0260ms vs 7.6613ms → 1.09× faster, 8.3% less time

RenderAsync vs @ox-content/napi:
- 5,000 chars: 0.0268ms vs 0.0318ms → 1.19× faster, 15.9% less time
- 20,000 chars: 0.0943ms vs 0.1778ms → 1.89× faster, 47% less time
- 50,000 chars: 0.2432ms vs 0.3882ms → 1.6× faster, 37.4% less time
- 100,000 chars: 0.5057ms vs 0.8094ms → 1.6× faster, 37.5% less time
- 200,000 chars: 1.0686ms vs 1.7079ms → 1.6× faster, 37.4% less time
- 500,000 chars: 3.1505ms vs 4.4320ms → 1.41× faster, 28.9% less time
- 1,000,000 chars: 7.5847ms vs 7.6613ms → 1.01× faster, 1% less time

Render vs micromark:
- 5,000 chars: 0.0275ms vs 5.5840ms → 203.16× faster
- 20,000 chars: 0.0936ms vs 24.96ms → 266.80× faster
- 50,000 chars: 0.2493ms vs 64.60ms → 259.09× faster
- 100,000 chars: 0.5141ms vs 129.65ms → 252.19× faster
- 200,000 chars: 0.9076ms vs 251.64ms → 277.24× faster

Render vs remark+rehype:
- 5,000 chars: 0.0275ms vs 6.3510ms → 231.06× faster
- 20,000 chars: 0.0936ms vs 28.95ms → 309.44× faster
- 50,000 chars: 0.2493ms vs 86.39ms → 346.49× faster
- 100,000 chars: 0.5141ms vs 199.22ms → 387.53× faster
- 200,000 chars: 0.9076ms vs 502.82ms → 553.98× faster

Render vs markdown-exit:
- 5,000 chars: 0.0275ms vs 0.3139ms → 11.42× faster
- 20,000 chars: 0.0936ms vs 1.2538ms → 13.40× faster
- 50,000 chars: 0.2493ms vs 3.2280ms → 12.95× faster
- 100,000 chars: 0.5141ms vs 8.0743ms → 15.71× faster
- 200,000 chars: 0.9076ms vs 18.83ms → 20.74× faster
- 500,000 chars: 3.0155ms vs 50.21ms → 16.65× faster
- 1,000,000 chars: 7.0260ms vs 106.46ms → 15.15× faster

## Best-of markdown-it-ts vs markdown-it (baseline)

| Size (chars) | TS best one | Baseline one | One comparison | TS best append | Baseline append | Append comparison | TS scenario (one/append) |
|---:|---:|---:|:--|---:|---:|:--|:--|
| 5000 | 0.0425ms | 0.2052ms | 4.82× faster, 79.3% less time | 0.1206ms | 0.6793ms | 5.63× faster, 82.2% less time | S5/S5 |
| 20000 | 0.1586ms | 0.8322ms | 5.25× faster, 80.9% less time | 0.5437ms | 2.8558ms | 5.25× faster, 81% less time | S5/S5 |
| 50000 | 0.4542ms | 2.1523ms | 4.74× faster, 78.9% less time | 1.4549ms | 7.2152ms | 4.96× faster, 79.8% less time | S5/S5 |
| 100000 | 1.4812ms | 5.3313ms | 3.6× faster, 72.2% less time | 2.8146ms | 14.43ms | 5.13× faster, 80.5% less time | S5/S5 |
| 200000 | 3.7401ms | 12.02ms | 3.21× faster, 68.9% less time | 6.5684ms | 30.97ms | 4.71× faster, 78.8% less time | S5/S5 |
| 500000 | 11.65ms | 33.24ms | 2.85× faster, 64.9% less time | 29.56ms | 99.71ms | 3.37× faster, 70.4% less time | S5/S5 |
| 1000000 | 25.81ms | 63.77ms | 2.47× faster, 59.5% less time | 73.39ms | 233.72ms | 3.18× faster, 68.6% less time | S5/S5 |

- Comparison columns are written from markdown-it-ts against the markdown-it baseline.
- `faster / less time` is better; if a future run regresses, the wording will flip to `slower / more time`.

## Best-of markdown-it-ts vs @ox-content/napi

Note: the @ox-content/napi parse-only API returns an AST JSON string; these parse-only rows do not include a follow-up `JSON.parse` into JavaScript objects.

| Size (chars) | TS best one | @ox-content/napi one | One comparison | TS best append | @ox-content/napi append | Append comparison | TS scenario (one/append) |
|---:|---:|---:|:--|---:|---:|:--|:--|
| 5000 | 0.0425ms | 0.0350ms | 1.22× slower, 21.7% more time | 0.1206ms | 0.0570ms | 2.12× slower, 111.5% more time | S5/S5 |
| 20000 | 0.1586ms | 0.1338ms | 1.19× slower, 18.5% more time | 0.5437ms | 0.1702ms | 3.19× slower, 219.4% more time | S5/S5 |
| 50000 | 0.4542ms | 0.3757ms | 1.21× slower, 20.9% more time | 1.4549ms | 0.4193ms | 3.47× slower, 247% more time | S5/S5 |
| 100000 | 1.4812ms | 0.7522ms | 1.97× slower, 96.9% more time | 2.8146ms | 0.8190ms | 3.44× slower, 243.7% more time | S5/S5 |
| 200000 | 3.7401ms | 1.7581ms | 2.13× slower, 112.7% more time | 6.5684ms | 1.9593ms | 3.35× slower, 235.2% more time | S5/S5 |
| 500000 | 11.65ms | 4.6458ms | 2.51× slower, 150.8% more time | 29.56ms | 5.2358ms | 5.65× slower, 464.5% more time | S5/S5 |
| 1000000 | 25.81ms | 9.0787ms | 2.84× slower, 184.3% more time | 73.39ms | 10.33ms | 7.11× slower, 610.5% more time | S5/S5 |

- Append comparison uses markdown-it-ts stream append fast paths against @ox-content/napi incremental parser appends.

If the @ox-content/napi AST JSON string is parsed into JavaScript objects immediately after parsing:

| Size (chars) | TS best one | @ox-content/napi parse + JSON.parse | One comparison |
|---:|---:|---:|:--|
| 5000 | 0.0425ms | 0.1717ms | 4.04× faster, 75.2% less time |
| 20000 | 0.1586ms | 0.6691ms | 4.22× faster, 76.3% less time |
| 50000 | 0.4542ms | 1.7326ms | 3.81× faster, 73.8% less time |
| 100000 | 1.4812ms | 3.5254ms | 2.38× faster, 58% less time |
| 200000 | 3.7401ms | 7.3258ms | 1.96× faster, 48.9% less time |
| 500000 | 11.65ms | 19.00ms | 1.63× faster, 38.7% less time |
| 1000000 | 25.81ms | 39.64ms | 1.54× faster, 34.9% less time |

Experimental stock-subset AST JSON output:

This is not the default markdown-it-compatible `Token[]` API. It emits the same mdast JSON string as @ox-content/napi for the stock subset covered by the internal fast path, to measure how far a compact/string boundary can go without JS Token materialization.

| Size (chars) | markdown-it-ts stock AST JSON | @ox-content/napi parse | TS vs ox | @ox-content/napi parse + JSON.parse |
|---:|---:|---:|:--|---:|
| 5000 | 0.0279ms | 0.0367ms | 1.31× faster, 23.9% less time | 0.1847ms |
| 20000 | 0.0844ms | 0.1710ms | 2.03× faster, 50.6% less time | 0.7437ms |
| 50000 | 0.2194ms | 0.4462ms | 2.03× faster, 50.8% less time | 1.8686ms |
| 100000 | 0.4529ms | 0.9118ms | 2.01× faster, 50.3% less time | 3.8125ms |
| 200000 | 0.9489ms | 1.8550ms | 1.95× faster, 48.8% less time | 7.7640ms |
| 500000 | 1.9649ms | 4.7430ms | 2.41× faster, 58.6% less time | 19.33ms |
| 1000000 | 5.7872ms | 9.2383ms | 1.6× faster, 37.4% less time | 39.50ms |


### Diagnostic: Chunk Info (if chunked)

| Size (chars) | S1 one chunks | S3 one chunks | S4 one chunks | S1 append last | S3 append last | S4 append last |
|---:|---:|---:|---:|---:|---:|---:|
| 5000 | 4 | 4 | 4 | 4 | 4 | 4 |
| 20000 | 8 | 8 | 8 | 8 | 8 | 8 |
| 50000 | 8 | 8 | 8 | 8 | 8 | 8 |
| 100000 | 8 | 8 | 8 | 8 | 8 | 8 |
| 200000 | 8 | 8 | 8 | 8 | 8 | 8 |
| 500000 | 8 | 8 | 8 | 8 | 8 | 8 |
| 1000000 | 16 | 16 | 16 | 16 | 16 | 16 |

## Cold vs Hot (one-shot)

Cold-start parses instantiate a new parser and run once with no warmup. Hot parses use a fresh instance with warmup plus averaged runs across markdown-it-ts and external baselines.

#### 5,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| @ox-content/napi (parse + JSON.parse) | 0.2226ms | 0.2045ms |
| @ox-content/napi (parse only) | 0.1455ms | 0.0377ms |
| markdown-exit | 0.2747ms | 0.2530ms |
| markdown-it (baseline) | 0.2265ms | 0.1974ms |
| markdown-it-ts (stream+chunk) | 0.2382ms | 0.2103ms |
| micromark (parse only) | 6.2009ms | 4.7304ms |
| remark (parse only) | 5.6187ms | 5.6369ms |

#### 20,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| @ox-content/napi (parse + JSON.parse) | 0.6941ms | 0.7601ms |
| @ox-content/napi (parse only) | 0.1278ms | 0.1280ms |
| markdown-exit | 1.0412ms | 1.1405ms |
| markdown-it (baseline) | 0.8224ms | 0.8460ms |
| markdown-it-ts (stream+chunk) | 0.8819ms | 1.0559ms |
| micromark (parse only) | 21.27ms | 21.78ms |
| remark (parse only) | 24.90ms | 27.26ms |

#### 50,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| @ox-content/napi (parse + JSON.parse) | 1.8881ms | 1.8737ms |
| @ox-content/napi (parse only) | 0.5690ms | 0.4844ms |
| markdown-exit | 2.5481ms | 2.8050ms |
| markdown-it (baseline) | 1.9469ms | 2.1824ms |
| markdown-it-ts (stream+chunk) | 2.0691ms | 2.2970ms |
| micromark (parse only) | 53.71ms | 54.31ms |
| remark (parse only) | 80.18ms | 76.41ms |

#### 100,000 chars

| Impl | Cold | Hot |
|:--|---:|---:|
| @ox-content/napi (parse + JSON.parse) | 3.4136ms | 3.5924ms |
| @ox-content/napi (parse only) | 0.9510ms | 0.8875ms |
| markdown-exit | 5.1532ms | 6.6795ms |
| markdown-it (baseline) | 5.6211ms | 5.5115ms |
| markdown-it-ts (stream+chunk) | 5.7673ms | 5.0563ms |
| micromark (parse only) | 101.27ms | 104.62ms |
| remark (parse only) | 163.35ms | 170.03ms |
