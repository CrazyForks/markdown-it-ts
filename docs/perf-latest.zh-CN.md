# 性能报告（最新一次）

## 运行环境

- 生成时间：2026-06-24T01:00:39.398Z
- Node.js：v23.11.0
- 平台：darwin arm64
- CPU：Apple M1 Pro
- Commit：cd1e8839977c67b7b5b24449e0bc08b6d96b8ce2

默认 API 说明：普通 `md.parse(src)` / `md.render(src)` 面对超大但有限的字符串时，可能自动启用内部大文本优化。外部 parser 行保留各自原生输出形态；`OXJ` 表示在 `@ox-content/napi` 的 AST JSON 字符串后追加 `JSON.parse`。

## Parse 吞吐（one-shot）

| 字数 | S1 one | S2 one | S3 one | S4 one | S5 one | M1 one | E1 one | OX1 one | OXJ one | MM1 one |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 5,000 | 0.2196ms | 0.1661ms | 0.2070ms | 0.2086ms | 0.0425ms | 0.2052ms | 0.2656ms | **0.0350ms** | 0.1717ms | 4.4276ms |
| 20,000 | 0.8461ms | 0.6606ms | 0.8612ms | 0.8456ms | 0.1586ms | 0.8322ms | 1.0668ms | **0.1338ms** | 0.6691ms | 20.39ms |
| 50,000 | 2.2164ms | 1.7290ms | 2.2308ms | 2.2136ms | 0.4542ms | 2.1523ms | 2.8315ms | **0.3757ms** | 1.7326ms | 52.18ms |
| 100,000 | 5.0934ms | 4.7390ms | 5.4697ms | 5.2654ms | 1.4812ms | 5.3313ms | 6.5396ms | **0.7522ms** | 3.5254ms | 104.55ms |
| 200,000 | 11.56ms | 10.43ms | 11.77ms | 11.79ms | 3.7401ms | 12.02ms | 14.28ms | **1.7581ms** | 7.3258ms | 208.36ms |
| 500,000 | 31.37ms | 25.57ms | 29.15ms | 30.67ms | 11.65ms | 33.24ms | 38.18ms | **4.6458ms** | 19.00ms | - |
| 1,000,000 | 57.66ms | 68.65ms | 85.03ms | 55.67ms | 25.81ms | 63.77ms | 79.08ms | **9.0787ms** | 39.64ms | - |

## Render API 吞吐（parse + HTML 输出）

| 字数 | markdown-it-ts.render | markdown-it-ts.renderAsync | markdown-it.render | @ox-content/napi | micromark | remark+rehype | markdown-exit |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 5,000 | 0.0275ms | 0.0268ms | 0.2659ms | 0.0318ms | 5.5840ms | 6.3510ms | 0.3139ms |
| 20,000 | 0.0936ms | 0.0943ms | 1.0115ms | 0.1778ms | 24.96ms | 28.95ms | 1.2538ms |
| 50,000 | 0.2493ms | 0.2432ms | 2.5732ms | 0.3882ms | 64.60ms | 86.39ms | 3.2280ms |
| 100,000 | 0.5141ms | 0.5057ms | 6.5609ms | 0.8094ms | 129.65ms | 199.22ms | 8.0743ms |
| 200,000 | 0.9076ms | 1.0686ms | 15.38ms | 1.7079ms | 251.64ms | 502.82ms | 18.83ms |
| 500,000 | 3.0155ms | 3.1505ms | 42.60ms | 4.4320ms | - | - | 50.21ms |
| 1,000,000 | 7.0260ms | 7.5847ms | 90.57ms | 7.6613ms | - | - | 106.46ms |

## markdown-it-ts vs @ox-content/napi

| 字数 | TS 最佳 parse | ox parse-only | Parse 对比 | TS AST JSON | AST JSON 对比 | TS render | ox render | Render 对比 |
|---:|---:|---:|:--|---:|:--|---:|---:|:--|
| 5,000 | 0.0425ms | 0.0350ms | 1.22x 更慢 | 0.0279ms | 1.31x 更快 | 0.0275ms | 0.0318ms | 1.16x 更快 |
| 20,000 | 0.1586ms | 0.1338ms | 1.19x 更慢 | 0.0844ms | 2.03x 更快 | 0.0936ms | 0.1778ms | 1.90x 更快 |
| 50,000 | 0.4542ms | 0.3757ms | 1.21x 更慢 | 0.2194ms | 2.03x 更快 | 0.2493ms | 0.3882ms | 1.56x 更快 |
| 100,000 | 1.4812ms | 0.7522ms | 1.97x 更慢 | 0.4529ms | 2.01x 更快 | 0.5141ms | 0.8094ms | 1.57x 更快 |
| 200,000 | 3.7401ms | 1.7581ms | 2.13x 更慢 | 0.9489ms | 1.95x 更快 | 0.9076ms | 1.7079ms | 1.88x 更快 |
| 500,000 | 11.65ms | 4.6458ms | 2.51x 更慢 | 1.9649ms | 2.41x 更快 | 3.0155ms | 4.4320ms | 1.47x 更快 |
| 1,000,000 | 25.81ms | 9.0787ms | 2.84x 更慢 | 5.7872ms | 1.60x 更快 | 7.0260ms | 7.6613ms | 1.09x 更快 |

## 结论

- `@ox-content/napi` 的 parse-only 很快，因为它返回 AST JSON 字符串，而不是 JavaScript `Token[]` 对象图。
- `parseStockFastAstJson` 在本基准中已经快于 ox parse-only，说明扫描与紧凑字符串输出不是主要瓶颈。
- 默认 `md.parse()` 仍要返回 markdown-it 兼容、可变的 tokens，剩余差距主要来自 Token、children、map 数组与 GC 成本。
- 默认 `md.render()` 走 stock render 快路径后，在本快照中全尺寸都快于或接近 `@ox-content/napi` render。

场景说明：S1~S5 为 markdown-it-ts 配置矩阵；M1 为 markdown-it；E1 为 markdown-exit；OX1 为 `@ox-content/napi` parse-only；OXJ 为 ox parse + `JSON.parse`；MM1 为 micromark parse-only。
