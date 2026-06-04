import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface ScatterPoint {
  label: string
  x: number
  y: number
  size: number  // 3rd dimension - maps to dot size
  highlighted?: boolean
}

export interface ScatterChartProps {
  data: ScatterPoint[]
  title?: string
  xLabel?: string
  yLabel?: string
  theme: DesignTokens
}

/**
 * broll-charts.scatter — 散点图
 *
 * 双轴 LOW/HIGH 标注，点大小映射第三维度，主点 accent 色，其余 14% 白填充。
 */
export const ScatterChart: React.FC<ScatterChartProps> = ({ data, title, xLabel, yLabel, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  if (data.length === 0) return null

  const maxX = Math.max(...data.map(d => d.x))
  const minX = Math.min(...data.map(d => d.x))
  const rangeX = maxX - minX || 1

  const maxY = Math.max(...data.map(d => d.y))
  const minY = Math.min(...data.map(d => d.y))
  const rangeY = maxY - minY || 1

  const maxSize = Math.max(...data.map(d => d.size))
  const minSize = Math.min(...data.map(d => d.size))
  const sizeRange = maxSize - minSize || 1

  // Chart dimensions
  const padding = { top: 40, right: 40, bottom: 50, left: 60 }
  const width = 800
  const height = 500
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Map data to coordinates
  const points = data.map(d => ({
    ...d,
    cx: padding.left + ((d.x - minX) / rangeX) * chartWidth,
    cy: padding.top + chartHeight - ((d.y - minY) / rangeY) * chartHeight,
    r: interpolate((d.size - minSize) / sizeRange, [0, 1], [6, 24]),
  }))

  const dotsProgress = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 12, stiffness: 120 } })

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing.s5,
      backgroundColor: theme.colors.background,
    }}>
      {title && (
        <h3 style={{
          fontFamily: theme.typography.sansFont,
          fontWeight: theme.typography.weight.bold,
          fontSize: theme.typography.scale.h3,
          color: theme.colors.foreground,
          marginBottom: theme.spacing.s3,
          opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          {title}
        </h3>
      )}

      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <React.Fragment key={i}>
            <line
              x1={padding.left}
              y1={padding.top + chartHeight * (1 - ratio)}
              x2={width - padding.right}
              y2={padding.top + chartHeight * (1 - ratio)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <line
              x1={padding.left + chartWidth * ratio}
              y1={padding.top}
              x2={padding.left + chartWidth * ratio}
              y2={padding.top + chartHeight}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          </React.Fragment>
        ))}

        {/* Axis labels - LOW/HIGH annotations */}
        <text
          x={padding.left}
          y={height - 15}
          fontFamily={theme.typography.monoFont}
          fontSize={theme.typography.scale.cap}
          fill={theme.colors.foregroundMuted}
          letterSpacing={theme.typography.letterSpacing.caps}
          textTransform="uppercase"
        >
          LOW {xLabel}
        </text>
        <text
          x={width - padding.right}
          y={height - 15}
          textAnchor="end"
          fontFamily={theme.typography.monoFont}
          fontSize={theme.typography.scale.cap}
          fill={theme.colors.foregroundMuted}
          letterSpacing={theme.typography.letterSpacing.caps}
          textTransform="uppercase"
        >
          HIGH {xLabel}
        </text>
        <text
          x={padding.left - 10}
          y={padding.top + chartHeight}
          textAnchor="end"
          fontFamily={theme.typography.monoFont}
          fontSize={theme.typography.scale.cap}
          fill={theme.colors.foregroundMuted}
          letterSpacing={theme.typography.letterSpacing.caps}
          textTransform="uppercase"
        >
          LOW {yLabel}
        </text>
        <text
          x={padding.left - 10}
          y={padding.top + 5}
          textAnchor="end"
          fontFamily={theme.typography.monoFont}
          fontSize={theme.typography.scale.cap}
          fill={theme.colors.foregroundMuted}
          letterSpacing={theme.typography.letterSpacing.caps}
          textTransform="uppercase"
        >
          HIGH {yLabel}
        </text>

        {/* Scatter dots */}
        {points.map((p, i) => {
          const delay = 10 + i * 3
          const dotScale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 10, stiffness: 150 },
          })

          return (
            <circle
              key={i}
              cx={p.cx}
              cy={p.cy}
              r={p.r * dotScale}
              fill={p.highlighted ? theme.colors.accent : 'rgba(255,255,255,0.14)'}
              stroke={p.highlighted ? theme.colors.accent : 'none'}
              strokeWidth={p.highlighted ? 2 : 0}
            />
          )
        })}
      </svg>
    </div>
  )
}
