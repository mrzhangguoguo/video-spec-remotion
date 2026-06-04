import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface DataPoint {
  label: string
  value: number
}

export interface LineChartProps {
  data: DataPoint[]
  title?: string
  unit?: string
  theme: DesignTokens
}

/**
 * broll-charts.line-chart — 折线图
 *
 * 单条趋势线，3px accent 线宽，圆角连接，端点 8px，普通点 4px，末端显示数值。
 */
export const LineChart: React.FC<LineChartProps> = ({ data, title, unit, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  if (data.length === 0) return null

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1

  // Chart dimensions
  const padding = { top: 40, right: 60, bottom: 40, left: 20 }
  const width = 800
  const height = 400
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Calculate points
  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight,
    ...d,
  }))

  // Line path
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  // Animation
  const lineProgress = spring({ frame, fps, config: { damping: 15, stiffness: 100 } })
  const pointsProgress = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 12, stiffness: 120 } })

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
      {/* Title */}
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

      {/* Chart */}
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={padding.top + chartHeight * (1 - ratio)}
            x2={width - padding.right}
            y2={padding.top + chartHeight * (1 - ratio)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${lineProgress * 2000}`}
          strokeDashoffset={`${(1 - lineProgress) * 2000}`}
        />

        {/* Points */}
        {points.map((p, i) => {
          const isEndpoint = i === points.length - 1
          const pointSize = isEndpoint ? 8 : 4
          const pointDelay = 15 + i * 3
          const pointScale = spring({
            frame: Math.max(0, frame - pointDelay),
            fps,
            config: { damping: 10, stiffness: 150 },
          })

          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={pointSize * pointScale}
                fill={theme.colors.accent}
              />
              {/* Value at endpoint */}
              {isEndpoint && (
                <text
                  x={p.x + 12}
                  y={p.y + 4}
                  fontFamily={theme.typography.monoFont}
                  fontSize={theme.typography.scale.body}
                  fontWeight={theme.typography.weight.bold}
                  fill={theme.colors.accent}
                  fontVariantNumeric="tabular-nums"
                  opacity={interpolate(frame, [pointDelay, pointDelay + 10], [0, 1], { extrapolateRight: 'clamp' })}
                >
                  {p.value}{unit}
                </text>
              )}
            </g>
          )
        })}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 10}
            textAnchor="middle"
            fontFamily={theme.typography.monoFont}
            fontSize={theme.typography.scale.small}
            fill={theme.colors.foregroundMuted}
            fontVariantNumeric="tabular-nums"
            opacity={interpolate(frame, [10 + i * 3, 20 + i * 3], [0, 1], { extrapolateRight: 'clamp' })}
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  )
}
