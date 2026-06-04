/**
 * broll-charts — 图表组件集合
 *
 * 11 种图表组件，遵循设计系统的 spec-mono 规范：
 * - 轴线: 1px rgba(255,255,255,.06) hairline
 * - 数字: mono + tabular-nums
 * - 无阴影，无渐变（面积图除外）
 * - 使用 spring() 入场动画
 * - 使用 interpolate() 数据驱动值
 */

export { BarChart } from './BarChart'

export { LineChart } from './LineChart'
export type { LineChartProps } from './LineChart'

export { MultiLineChart } from './MultiLineChart'
export type { MultiLineChartProps } from './MultiLineChart'

export { HBarChart } from './HBarChart'
export type { HBarChartProps } from './HBarChart'

export { StackedChart } from './StackedChart'
export type { StackedChartProps } from './StackedChart'

export { AreaChart } from './AreaChart'
export type { AreaChartProps } from './AreaChart'

export { DonutChart } from './DonutChart'
export type { DonutChartProps } from './DonutChart'

export { ScatterChart } from './ScatterChart'
export type { ScatterChartProps } from './ScatterChart'

export { HeatmapChart } from './HeatmapChart'
export type { HeatmapChartProps } from './HeatmapChart'

export { GaugeChart } from './GaugeChart'
export type { GaugeChartProps } from './GaugeChart'

export { SparklineCard } from './SparklineCard'
export type { SparklineCardProps } from './SparklineCard'

export { SankeyChart } from './SankeyChart'
export type { SankeyChartProps } from './SankeyChart'
