import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

export interface SparklineCardProps {
  label: string
  value: number
  unit?: string
  delta?: number  // positive = up, negative = down
  deltaLabel?: string
  trend: number[]  // mini sparkline data
  theme: DesignTokens
}

/**
 * broll-charts.sparkline — 迷你趋势卡片
 *
 * 卡片 1px hairline，padding 22px，radius 6px，主数字 mono 30/800 + 14px delta，
 * 迷你折线 2.5px 颜色映射趋势。
 */
export const SparklineCard: React.FC<SparklineCardProps> = ({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  trend,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  if (trend.length === 0) return null

  const minVal = Math.min(...trend)
  const maxVal = Math.max(...trend)
  const range = maxVal - minVal || 1

  // Sparkline dimensions
  const sparkWidth = 120
  const sparkHeight = 40
  const padding = 4

  const points = trend.map((v, i) => ({
    x: padding + (i / (trend.length - 1)) * (sparkWidth - padding * 2),
    y: padding + (1 - (v - minVal) / range) * (sparkHeight - padding * 2),
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  // Determine trend color: up=green, down=red, flat=accent
  const trendColor = delta !== undefined
    ? delta > 0
      ? theme.colors.green
      : delta < 0
        ? theme.colors.red
        : theme.colors.accent
    : theme.colors.accent

  // Animations
  const cardProgress = spring({ frame, fps, config: { damping: 15, stiffness: 120 } })
  const lineProgress = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 15, stiffness: 100 } })
  const numberProgress = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <div style={{
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.line}`,
      borderRadius: 6,
      padding: 22,
      opacity: cardProgress,
      transform: `scale(${interpolate(cardProgress, [0, 1], [0.95, 1])})`,
    }}>
      {/* Label */}
      <div style={{
        fontFamily: theme.typography.monoFont,
        fontSize: theme.typography.scale.cap,
        fontWeight: theme.typography.weight.mid,
        letterSpacing: theme.typography.letterSpacing.caps,
        textTransform: 'uppercase',
        color: theme.colors.foregroundMuted,
        marginBottom: theme.spacing.s1,
      }}>
        {label}
      </div>

      {/* Main number + delta row */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: theme.spacing.s2 }}>
        <div style={{
          fontFamily: theme.typography.monoFont,
          fontSize: 30,
          fontWeight: theme.typography.weight.heavy,
          color: theme.colors.foreground,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
        }}>
          {Math.round(value * numberProgress)}{unit}
        </div>

        {delta !== undefined && (
          <div style={{
            fontFamily: theme.typography.monoFont,
            fontSize: 14,
            fontWeight: theme.typography.weight.mid,
            color: trendColor,
            fontVariantNumeric: 'tabular-nums',
            opacity: interpolate(frame, [20, 30], [0, 1], { extrapolateRight: 'clamp' }),
          }}>
            {delta > 0 ? '+' : ''}{delta}{deltaLabel || ''}
          </div>
        )}
      </div>

      {/* Sparkline */}
      <svg
        width={sparkWidth}
        height={sparkHeight}
        style={{ marginTop: theme.spacing.s1, overflow: 'visible' }}
      >
        <path
          d={linePath}
          fill="none"
          stroke={trendColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${lineProgress * 500}`}
          strokeDashoffset={`${(1 - lineProgress) * 500}`}
        />
      </svg>
    </div>
  )
}
