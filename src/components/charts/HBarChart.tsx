import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface HBarData {
  label: string
  value: number
}

export interface HBarChartProps {
  data: HBarData[]
  title?: string
  unit?: string
  theme: DesignTokens
}

/**
 * broll-charts.h-bar — 水平条形图
 *
 * 标签/条/数值三列布局，降序排列，#1 accent 色，条高 18px，5% 白背景条。
 */
export const HBarChart: React.FC<HBarChartProps> = ({ data, title, unit, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Sort descending
  const sorted = [...data].sort((a, b) => b.value - a.value)
  const maxValue = sorted[0]?.value || 1

  const barHeight = 18
  const barGap = 14

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
          marginBottom: theme.spacing.s4,
          opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          {title}
        </h3>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: barGap }}>
        {sorted.map((bar, i) => {
          const delay = i * 6
          const barProgress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          const percentage = (bar.value / maxValue) * 100
          const isTop = i === 0

          return (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 80px',
                alignItems: 'center',
                gap: theme.spacing.s2,
                opacity: interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: 'clamp' }),
              }}
            >
              {/* Label */}
              <div style={{
                fontFamily: theme.typography.monoFont,
                fontSize: theme.typography.scale.body,
                color: isTop ? theme.colors.foreground : theme.colors.foregroundSecondary,
                textAlign: 'right',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {bar.label}
              </div>

              {/* Bar container */}
              <div style={{
                position: 'relative',
                height: barHeight,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: theme.borderRadius.sm,
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${percentage * barProgress}%`,
                  backgroundColor: isTop ? theme.colors.accent : theme.colors.foregroundSecondary,
                  borderRadius: theme.borderRadius.sm,
                }} />
              </div>

              {/* Value */}
              <div style={{
                fontFamily: theme.typography.monoFont,
                fontSize: theme.typography.scale.body,
                fontWeight: theme.typography.weight.bold,
                color: isTop ? theme.colors.accent : theme.colors.foreground,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {Math.round(bar.value * barProgress)}{unit}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
