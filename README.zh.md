[English](README.md) · **中文**

# video-spec-remotion

> 基于 [video-spec-builder](https://github.com/feicaiclub/video-spec-builder) 改造的 **Remotion** 版本。
> 通过 AI 对话生成分镜脚本，然后用 Remotion (React → 视频) 渲染成真正的视频。

---

## 版本说明

### 原项目

本项目基于 [feicaiclub/video-spec-builder](https://github.com/feicaiclub/video-spec-builder) 开发。原项目是一个 AI skill，作用是通过苏格拉底式的追问对话，帮你把模糊的视频想法变成一份精确到秒的分镜脚本 `video-spec.md`。原项目的设计渲染端是 **HeyGen HyperFrames**——一个将 HTML/CSS 渲染成视频的闭源工具。

原项目的架构分为两层：

- **思考层**：追问流程、对话策略、场景拆解方法论、节奏规范、问题库——这套逻辑完全通用，和渲染引擎无关
- **描述层**：spec 模板、69 个组件目录、视觉主题系统、能力对照表——抽象定义通用，但引用了 HyperFrames 的具体实现

### 为什么要做 Remotion 版

原版 HyperFrames 存在几个限制：

1. **闭源**：HyperFrames 是 HeyGen 的内部工具，无法自行部署或深度定制
2. **无实时预览**：写完 spec 后只能渲染才能看到效果，调试周期长
3. **HTML 渲染上限**：基于 HTML/CSS 的渲染在复杂动效、3D、粒子等方面有天花板
4. **生态封闭**：组件库是私有的，无法使用 npm 生态的现成方案

[Remotion](https://www.remotion.dev/) 是一个用 React 写视频的开源框架——组件就是 React 组件，动画就是 `spring()` / `interpolate()`，最终通过 FFmpeg 渲染成 mp4。它天然解决了上述所有问题。

### 做了哪些改动

#### 1. 渲染引擎替换

| 维度 | 原版 (HyperFrames) | 本版 (Remotion) |
|---|---|---|
| 渲染原理 | HTML → 截帧 → 视频 | React 组件逐帧渲染 → FFmpeg |
| 编程模型 | HTML/CSS/JS | React + TypeScript |
| 预览 | 无 | 浏览器实时预览 (`npm run preview`) |
| 渲染 | HyperFrames CLI | `npm run render` → 本地 FFmpeg |
| 部署 | 依赖 HeyGen 服务 | 完全本地，也可用 Remotion Lambda 云渲染 |
| 开源 | ❌ 闭源 | ✅ 全部代码开源 |

#### 2. 设计系统 TypeScript 化

原版的设计系统是三件套：`design.md`（YAML 定义）+ `tokens.css`（CSS 变量）+ `spec-mono-components.md`（69 个组件的逐个样式规格）。

本版将其完整迁移到 TypeScript：

| 原版文件 | Remotion 版文件 | 改进点 |
|---|---|---|
| `design.md` YAML 头 | `themes/_template.ts` DesignTokens 接口 | 类型安全，编辑器自动补全 |
| `tokens.css` CSS 变量 | `src/styles/typography.ts` | 工具函数 `heroStyle()` / `statStyle()` 等 |
| `tokens.css` 装饰工具类 | `src/styles/decorative.tsx` | React 组件 `CornerCross` / `TickRule` / `Hairline` 等 |
| `tokens.css` 背景纹理 | `src/styles/backgrounds.tsx` | `<SceneBackground>` 组件 |
| `tokens.css` 入场动画 | `src/styles/animations.ts` + `constants.ts` | hooks `useEntrance()` / `usePulse()` + 统一 spring 配置 |
| `spec-mono-components.md` | `src/styles/presets.ts` + `components-catalog.md` | 可复用的样式预设函数 |
| — (原版无) | `src/components/charts/shared.tsx` | 图表共享组件 (ChartAxis/ChartLabel/ChartDot) |

核心设计规则完整保留：
- **0 阴影** — 不用 box-shadow / drop-shadow，深度靠 hairline + 色阶
- **单 accent** — 一屏只出现一处 accent 色，它代表"此刻的焦点"
- **1px hairline** — 边框永远 1px，不用 2px 描边
- **字重悬崖** — 只用 400/600/700/800，跳过 500，制造对比
- **8-pt 栅格** — 间距跳过 32/48/56
- **数字 tabular-nums** — 所有数字等宽
- **0 渐变** — 唯一例外：面积图的 accent 42%→0% 填充

#### 3. 主题系统重构

原版主题是 `design.md` 文件（YAML 格式），HyperFrames 读取后渲染。本版改为 TypeScript 导出的 `DesignTokens` 对象：

```typescript
// 原版 design.md (YAML)
---
name: Spec Mono
colors:
  primary: "#000000"
  accent: "#FFFFFF"
typography:
  hero:
    fontFamily: Barlow Semi Condensed
    fontSize: 8rem
---

// 本版 theme.ts (TypeScript)
const theme: DesignTokens = {
  name: 'Spec Mono',
  colors: {
    background: '#000000',
    accent: '#FFFFFF',
    // ... 完整类型定义
  },
  typography: {
    condensedFont: '"Barlow Semi Condensed", ...',
    scale: { display: 96, h1: 56, ... },
    // ...
  },
}
```

好处：
- 编辑器自动补全 + 类型检查
- 可以用 `theme.colors.accent` 而不是 `var(--accent)`
- 支持条件逻辑：`theme.decoration.density === 'heavy' ? ... : ...`

预设主题从原版 8 个扩展到 9 个（新增 Spec Mono 作为默认主题）。

#### 4. 组件实现方式改变

原版 69 个组件用 HTML/CSS/GSAP 实现（`Full Code/sections/*.jsx`）。本版全部改用 React + TypeScript：

| 对比项 | 原版 | 本版 |
|---|---|---|
| 动画 | GSAP / CSS keyframes | `spring()` / `interpolate()` (帧级精确) |
| 状态管理 | React useState | Remotion `useCurrentFrame()` |
| 3D | Three.js (手动集成) | `@remotion/three` (原生支持) |
| 图表 | 自绘 SVG | `@remotion/plot` + 自定义 SVG |
| 流程图 | 自绘 SVG | `@xyflow/react` (React Flow) |
| 代码高亮 | 手动着色 | `prism-react-renderer` |
| 图标 | Lucide SVG | `lucide-react` (React 组件) |
| 类型安全 | ❌ | ✅ 全部 TypeScript |

每个组件都接受 `{ theme: DesignTokens }` 作为 prop，保证视觉一致性。

#### 5. 依赖生态升级

原版依赖 HyperFrames 内置的组件库。本版使用 npm 生态：

| 能力 | 库 |
|---|---|
| 渲染引擎 | `remotion` + `@remotion/cli` |
| 图表 | `@remotion/plot` + `recharts` |
| 流程图 | `@xyflow/react` |
| 3D | `@remotion/three` + `@react-three/fiber` |
| 动画 | `framer-motion` + remotion 内置 spring/interpolate |
| Lottie | `@remotion/lottie` |
| 代码高亮 | `prism-react-renderer` |
| 图标 | `lucide-react` |
| 字幕 | `@remotion/captions` |
| 音频分析 | `@remotion/media-utils` |
| 噪声/粒子 | `@remotion/noise` |
| Shader | `@remotion/shader` |
| 转场 | `@remotion/transitions` |

#### 6. 工作流优化

原版工作流：写 spec → 交给 HyperFrames → 等渲染 → 看效果 → 改 spec → 重新渲染

本版工作流：

```bash
# 1. AI 对话生成 spec（和原版一样）
# 2. 从 spec 自动生成组合代码
npm run generate
# 3. 浏览器实时预览（秒级响应）
npm run preview
# 4. 满意后渲染导出
npm run render
```

关键改进：
- **实时预览**：改代码后浏览器自动刷新，秒级看到效果
- **自动生成**：`npm run generate` 从 `video-spec.md` 解析分镜表，自动生成 `VideoFromSpec.tsx`
- **复合组件支持**：生成器能解析 "真实视频 + aroll.keyword-sticker" 这样的复合组件 ID

#### 7. 不需要搬的部分

原版中的以下内容是展示页（showcase）的代码，不是视频组件，本版不需要：

| 文件 | 说明 |
|---|---|
| `Full Code/sections/foundation.jsx` | 设计系统展示页（颜色/字号/间距的交互式 demo） |
| `Full Code/styles.css` 的页面布局 | `.shell` / `.hero` / `.section` / `.nav` / `.footer` |
| `Full Code/tweaks-panel.jsx` | 运行时参数调整面板（Remotion Studio 自带 Controls 替代） |

---

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 从 video-spec.md 生成组合代码
npm run generate

# 3. 在浏览器预览
npm run preview

# 4. 渲染导出
npm run render
```

## 完整工作流程

```
你说："我想做个视频"
        │
        ▼
┌────────────────────────────────┐
│  video-spec-builder-remotion   │  AI 追问 + 拆镜头，陪你想清楚
└────────────────────────────────┘
        │
        ▼
    video-spec.md                 分镜脚本（精确到秒）
        │
        ▼
    npm run generate              自动生成 VideoFromSpec.tsx
        │
        ▼
    npm run preview               浏览器实时预览
        │
        ▼
    npm run render                导出 mp4
```

## 它帮你解决什么

它解决的是"我有想法，但说不清楚"这个问题：

- 你知道想要什么感觉，但说不出具体画面。它会把"高大上""有冲击力"这种形容词挡回去，问到你能描述出实际的画面和动作为止。
- 你有想法，但有些环节根本没想到。比如开头结尾想好了，中间怎么过渡没想。这些它会主动提。
- 你东西不少，但理不出头绪。逐字稿、卖点、素材一大堆，它帮你拆成一个个镜头，排出先后和节奏。

## 项目结构

```
video-spec-remotion/
├── SKILL.md                        # AI skill 主文件（对话逻辑）
├── templates/video-spec-template.md
├── references/                     # 8 个参考文档
│   ├── components-catalog.md       # 69 个组件定义 + Remotion 实现映射
│   ├── question-bank.md            # 追问问题库
│   ├── workflow-0-1.md / workflow-iteration.md
│   ├── scene-breakdown.md / pacing-rules.md
│   ├── spec-rules.md / dialogue-style.md
├── examples/video-spec-spacex.md   # 完整示例
├── themes/                         # 9 个主题文件
│   ├── _template.ts                # DesignTokens 接口
│   ├── shadow-cut.ts / swiss-pulse.ts / velvet-standard.ts / ...
├── scripts/
│   └── generate-composition.ts     # spec → 组合代码生成器
├── src/
│   ├── styles/                     # 设计系统（7 个模块）
│   ├── components/                 # 69 个组件
│   └── compositions/
│       └── VideoFromSpec.tsx       # 自动生成
├── package.json
├── README.md                       # 英文
└── README.zh.md                    # 中文
```

## 设计系统

### 核心规则

| 规则 | 说明 |
|---|---|
| 0 阴影 | 不用 box-shadow / drop-shadow，深度靠 hairline + 色阶 |
| 单 accent | 一屏只出现一处 accent 色，它代表"此刻的焦点" |
| 1px hairline | 边框永远 1px，不用 2px 描边 |
| 字重悬崖 | 只用 400/600/700/800，跳过 500，制造对比 |
| 8-pt 栅格 | 间距跳过 32/48/56 |
| tabular-nums | 所有数字等宽 |
| 0 渐变 | 唯一例外：面积图的 accent 42%→0% 填充 |

### 模块结构

```
src/styles/
├── typography.ts     # heroStyle / statStyle / bodyStyle / labelStyle / ...
├── decorative.tsx    # CornerCross / TickRule / Idx / Eyebrow / Slash / TMinus / ...
├── presets.ts        # cardStyle / badgeStyle / flowNodeStyle / placeholderStyle / ...
├── animations.ts     # useEntrance / usePulse / useCountUp / useSlideIn
├── backgrounds.tsx   # SceneBackground (dot-grid / hairline-grid / scan-lines)
├── constants.ts      # SPRING / DISPLACEMENT / STAGGER 等统一配置
└── index.ts          # 统一导出
```

## 9 个预设主题

| 主题 | 气质 | accent | 适合 |
|---|---|---|---|
| Spec Mono (默认) | 纯黑·SpaceX 工程感 | 白 | 技术教程、产品演示、AI/开发者向 |
| Shadow Cut | 暗黑·电影感 | 红 | 安全产品、戏剧性揭示、严肃叙事 |
| Swiss Pulse | 精确·瑞士排版 | 蓝 | SaaS、数据、开发者工具、指标看板 |
| Velvet Standard | 高级·隽永 | 金 | 奢侈品、企业软件、主题演讲 |
| Data Drift | 未来·沉浸 | 蓝 | AI 产品、ML 平台、前沿科技 |
| Deconstructed | 工业·粗粝 | 橙 | 科技发布、安全产品、朋克内容 |
| Maximalist Type | 喧闹·动感 | 粉 | 大型发布、里程碑公告、高能 hype |
| Soft Signal | 亲密·温暖 | 橙 | 健康品牌、个人故事、生活方式 |
| Folk Frequency | 文化·鲜亮 | 橙 | 消费类 app、美食、社区产品 |

## 69 个组件

全部实现，对应 `components-catalog.md` 中的抽象定义：

- **aroll** (3): 字幕高亮 / 关键词贴纸 / 概念卡
- **broll-hero** (4): 大字海报 / 大数字 / 引用块 / 反白闪屏
- **broll-charts** (12): 折线 / 多线 / 柱形 / 横条 / 堆叠 / 面积 / 环形 / 散点 / 热力 / 仪表 / 迷你图 / Sankey
- **broll-abstract** (7): 类比 / 黑盒 / 等式 / 光谱 / 冰山 / 对照 / 占位
- **broll-flows** (8): 复杂流程 / 分支 / 决策树 / 状态机 / 时序图 / 泳道 / 并行 / 循环
- **broll-structure** (6): 流程图 / 金字塔 / 漏斗 / 同心圆 / 节点图 / 谱系
- **broll-structures2** (7): 树 / 思维导图 / 2×2 矩阵 / Venn / 分层堆栈 / Hub-Spoke / 网格
- **broll-thinking** (7): 对比表 / SWOT / 鱼骨图 / 时间线 / 甘特 / 看板 / 卡片网格
- **broll-ui** (6): 终端 / 对话流 / 浏览器 / 代码编辑器 / API 调用 / 仪表盘
- **icons** (2): Lucide 图标集 (48 个精选)
- **illustrations** (7): 6 个场景插画 + 场景库

## npm 脚本

| 命令 | 作用 |
|---|---|
| `npm run generate` | 从 video-spec.md 自动生成 VideoFromSpec.tsx |
| `npm run preview` | 打开 Remotion Studio 实时预览 |
| `npm run render` | 渲染导出 mp4 到 out/video.mp4 |
| `npm run render:gif` | 渲染导出 gif |
| `npm run build` | TypeScript 类型检查 |
| `npm run lint` | ESLint 检查 |

## 致谢

- 原项目：[feicaiclub/video-spec-builder](https://github.com/feicaiclub/video-spec-builder)
- 渲染引擎：[Remotion](https://www.remotion.dev/)
- 图标库：[Lucide](https://lucide.dev/)
- 流程图：[React Flow](https://reactflow.dev/)
- 设计语言：SpaceX 发射页 × xAI/Grok × X (Twitter)

## 许可证

MIT
