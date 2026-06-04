import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface DataPoint {
  label: string
  value: number
}

interface LineSeries {
  label: string
  data: DataPoint[]
}

export interface MultiLineChartProps {
  series: LineSeries[]  // Max 3 lines
  title?: string
  unit?: string
  theme: DesignTokens
}

/**
 * broll-charts.multi-line — 多折线图
 *
 * 主线 accent 3px，次线 70% 白 2px，第三线 35% 白 2px。最多 3 条线。
 */
export const MultiLineChart: React.FC<MultiLineChartProps> = ({ series, title, unit, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const clampedSeries = series.slice(0, 3)
  if (clampedSeries.length === 0) return null

  // Line styles per index
  const lineStyles = [
    { color: theme.colors.accent, width: 3, opacity: 1 },
    { color: 'rgba(255,255,255,0.70)', width: 2, opacity: 0.7 },
    { color: 'rgba(255,255,255,0.35)', width: 2, opacity: 0.35 },
  ]

  // Find global min/max
  const allValues = clampedSeries.flatMap(s => s.data.map(d => d.value))
  const maxValue = Math.max(...allValues)
  const minValue = Math.min(...allValues)
  const range = maxValue - minValue || 1

  const maxLen = Math.max(...clampedSeries.map(s => s.data.length))

  // Chart dimensions
  const padding = { top: 40, right: 20, bottom: 40, left: 20 }
  const width = 800
  const height = 400
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const getPoints = (data: DataPoint[]) =>
    data.map((d, i) => ({
      x: padding.left + (i / (data.length - 1)) * chartWidth,
      y: padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight,
      ...d,
    }))

  const getPath = (points: ReturnType<typeof getPoints>) =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  const lineProgress = spring({ frame, fps, config: { damping: 15, stiffness: 100 } })

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

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: theme.spacing.s3,
        marginBottom: theme.spacing.s2,
        opacity: interpolate(frame, [5, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        {clampedSeries.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.s1 }}>
            <div style={{
              width: 16,
              height: lineStyles[i].width,
              backgroundColor: lineStyles[i].color,
              borderRadius: 1,
            }} />
            <span style={{
              fontFamily: theme.typography.monoFont,
              fontSize: theme.typography.scale.small,
              color: theme.colors.foregroundMuted,
            }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

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

        {/* Lines */}
        {clampedSeries.map((s, i) => {
          const points = getPoints(s.data)
          const path = getPath(points)
          const style = lineStyles[i]
          const delay = i * 10
          const progress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 100 },
          })

          return (
            <path
              key={i}
              d={path}
              fill="none"
              stroke={style.color}
              strokeWidth={style.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${progress * 2000}`}
              strokeDashoffset={`${(1 - progress) * 2000}`}
            />
          )
        })}

        {/* X-axis labels (from first series) */}
        {getPoints(clampedSeries[0].data).map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 10}
            textAnchor="middle"
            fontFamily={theme.typography.monoFont}
            fontSize={theme.typography.scale.small}
            fill={theme.colors.foregroundMuted}
            fontVariantNumeric="tabular-nums"
            opacity={interpolate(frame, [10 + i * 2, 18 + i * 2], [0, 1], { extrapolateRight: 'clamp' })}
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  )
}
