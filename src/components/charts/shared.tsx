/**
 * 图表共享组件
 *
 * 所有 broll-charts 组件共用的基础元素：
 * - ChartAxis: 轴线 (1px rgba(255,255,255,.06))
 * - ChartLabel: 轴标签 (mono + caps)
 * - ChartValue: 数值标签 (mono + tabular-nums)
 * - ChartDot: 数据点 (端点 8px / 普通 4px)
 * - ChartGrid: 背景网格线
 */
import React from 'react'
import type { DesignTokens } from '../../../themes/_template'

/** 轴线 — 对应原版 spec-mono-components.md: 轴线 1px rgba(255,255,255,.06) hairline */
export const ChartAxis: React.FC<{
  theme: DesignTokens
  x1: number | string
  y1: number | string
  x2: number | string
  y2: number | string
}> = ({ theme, x1, y1, x2, y2 }) => (
  <line
    x1={x1} y1={y1} x2={x2} y2={y2}
    stroke="rgba(255,255,255,0.06)"
    strokeWidth={1}
  />
)

/** 轴标签 — mono caps fg 42% */
export const ChartLabel: React.FC<{
  theme: DesignTokens
  x: number | string
  y: number | string
  text: string
  anchor?: 'start' | 'middle' | 'end'
  dominantBaseline?: string
}> = ({ theme, x, y, text, anchor = 'middle', dominantBaseline = 'hanging' }) => (
  <text
    x={x} y={y}
    textAnchor={anchor}
    dominantBaseline={dominantBaseline}
    style={{
      fontFamily: theme.typography.monoFont,
      fontSize: theme.typography.scale.small,
      fill: theme.colors.foregroundMuted,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: theme.typography.letterSpacing.caps,
      textTransform: 'uppercase',
    }}
  >
    {text}
  </text>
)

/** 数值标签 — mono bold tabular-nums */
export const ChartValue: React.FC<{
  theme: DesignTokens
  x: number | string
  y: number | string
  value: string | number
  color?: string
  anchor?: 'start' | 'middle' | 'end'
  dominantBaseline?: string
}> = ({ theme, x, y, value, color, anchor = 'middle', dominantBaseline = 'auto' }) => (
  <text
    x={x} y={y}
    textAnchor={anchor}
    dominantBaseline={dominantBaseline}
    style={{
      fontFamily: theme.typography.monoFont,
      fontWeight: theme.typography.weight.bold,
      fontVariantNumeric: 'tabular-nums',
      fill: color || theme.colors.foreground,
    }}
  >
    {value}
  </text>
)

/** 数据点 — 端点 8px / 普通 4px */
export const ChartDot: React.FC<{
  theme: DesignTokens
  cx: number
  cy: number
  r?: number
  color?: string
  isEndpoint?: boolean
}> = ({ theme, cx, cy, r, color, isEndpoint }) => (
  <circle
    cx={cx} cy={cy}
    r={r || (isEndpoint ? 8 : 4)}
    fill={color || theme.colors.accent}
  />
)

/** 背景网格线 — 水平虚线 */
export const ChartGrid: React.FC<{
  theme: DesignTokens
  width: number | string
  height: number
  lines?: number
}> = ({ theme, width, height, lines = 5 }) => (
  <>
    {Array.from({ length: lines }, (_, i) => {
      const y = (height / (lines + 1)) * (i + 1)
      return (
        <line
          key={i}
          x1={0} y1={y} x2={width} y2={y}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
      )
    })}
  </>
)

/** 面积图渐变定义 — 对应原版: accent 42% → 0% (唯一允许的渐变) */
export const AreaGradient: React.FC<{
  id: string
  accentColor: string
}> = ({ id, accentColor }) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={accentColor} stopOpacity={0.42} />
      <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
    </linearGradient>
  </defs>
)

/** 图表容器 — 统一的 SVG 外壳 */
export const ChartContainer: React.FC<{
  width: number
  height: number
  children: React.ReactNode
  padding?: { top?: number; right?: number; bottom?: number; left?: number }
}> = ({ width, height, children, padding = {} }) => {
  const { top = 20, right = 20, bottom = 40, left = 60 } = padding
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${left}, ${top})`}>
        {children}
      </g>
    </svg>
  )
}
