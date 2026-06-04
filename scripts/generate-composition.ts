#!/usr/bin/env npx tsx
/**
 * generate-composition.ts
 *
 * 读取 video-spec.md，解析分镜表，自动生成 src/compositions/VideoFromSpec.tsx
 *
 * 用法：
 *   npx tsx scripts/generate-composition.ts [video-spec.md 路径]
 *
 * 默认读取项目根目录的 video-spec.md
 */

import * as fs from 'fs'
import * as path from 'path'

// 组件 ID → React 组件名映射
const COMPONENT_MAP: Record<string, string> = {
  // A-roll
  'aroll.subtitle-highlight': 'SubtitleHighlight',
  'aroll.keyword-sticker': 'KeywordSticker',
  'aroll.concept-card': 'ConceptCard',

  // B-roll Hero
  'broll-hero.big-type': 'BigType',
  'broll-hero.big-number': 'BigNumber',
  'broll-hero.pull-quote': 'PullQuote',
  'broll-hero.inversion-flash': 'InversionFlash',

  // B-roll Charts
  'broll-charts.line-chart': 'LineChart',
  'broll-charts.multi-line': 'MultiLineChart',
  'broll-charts.bar-chart': 'BarChart',
  'broll-charts.h-bar': 'HBarChart',
  'broll-charts.stacked': 'StackedChart',
  'broll-charts.area-chart': 'AreaChart',
  'broll-charts.donut': 'DonutChart',
  'broll-charts.scatter': 'ScatterChart',
  'broll-charts.heatmap': 'HeatmapChart',
  'broll-charts.gauge': 'GaugeChart',
  'broll-charts.sparkline': 'SparklineCard',
  'broll-charts.sankey': 'SankeyChart',

  // B-roll Abstract
  'broll-abstract.analogy': 'Analogy',
  'broll-abstract.black-box': 'BlackBox',
  'broll-abstract.equation': 'Equation',
  'broll-abstract.spectrum': 'Spectrum',
  'broll-abstract.iceberg': 'Iceberg',
  'broll-abstract.versus': 'Versus',
  'broll-abstract.placeholder': 'Placeholder',

  // B-roll Flows
  'broll-flows.complex': 'ComplexFlow',
  'broll-flows.branching': 'BranchingFlow',
  'broll-flows.decision-tree': 'DecisionTree',
  'broll-flows.state-machine': 'StateMachine',
  'broll-flows.sequence': 'SequenceDiagram',
  'broll-flows.swimlane': 'SwimlaneDiagram',
  'broll-flows.fork-join': 'ForkJoinDiagram',
  'broll-flows.loop': 'LoopDiagram',

  // B-roll Structure
  'broll-structure.flow-chart': 'FlowChart',
  'broll-structure.pyramid': 'Pyramid',
  'broll-structure.funnel': 'Funnel',
  'broll-structure.concentric': 'ConcentricCircles',
  'broll-structure.node-graph': 'NodeGraph',
  'broll-structure.spectrum': 'SpectrumAxis',

  // B-roll Structures2
  'broll-structures2.tree': 'TreeDiagram',
  'broll-structures2.mind-map': 'MindMap',
  'broll-structures2.matrix-2x2': 'Matrix2x2',
  'broll-structures2.venn': 'VennDiagram',
  'broll-structures2.layered-stack': 'LayeredStack',
  'broll-structures2.hub-spoke': 'HubSpoke',
  'broll-structures2.grid-map': 'GridMap',

  // B-roll Thinking
  'broll-thinking.compare-table': 'CompareTable',
  'broll-thinking.swot': 'SwotGrid',
  'broll-thinking.fishbone': 'FishboneDiagram',
  'broll-thinking.timeline-row': 'Timeline',
  'broll-thinking.gantt': 'GanttChart',
  'broll-thinking.kanban': 'KanbanBoard',
  'broll-thinking.card-grid': 'CardGrid',

  // B-roll UI
  'broll-ui.terminal': 'Terminal',
  'broll-ui.chat-thread': 'ChatThread',
  'broll-ui.browser': 'BrowserMock',
  'broll-ui.code-editor': 'CodeEditor',
  'broll-ui.api-call': 'ApiCall',
  'broll-ui.dashboard': 'Dashboard',
}

interface Scene {
  id: string
  index: number
  startTime: number  // 秒
  endTime: number    // 秒
  role: string
  componentId: string
  componentName: string
  narration: string
  screenText: string
  description: string
  animation: string
  soundEffect: string
  transitionIn: string
  transitionOut: string
}

function parseTime(timeStr: string): number {
  // 解析 "0.0s" 或 "5.0s" 格式
  return parseFloat(timeStr.replace('s', ''))
}

