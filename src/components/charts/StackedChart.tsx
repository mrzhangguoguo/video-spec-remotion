import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface StackSegment {
  label: string
  value: number
}

export interface StackedChartProps {
  data: { label: string; segments: StackSegment[] }[]
  title?: string
  unit?: string
  theme: DesignTokens
}

/**
 * broll-charts.stacked — 堆叠柱形图
 *
 * 主项 accent 底部锚定，次项 55% 白，第三项 22% 白，顶部显示累计值。
 */
export const StackedChart: React.FC<StackedChartProps> = ({ data, title, unit, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  if (data.length === 0) return null

  // Segment colors: main=accent, secondary=55% white, tertiary=22% white
  const segmentColors = [
    theme.colors.accent,
    'rgba(255,255,255,0.55)',
    'rgba(255,255,255,0.22)',
  ]

  // Find max cumulative value
  const maxCumulative = Math.max(
    ...data.map(d => d.segments.reduce((sum, s) => sum + s.value, 0)),
  )

  const barWidth = 60
  const barGap = 30

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

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: theme.spacing.s3,
        marginBottom: theme.spacing.s3,
        opacity: interpolate(frame, [5, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        {data[0].segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.s1 }}>
            <div style={{
              width: 12,
              height: 12,
              backgroundColor: segmentColors[i],
              borderRadius: theme.borderRadius.sm,
            }} />
            <span style={{
              fontFamily: theme.typography.monoFont,
              fontSize: theme.typography.scale.small,
              color: theme.colors.foregroundMuted,
            }}>
              {seg.label}
            </span>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: barGap,
        height: '60%',
      }}>
        {data.map((item, i) => {
          const delay = i * 8
          const barProgress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          const cumulative = item.segments.reduce((sum, s) => sum + s.value, 0)
          const totalHeight = (cumulative / maxCumulative) * 100 * barProgress

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
              }}
            >
              {/* Cumulative value at top */}
              <div style={{
                fontFamily: theme.typography.monoFont,
                fontSize: theme.typography.scale.body,
                fontWeight: theme.typography.weight.bold,
                color: theme.colors.foreground,
                fontVariantNumeric: 'tabular-nums',
                marginBottom: theme.spacing.s1,
                opacity: interpolate(frame, [delay + 10, delay + 20], [0, 1], { extrapolateRight: 'clamp' }),
              }}>
                {Math.round(cumulative * barProgress)}{unit}
              </div>

              {/* Stacked segments (bottom-anchored) */}
              <div style={{
                display: 'flex',
                flexDirection: 'column-reverse',
                width: barWidth,
                height: `${totalHeight}%`,
                minHeight: 4,
              }}>
                {item.segments.map((seg, j) => {
                  const segHeight = (seg.value / cumulative) * 100
                  return (
                    <div
                      key={j}
                      style={{
                        width: '100%',
                        height: `${segHeight}%`,
                        backgroundColor: segmentColors[j],
                        borderRadius: j === item.segments.length - 1
                          ? `${theme.borderRadius.sm}px ${theme.borderRadius.sm}px 0 0`
                          : 0,
                      }}
                    />
                  )
                })}
              </div>

              {/* Label */}
              <div style={{
                fontFamily: theme.typography.monoFont,
                fontSize: theme.typography.scale.small,
                color: theme.colors.foregroundMuted,
                marginTop: theme.spacing.s1,
                textAlign: 'center',
              }}>
                {item.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
