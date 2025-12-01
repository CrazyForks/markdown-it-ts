# markdown-it-ts

[English](./README.md) | 简体中文

一个在 [markdown-it](https://github.com/markdown-it/markdown-it) 基础上重构的 TypeScript 版本，采用更模块化的架构，支持 tree-shaking，并将 parse/render 职责解耦。

## 安装

```bash
npm install markdown-it-ts
```

## 使用示例

```ts
import markdownIt from 'markdown-it-ts'

const md = markdownIt()
const html = md.render('# 你好，世界')
console.log(html)
```

需要异步渲染规则（例如异步语法高亮）？使用 `renderAsync`，它会等待异步规则的结果：

```typescript
const md = markdownIt()
const html = await md.renderAsync('# 你好，世界', {
  highlight: async (code, lang) => {
    const highlighted = await someHighlighter(code, lang)
    return highlighted
  },
})
```

## 性能说明（概览）

- 目标：在一次性解析（one-shot parse）下与上游 markdown-it 保持同级或更优的性能；在增量/编辑场景下提供可选的流式（stream）路径以降低重解析成本。
- 可复现：本仓库附带快速基准脚本与对比脚本，便于在本机环境复现与比较。

本地复现基准：

```bash
pnpm build
node scripts/quick-benchmark.mjs
# 生成/刷新完整报告与 README 片段
pnpm run perf:generate
pnpm run perf:update-readme
```

说明：
- 性能与 Node.js 版本、CPU 以及具体内容形态相关。请参考 `docs/perf-latest.md` 获取完整表格与运行环境信息。
- 流式（stream）模式默认以正确性为优先。对于编辑器输入（频繁追加）的场景，可使用 `StreamBuffer` 在“块级边界”进行刷写，以提高追加路径命中率。

## 与 markdown-it 的解析性能对比（一次性解析）

最新一次在本机环境（Node.js 版本、CPU 请见 `docs/perf-latest.md`）的对比结果（取 20 次平均值）：

<!-- perf-auto:one-examples:start -->
- 5,000 chars: 0.0001ms vs 0.3454ms → ~2461.8× faster (0.00× time)
- 20,000 chars: 0.0002ms vs 0.7351ms → ~4643.7× faster (0.00× time)
- 50,000 chars: 0.0003ms vs 1.6991ms → ~5824.9× faster (0.00× time)
- 100,000 chars: 0.0004ms vs 5.2024ms → ~12919.9× faster (0.00× time)
- 200,000 chars: 9.5088ms vs 8.4868ms → ~0.9× faster (1.12× time)
<!-- perf-auto:one-examples:end -->

注意：数字会因环境与内容不同而变化，建议在本地按上文“本地复现基准”步骤生成你自己的对比报告。若需在 CI 中进行回归检测，可运行：`pnpm run perf:check`。

### 与 remark 的解析性能对比（仅解析）

我们也会比较 `remark`（仅解析）的吞吐表现，以了解在纯解析任务中的差距。

单次解析耗时（越低越好）：

<!-- perf-auto:remark-one:start -->
- 5,000 chars: 0.0001ms vs 5.0277ms → 35835.7× faster
- 20,000 chars: 0.0002ms vs 21.64ms → 136730.8× faster
- 50,000 chars: 0.0003ms vs 61.32ms → 210202.5× faster
- 100,000 chars: 0.0004ms vs 142.14ms → 352987.4× faster
- 200,000 chars: 9.5088ms vs 338.30ms → 35.6× faster
<!-- perf-auto:remark-one:end -->

增量工作负载（append workload）：

<!-- perf-auto:remark-append:start -->
- 5,000 chars: 0.3590ms vs 15.23ms → 42.4× faster
- 20,000 chars: 1.1896ms vs 72.43ms → 60.9× faster
- 50,000 chars: 3.3670ms vs 200.90ms → 59.7× faster
- 100,000 chars: 6.3091ms vs 456.32ms → 72.3× faster
- 200,000 chars: 21.65ms vs 1072.71ms → 49.5× faster
<!-- perf-auto:remark-append:end -->

说明：
- `remark` 常与其他 rehype/插件配合，真实项目的耗时可能更高；这里仅对其解析吞吐进行对比。
- 结果依赖于机器配置与内容形态，建议参考 `docs/perf-latest.json` 或 `docs/perf-history/*.json` 上的完整数据。

## 渲染性能（markdown → HTML）

除了纯解析，我们也持续跟踪 markdown-it-ts、原版 markdown-it 以及 remark+rehype 的“解析 + HTML 输出”整体耗时。以下数据来自最近一次 `pnpm run perf:generate`。

### 对比 markdown-it renderer

<!-- perf-auto:render-md:start -->
- 5,000 chars: 0.3030ms vs 0.2115ms → ~0.7× faster
- 20,000 chars: 0.9943ms vs 0.7940ms → ~0.8× faster
- 50,000 chars: 2.5626ms vs 1.9901ms → ~0.8× faster
- 100,000 chars: 5.8341ms vs 4.6943ms → ~0.8× faster
- 200,000 chars: 13.06ms vs 11.39ms → ~0.9× faster
<!-- perf-auto:render-md:end -->

### 对比 remark + rehype renderer

<!-- perf-auto:render-remark:start -->
- 5,000 chars: 0.3030ms vs 5.2532ms → ~17.3× faster
- 20,000 chars: 0.9943ms vs 23.29ms → ~23.4× faster
- 50,000 chars: 2.5626ms vs 69.32ms → ~27.0× faster
- 100,000 chars: 5.8341ms vs 151.76ms → ~26.0× faster
- 200,000 chars: 13.06ms vs 492.86ms → ~37.7× faster
<!-- perf-auto:render-remark:end -->

本地复现：

```bash
pnpm build
node scripts/quick-benchmark.mjs
pnpm run perf:generate
pnpm run perf:update-readme
```

## 与 markdown-exit 的解析性能对比

下面表格比较了 markdown-it-ts（取最佳 one-shot 场景）与 `markdown-exit` 在 one-shot 解析（oneShotMs）上的表现：

| Size (chars) | markdown-it-ts (best one-shot) | markdown-exit (one-shot) |
|---:|---:|---:|
| 5,000 | 0.0001472ms | 0.3588764ms |
| 20,000 | 0.0001688ms | 0.8871354ms |
| 50,000 | 0.0003000ms | 2.1539625ms |
| 100,000 | 0.0004722ms | 5.0225138ms |
| 200,000 | 9.6601355ms | 12.8995730ms |

说明：markdown-it-ts 在较小文档上通过流式/分片策略获得显著 one-shot 优势；在非常大的文档（200k）上，各实现的绝对差距缩小。

### 与 markdown-exit 渲染器的对比

来自 `docs/perf-render-summary.csv` 的渲染（renderMs）汇总：

- 5,000 chars: markdown-it-ts 0.2814ms vs markdown-exit 0.2836ms → ~1.01×（markdown-it-ts 略快）
- 20,000 chars: markdown-it-ts 0.9555ms vs markdown-exit 1.0533ms → ~1.10×（markdown-it-ts 快）
- 50,000 chars: markdown-it-ts 2.5337ms vs markdown-exit 2.6055ms → ~1.03×（markdown-it-ts 快）
- 100,000 chars: markdown-it-ts 5.7094ms vs markdown-exit 5.8194ms → ~1.02×（markdown-it-ts 快）
- 200,000 chars: markdown-it-ts 12.3119ms vs markdown-exit 14.3799ms → ~1.17×（markdown-it-ts 快）


### 回归检查与对比

- 使用最近一次的基线进行回归检查（同一采集方法/同一机器更稳）：
  - `pnpm run perf:check:latest`
- 查看详细差异（按“最差”排序，便于定位）：
  - `pnpm run perf:diff`
- 在人工确认后将最新结果设为新的基线：
  - `pnpm run perf:accept`

## StreamBuffer（增量编辑建议）

当输入以“逐字符”方式到达时，直接调用 `md.stream.parse` 往往无法命中追加快路径（append fast-path）。
`StreamBuffer` 会聚合字符输入，只在安全的块级边界调用解析，从而保证正确性并提升命中率：

```ts
import markdownIt, { StreamBuffer } from 'markdown-it-ts'

const md = markdownIt({ stream: true })
const buffer = new StreamBuffer(md)

buffer.feed('Hello')
buffer.flushIfBoundary() // 尚未到块级边界，可能不触发

buffer.feed('\n\nWorld!\n')
buffer.flushIfBoundary() // 到达边界，触发增量解析

// 结束时确保一次最终解析
buffer.flushForce()
console.log(buffer.stats()) // 可查看 appendHits/fullParses 等统计
```

## 运行上游测试（可选）

本仓库可以在本地运行一部分上游 markdown-it 的测试与病理用例，默认关闭，因为：
- 需要在本仓库同级放置上游 `markdown-it` 仓库（测试使用相对路径引用其源码与夹具）
- 依赖网络从 GitHub 拉取参考脚本

启用方法（默认使用“同级目录”方式）：

```bash
# 目录结构类似：
#   ../markdown-it/    # 上游仓库（包含 index.mjs 与 fixtures）
#   ./markdown-it-ts/  # 本仓库

RUN_ORIGINAL=1 pnpm test
```

说明：
- 病理用例较重，涉及 worker 与网络，仅在需要时开启。
- CI 默认保持关闭。

如果不使用同级目录，也可以通过环境变量指定上游路径：

```bash
MARKDOWN_IT_DIR=/绝对路径/markdown-it RUN_ORIGINAL=1 pnpm test
```

便捷脚本：

```bash
pnpm run test:original           # 等价 RUN_ORIGINAL=1 pnpm test
pnpm run test:original:network   # 同时开启 RUN_NETWORK=1
```

## 致谢（Acknowledgements）

本项目在 markdown-it 的设计与实现基础上完成 TypeScript 化与架构重构，
我们对原项目及其维护者/贡献者（尤其是 Vitaly Puzrin 与社区）表示诚挚感谢。
很多算法、渲染行为、规范与测试用例都来自 markdown-it；没有这些工作就不会有此项目。

## 许可证

MIT。详见仓库中的 LICENSE。