function parseScenes(content: string): Scene[] {
  const scenes: Scene[] = []
  const sceneRegex = /### Scene (\d+) · ([\d.]+)s–([\d.]+)s · ([^\n]+)\n([\s\S]*?)(?=### Scene \d+ ·|$)/g

  let match
  while ((match = sceneRegex.exec(content)) !== null) {
    const index = parseInt(match[1])
    const startTime = parseFloat(match[2])
    const endTime = parseFloat(match[3])
    const role = match[4].trim()
    const body = match[5]

    // 解析组件 ID
    const componentMatch = body.match(/组件[：:]\s*(.+?)(?:\n|$)/)
    const componentId = componentMatch ? componentMatch[1].trim() : 'broll-abstract.placeholder'

    // 解析旁白文案
    const narrationMatch = body.match(/旁白文案[：:]\s*(.+?)(?:\n|$)/)
    const narration = narrationMatch ? narrationMatch[1].trim() : '无'

    // 解析屏显文案
    const screenMatch = body.match(/屏显文案[：:]\s*(.+?)(?:\n|$)/)
    const screenText = screenMatch ? screenMatch[1].trim() : '无'

    // 解析画面描述
    const descMatch = body.match(/画面描述[：:]\s*(.+?)(?:\n|$)/)
    const description = descMatch ? descMatch[1].trim() : ''

    // 解析动效要点
    const animMatch = body.match(/动效要点[：:]\s*(.+?)(?:\n|$)/)
    const animation = animMatch ? animMatch[1].trim() : ''

    // 解析音效描述
    const soundMatch = body.match(/音效描述[：:]\s*(.+?)(?:\n|$)/)
    const soundEffect = soundMatch ? soundMatch[1].trim() : '无'

    // 解析转场
    const transInMatch = body.match(/转场进入[：:]\s*(.+?)(?:\n|$)/)
    const transOutMatch = body.match(/转场离开[：:]\s*(.+?)(?:\n|$)/)

    // 从 componentId 中提取纯组件名
    // 处理复合 ID 如 "真实视频 full-screen + aroll.keyword-sticker"
    // 优先匹配已知的 component ID（含 namespace.component-id 格式）
    let primaryComponent = 'broll-abstract.placeholder'
    const knownIds = Object.keys(COMPONENT_MAP)
    // 先尝试精确匹配
    for (const id of knownIds) {
      if (componentId.includes(id)) {
        primaryComponent = id
        break
      }
    }
    // 如果没匹配到已知 ID，尝试按 + 分割取第一段
    if (primaryComponent === 'broll-abstract.placeholder') {
      const firstPart = componentId.split('+')[0].trim().split('（')[0].trim()
      if (COMPONENT_MAP[firstPart]) {
        primaryComponent = firstPart
      }
    }

    scenes.push({
      id: `scene-${String(index).padStart(2, '0')}`,
      index,
      startTime,
      endTime,
      role,
      componentId: primaryComponent,
      componentName: COMPONENT_MAP[primaryComponent] || 'Placeholder',
      narration,
      screenText,
      description,
      animation,
      soundEffect,
      transitionIn: transInMatch ? transInMatch[1].trim() : '硬切',
      transitionOut: transOutMatch ? transOutMatch[1].trim() : '硬切',
    })
  }

  return scenes
}

function parseBasicInfo(content: string): { title: string; fps: number; width: number; height: number } {
  const titleMatch = content.match(/标题[：:]\s*(.+?)(?:\n|$)/)
  const fpsMatch = content.match(/(\d+)\s*fps/)
  const ratioMatch = content.match(/(\d+):(\d+)/)

  let width = 1920
  let height = 1080
  if (ratioMatch) {
    const w = parseInt(ratioMatch[1])
    const h = parseInt(ratioMatch[2])
    if (w < h) {
      // 竖屏 9:16
      width = 1080
      height = 1920
    }
  }

  return {
    title: titleMatch ? titleMatch[1].trim() : 'Untitled Video',
    fps: fpsMatch ? parseInt(fpsMatch[1]) : 30,
    width,
    height,
  }
}

