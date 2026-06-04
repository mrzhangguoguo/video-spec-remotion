import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface DataPoint {
  label: string
  value: number
}

export interface AreaChartProps {
  data: DataPoint[]
  title?: string
  unit?: string
  theme: DesignTokens
}

/**
 * broll-charts.area-chart — 面积图
 *
 * 填充 accent 42%→0% 渐变（系统中唯一允许的渐变），顶部线 3px accent。
 */
export const AreaChart: React.FC<AreaChartProps> = ({ data, title, unit, theme }) => {
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

  // Area path (close to bottom)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`

  // Animation
  const progress = spring({ frame, fps, config: { damping: 15, stiffness: 100 } })

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
        <defs>
          {/* The only allowed gradient in the system: accent 42% -> 0% */}
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={theme.colors.accent} stopOpacity={0.42} />
            <stop offset="100%" stopColor={theme.colors.accent} stopOpacity={0} />
          </linearGradient>
        </defs>

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

        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#areaGradient)"
          opacity={progress}
        />

        {/* Top line */}
        <path
          d={linePath}
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${progress * 2000}`}
          strokeDashoffset={`${(1 - progress) * 2000}`}
        />

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

        {/* Endpoint value */}
        <text
          x={points[points.length - 1].x + 12}
          y={points[points.length - 1].y + 4}
          fontFamily={theme.typography.monoFont}
          fontSize={theme.typography.scale.body}
          fontWeight={theme.typography.weight.bold}
          fill={theme.colors.accent}
          fontVariantNumeric="tabular-nums"
          opacity={interpolate(frame, [25, 35], [0, 1], { extrapolateRight: 'clamp' })}
        >
          {data[data.length - 1].value}{unit}
        </text>
      </svg>
    </div>
  )
}
