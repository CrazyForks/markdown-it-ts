# 为什么要从 markdown-it 迁移到 markdown-it-ts（性能角度）

`markdown-it-ts` 在保持 API 兼容的同时，通过 TypeScript 重构与新增的“流式/分块”策略，在多数常见规模上显著快于上游 `markdown-it`。

> 注：以下数据来自本仓库“最新一次”性能报告（Node 20，合成段落型文本）。实际速度与机器/文本结构相关，建议用仓库脚本在你的数据上复测。

## TL;DR 结论

- 一次性解析（非流式）：通常快约 1.3×–6×（5k–100k 字符）
  - 代表值：
    - 5k：0.87ms vs 5.03ms → ≈5.8×
    - 20k：0.98ms vs 1.82ms → ≈1.9×
    - 50k：2.21ms vs 2.31ms → ≈持平/略快（0.96× 时间）
    - 100k：4.17ms vs 5.45ms → ≈1.3×

- 流式追加（stream=true，1 次初始 + 5 次 append）：常见规模快约 3×–4×
  - 代表值：
    - 20k：1.28ms vs 4.94ms → ≈3.9×
    - 50k：2.41ms vs 9.56ms → ≈4.0×
  - 说明：在 100k 的该合成工作负载下，基线一体化重解析偶有优势；建议结合内容特征调参（是否采用混合/分块 fallback）。

> 完整表格与方法说明：见 `docs/perf-latest.md` / `docs/perf-report.md`。

## 为什么会更快？

- 流式增量：纯“尾部追加（append-only）”只解析新增的尾段，并复用既有状态/统计。
- 可选分块（chunked）fallback：对超大文档，将一次性重解析分摊到更小的块，降低单次长尾。
- TS 重构后的热路径优化：减少不必要的复制、缓存行数/字符串检查微优化、递归改迭代等。

## 何时开启/如何调参

- 只做一次性解析：默认非流式即可；如文档很大，可启用 full 模式的分块 fallback，并以 `20k chars / 400 lines` 为初始阈值。
- 实时编辑 + 以“尾部追加”为主：开启 `stream: true`，并考虑 `streamChunkedFallback: true` 的混合策略（首次大文档或非追加的大修改时走分块）。
- 起步参数（可按你数据微调）：
  - `streamChunkSizeChars ≈ 10k`，`streamChunkSizeLines ≈ 200`，`streamChunkFenceAware: true`
  - full 模式阈值：`fullChunkThresholdChars ≈ 20k` / `fullChunkThresholdLines ≈ 400`

## 代表性数据（摘自最新报告）

| 场景 | 规模 | markdown-it-ts | markdown-it（基线） | 相对加速 |
|---|---:|---:|---:|---:|
| 一次性解析 | 5k | 0.87ms | 5.03ms | ≈5.8× |
| 一次性解析 | 20k | 0.98ms | 1.82ms | ≈1.9× |
| 一次性解析 | 50k | 2.21ms | 2.31ms | ≈1.0× |
| 一次性解析 | 100k | 4.17ms | 5.45ms | ≈1.3× |
| 流式追加 | 20k | 1.28ms | 4.94ms | ≈3.9× |
| 流式追加 | 50k | 2.41ms | 9.56ms | ≈4.0× |

> 以“最新一次”跑分为准：`docs/perf-latest.md`（英文）/ `docs/perf-latest.zh-CN.md`（中文）。

## 如何复现

本仓库提供脚本来复现与生成报告：

```bash
npm run build
node scripts/quick-benchmark.mjs

# 完整矩阵
npm run perf:matrix

# 非流式分块 sweep（阈值/块大小调参）
npm run perf:sweep
```

在 GitHub Actions 中也可以一键生成/更新 `docs/perf-latest.*.md`，详见 `docs/perf-report.md`。

## 参考

- 最新性能报告（英文）：`docs/perf-latest.md`
- 最新性能报告（中文）：`docs/perf-latest.zh-CN.md`
- 方法论与场景解释：`docs/perf-report.md`
- 流式优化细节与建议：`docs/stream-optimization.md`