function generateComposition(scenes: Scene[], info: { title: string; fps: number; width: number; height: number }): string {
  const totalFrames = Math.ceil(scenes[scenes.length - 1].endTime * info.fps)

  // 收集用到的组件
  const usedComponents = new Set(scenes.map(s => s.componentName))

  // 生成 import
  const imports = `import React from 'react'
import { Composition, Sequence, Audio, staticFile } from 'remotion'
import {
  ${[...usedComponents].sort().join(',\n  ')},
} from '../components'
import type { DesignTokens } from '../../themes/_template'

// 主题 — 可替换为其他预设或自定义 theme.ts
import theme from '../../themes/shadow-cut'
`

  // 生成场景 props（从分镜表提取的关键信息）
  const sceneProps = scenes.map(scene => {
    const props: string[] = []

    // 通用 props
    props.push(`theme={theme}`)

    // 根据组件类型生成对应的 props
    switch (scene.componentName) {
      case 'BigType':
        // 从屏显文案提取标题
        if (scene.screenText && scene.screenText !== '无') {
          const title = scene.screenText.replace(/hero 大字\s*/, '').replace(/"/g, '\\"')
          props.push(`title="${title}"`)
        }
        props.push(`entrance="slam"`)
        break

      case 'SubtitleHighlight':
        if (scene.narration && scene.narration !== '无') {
          props.push(`text="${scene.narration.replace(/"/g, '\\"')}"`)
        }
        props.push(`mode="karaoke"`)
        break

      case 'PullQuote':
        // 从屏显文案提取引用
        if (scene.screenText && scene.screenText !== '无') {
          const quoteMatch = scene.screenText.match(/[""](.+?)[""]/)
          if (quoteMatch) {
            props.push(`quote="${quoteMatch[1].replace(/"/g, '\\"')}"`)
          }
        }
        break

      case 'BarChart':
        // 数据需要从 spec 中提取，这里用占位
        props.push(`data={[{ label: '示例', value: 100 }]}`)
        props.push(`title="${scene.role}"`)
        break

      case 'Analogy':
        props.push(`unfamiliar="概念A"`)
        props.push(`familiar="概念B"`)
        break

      case 'Versus':
        props.push(`leftTitle="方案A"`)
        props.push(`rightTitle="方案B"`)
        break

      case 'Placeholder':
        props.push(`label="${scene.role}"`)
        break

      default:
        // 其他组件用通用 props
        break
    }

    return props.join('\n              ')
  })

  // 生成 Sequence 块
  const sequences = scenes.map((scene, i) => {
    const fromFrame = Math.round(scene.startTime * info.fps)
    const durationFrames = Math.round((scene.endTime - scene.startTime) * info.fps)

    return `        {/* Scene ${String(scene.index).padStart(2, '0')} · ${scene.startTime}s–${scene.endTime}s · ${scene.role} */}
        <Sequence
          from={${fromFrame}}
          durationInFrames={${durationFrames}}
          name="${scene.id}"
        >
          <${scene.componentName}
              ${sceneProps[i]}
          />
        </Sequence>`
  }).join('\n\n')

  return `${imports}

/**
 * ${info.title}
 *
 * 由 video-spec.md 自动生成 — ${new Date().toISOString().split('T')[0]}
 * 总时长: ${scenes[scenes.length - 1].endTime}s · ${totalFrames} 帧 @ ${info.fps}fps
 * 场景数: ${scenes.length}
 *
 * ⚠️ 此文件由 scripts/generate-composition.ts 自动生成
 * 如需修改，请编辑 video-spec.md 后重新生成：
 *   npx tsx scripts/generate-composition.ts
 */

const FPS = ${info.fps}
const WIDTH = ${info.width}
const HEIGHT = ${info.height}
const TOTAL_FRAMES = ${totalFrames}

const VideoFromSpec: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.background,
    }}>
${sequences}
    </div>
  )
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoFromSpec"
        component={VideoFromSpec}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  )
}
`
}

// 主流程
function main() {
  const specPath = process.argv[2] || path.join(process.cwd(), 'video-spec.md')

  if (!fs.existsSync(specPath)) {
    console.error(`❌ 找不到 video-spec.md: ${specPath}`)
    console.error('用法: npx tsx scripts/generate-composition.ts [video-spec.md 路径]')
    process.exit(1)
  }

  const content = fs.readFileSync(specPath, 'utf-8')
  const scenes = parseScenes(content)

  if (scenes.length === 0) {
    console.error('❌ 未在 video-spec.md 中找到分镜表（Scene 01 · ...）')
    process.exit(1)
  }

  const info = parseBasicInfo(content)
  const composition = generateComposition(scenes, info)

  const outPath = path.join(process.cwd(), 'src', 'compositions', 'VideoFromSpec.tsx')
  fs.writeFileSync(outPath, composition, 'utf-8')

  console.log(`✅ 已生成 ${outPath}`)
  console.log(`   标题: ${info.title}`)
  console.log(`   场景: ${scenes.length} 个`)
  console.log(`   时长: ${scenes[scenes.length - 1].endTime}s @ ${info.fps}fps`)
  console.log(`   规格: ${info.width}×${info.height}`)
  console.log('')
  console.log('用到的组件:')
  const componentCounts = new Map<string, number>()
  scenes.forEach(s => componentCounts.set(s.componentName, (componentCounts.get(s.componentName) || 0) + 1))
  for (const [name, count] of [...componentCounts].sort()) {
    console.log(`   ${name} × ${count}`)
  }
  console.log('')
  console.log('下一步:')
  console.log('   npm run preview   # 预览')
  console.log('   npm run render    # 渲染')
}

main()
