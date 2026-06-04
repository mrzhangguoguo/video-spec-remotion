import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface HeatmapCell {
  value: number
}

export interface HeatmapChartProps {
  rows: string[]
  cols: string[]
  data: HeatmapCell[][]  // data[row][col]
  title?: string
  theme: DesignTokens
}

/**
 * broll-charts.heatmap — 热力图
 *
 * 阶梯填充：<70 灰度，>=70 accent 色。间距 4px，行列标签 mono caps 14px。
 */
export const HeatmapChart: React.FC<HeatmapChartProps> = ({ rows, cols, data, title, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  if (rows.length === 0 || cols.length === 0) return null

  const cellSize = 60
  const gap = 4
  const labelWidth = 100
  const labelHeight = 40

  const width = labelWidth + cols.length * (cellSize + gap)
  const height = labelHeight + rows.length * (cellSize + gap)

  // Find min/max for color scaling
  const allValues = data.flat().map(c => c.value)
  const maxVal = Math.max(...allValues)
  const minVal = Math.min(...allValues)
  const range = maxVal - minVal || 1

  const getColor = (value: number): string => {
    const normalized = (value - minVal) / range
    const threshold = 70 // 0-100 scale, 70 is the cutoff
    const normalized100 = value

    if (normalized100 >= threshold) {
      return theme.colors.accent
    }
    // Grayscale below threshold
    const gray = Math.round(interpolate(normalized100, [0, threshold], [20, 70]))
    return `rgb(${gray}, ${gray}, ${gray})`
  }

  const cellsProgress = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 15, stiffness: 100 } })

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
        {/* Column labels */}
        {cols.map((col, c) => (
          <text
            key={c}
            x={labelWidth + c * (cellSize + gap) + cellSize / 2}
            y={labelHeight - 10}
            textAnchor="middle"
            fontFamily={theme.typography.monoFont}
            fontSize={14}
            fontWeight={theme.typography.weight.mid}
            fill={theme.colors.foregroundMuted}
            letterSpacing={theme.typography.letterSpacing.caps}
            textTransform="uppercase"
          >
            {col}
          </text>
        ))}

        {/* Row labels */}
        {rows.map((row, r) => (
          <text
            key={r}
            x={labelWidth - 10}
            y={labelHeight + r * (cellSize + gap) + cellSize / 2 + 5}
            textAnchor="end"
            fontFamily={theme.typography.monoFont}
            fontSize={14}
            fontWeight={theme.typography.weight.mid}
            fill={theme.colors.foregroundMuted}
            letterSpacing={theme.typography.letterSpacing.caps}
            textTransform="uppercase"
          >
            {row}
          </text>
        ))}

        {/* Cells */}
        {data.map((row, r) =>
          row.map((cell, c) => {
            const delay = 5 + (r * cols.length + c) * 2
            const cellOpacity = interpolate(
              frame,
              [delay, delay + 10],
              [0, cellsProgress],
              { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' },
            )

            return (
              <rect
                key={`${r}-${c}`}
                x={labelWidth + c * (cellSize + gap)}
                y={labelHeight + r * (cellSize + gap)}
                width={cellSize}
                height={cellSize}
                fill={getColor(cell.value)}
                rx={theme.borderRadius.sm}
                opacity={cellOpacity}
              />
            )
          }),
        )}
      </svg>
    </div>
  )
}
