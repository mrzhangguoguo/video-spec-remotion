import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface CircleRing {
  /** Mono label (e.g. "CORE") */
  mono: string
  /** Chinese label */
  cn: string
}

interface ConcentricCirclesProps {
  rings: CircleRing[]
  theme: DesignTokens
}

/**
 * broll-structure.concentric — 同心圆
 *
 * Radii 60/120/180/240, labels top-right mono+cn dual-line,
 * core fill surface + accent stroke.
 */
export const ConcentricCircles: React.FC<ConcentricCirclesProps> = ({ rings, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const radii = [60, 120, 180, 240]
  const cx = 300
  const cy = 260
  const svgW = 600
  const svgH = 520

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <svg width={svgW} height={svgH} style={{ overflow: 'visible' }}>
        {/* Circles from outermost to innermost */}
        {rings.map((ring, i) => {
          const r = radii[i] || radii[radii.length - 1]
          const isCore = i === 0

          const delay = (rings.length - 1 - i) * 8
          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 100 },
          })

          return (
            <g key={i}>
              {/* Circle */}
              <circle
                cx={cx} cy={cy}
                r={r * scale}
                fill={isCore ? theme.colors.surface : 'none'}
                stroke={isCore ? theme.colors.accent : theme.colors.lineStrong}
                strokeWidth={isCore ? 2 : 1}
              />

              {/* Label: top-right of circle */}
              <g
                transform={`translate(${cx + r * 0.7}, ${cy - r * 0.7})`}
                opacity={interpolate(frame, [delay + 8, delay + 15], [0, 1], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                })}
              >
                {/* Mono line */}
                <text
                  fontFamily={theme.typography.monoFont}
                  fontSize={theme.typography.scale.cap}
                  fontWeight={theme.typography.weight.mid}
                  letterSpacing={theme.typography.letterSpacing.caps}
                  fill={isCore ? theme.colors.accent : theme.colors.foregroundSecondary}
                >
                  {ring.mono}
                </text>
                {/* CN line */}
                <text
                  y={14}
                  fontFamily={theme.typography.chineseFont}
                  fontSize={theme.typography.scale.small}
                  fill={theme.colors.foreground}
                >
                  {ring.cn}
                </text>
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
