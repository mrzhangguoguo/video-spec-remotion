import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface DonutSegment {
  label: string
  value: number
}

export interface DonutChartProps {
  data: DonutSegment[]  // Max 4 segments
  title?: string
  unit?: string
  theme: DesignTokens
}

/**
 * broll-charts.donut — 环形图
 *
 * 环宽 36px，半径 140，中心数字 mono 800 56px accent，右侧图例 3 列。最多 4 段。
 */
export const DonutChart: React.FC<DonutChartProps> = ({ data, title, unit, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const clampedData = data.slice(0, 4)
  if (clampedData.length === 0) return null

  const total = clampedData.reduce((sum, d) => sum + d.value, 0)
  const strokeWidth = 36
  const radius = 140
  const circumference = 2 * Math.PI * radius

  // Segment colors: accent for first, then varying whites
  const segmentColors = [
    theme.colors.accent,
    'rgba(255,255,255,0.55)',
    'rgba(255,255,255,0.30)',
    'rgba(255,255,255,0.15)',
  ]

  // Animation
  const ringProgress = spring({ frame, fps, config: { damping: 18, stiffness: 80 } })
  const numberProgress = interpolate(frame, [15, 40], [0, 1], { extrapolateRight: 'clamp' })

  // Build segments
  let cumulativeOffset = 0
  const segments = clampedData.map((d, i) => {
    const fraction = d.value / total
    const dashLength = fraction * circumference
    const gapLength = circumference - dashLength
    const rotation = cumulativeOffset * 360 - 90
    cumulativeOffset += fraction

    return {
      ...d,
      fraction,
      dashLength: dashLength * ringProgress,
      gapLength,
      rotation,
      color: segmentColors[i],
    }
  })

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

      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.s5 }}>
        {/* Donut */}
        <div style={{ position: 'relative', width: radius * 2 + strokeWidth, height: radius * 2 + strokeWidth }}>
          <svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}>
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx={radius + strokeWidth / 2}
                cy={radius + strokeWidth / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${seg.dashLength} ${seg.gapLength}`}
                strokeDashoffset={0}
                transform={`rotate(${seg.rotation} ${radius + strokeWidth / 2} ${radius + strokeWidth / 2})`}
                strokeLinecap="butt"
              />
            ))}
          </svg>

          {/* Center number */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: theme.typography.monoFont,
              fontSize: 56,
              fontWeight: theme.typography.weight.heavy,
              color: theme.colors.accent,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
              opacity: numberProgress,
            }}>
              {Math.round(total * numberProgress)}{unit}
            </div>
          </div>
        </div>

        {/* Legend - right side, 3 columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, auto)',
          gap: `${theme.spacing.s2}px ${theme.spacing.s3}px`,
          opacity: interpolate(frame, [20, 30], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          {segments.map((seg, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.s1 }}>
              <div style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: seg.color,
              }} />
              <div>
                <div style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: theme.typography.scale.small,
                  color: theme.colors.foreground,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {Math.round(seg.fraction * 100)}%
                </div>
                <div style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: theme.typography.scale.cap,
                  color: theme.colors.foregroundMuted,
                }}>
                  {seg.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
