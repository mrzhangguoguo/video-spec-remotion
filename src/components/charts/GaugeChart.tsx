import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

export interface GaugeChartProps {
  value: number
  max: number
  title?: string
  unit?: string
  theme: DesignTokens
}

/**
 * broll-charts.gauge — 仪表盘
 *
 * 220° 扫描 (-200°→20°)，笔画 22px round，背景 10% 白，数字 72px mono 800 accent。
 */
export const GaugeChart: React.FC<GaugeChartProps> = ({ value, max, title, unit, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const strokeWidth = 22
  const radius = 140
  const cx = 200
  const cy = 200

  // Arc: -200° to 20° = 220° sweep
  const startAngle = -200
  const endAngle = 20
  const totalSweep = endAngle - startAngle  // 220°

  // Convert degrees to radians
  const toRad = (deg: number) => (deg * Math.PI) / 180

  // Calculate arc path
  const arcPath = (startDeg: number, endDeg: number) => {
    const startRad = toRad(startDeg)
    const endRad = toRad(endDeg)
    const x1 = cx + radius * Math.cos(startRad)
    const y1 = cy + radius * Math.sin(startRad)
    const x2 = cx + radius * Math.cos(endRad)
    const y2 = cy + radius * Math.sin(endRad)
    const largeArc = endDeg - startDeg > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  const bgPath = arcPath(startAngle, endAngle)

  // Value arc
  const fraction = Math.min(value / max, 1)
  const gaugeProgress = spring({ frame, fps, config: { damping: 18, stiffness: 80 } })
  const valueAngle = startAngle + totalSweep * fraction * gaugeProgress
  const valuePath = fraction > 0 ? arcPath(startAngle, valueAngle) : ''

  // Number animation
  const numberProgress = interpolate(frame, [15, 45], [0, 1], { extrapolateRight: 'clamp' })
  const displayValue = Math.round(value * numberProgress)

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
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

      <div style={{ position: 'relative', width: 400, height: 300 }}>
        <svg width="100%" viewBox="0 0 400 300" style={{ overflow: 'visible' }}>
          {/* Background arc */}
          <path
            d={bgPath}
            fill="none"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value arc */}
          {fraction > 0 && (
            <path
              d={valuePath}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Center number */}
        <div style={{
          position: 'absolute',
          top: '55%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: theme.typography.monoFont,
            fontSize: 72,
            fontWeight: theme.typography.weight.heavy,
            color: theme.colors.accent,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}>
            {displayValue}{unit}
          </div>
        </div>
      </div>
    </div>
  )
}
