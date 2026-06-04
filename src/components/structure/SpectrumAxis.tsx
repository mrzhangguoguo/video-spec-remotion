import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface SpectrumAxisProps {
  /** Left pole label */
  leftPole: string
  /** Right pole label */
  rightPole: string
  /** Marker position: 0 = far left, 1 = far right */
  markerPosition: number
  theme: DesignTokens
}

/**
 * broll-structure.spectrum — 光谱轴
 *
 * Axis 1px strong hairline full-width, poles 7px circles fg 66%,
 * marker 14px circle accent.
 */
export const SpectrumAxis: React.FC<SpectrumAxisProps> = ({ leftPole, rightPole, markerPosition, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const totalW = 600
  const axisY = 200
  const svgW = totalW + 80
  const svgH = 300
  const startX = 40
  const endX = startX + totalW
  const poleR = 7
  const markerR = 14

  const markerX = startX + totalW * markerPosition

  // Entrance animations
  const axisProgress = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const markerScale = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 12, stiffness: 180 },
  })

  const poleScale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 12, stiffness: 180 },
  })

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <svg width={svgW} height={svgH} style={{ overflow: 'visible' }}>
        {/* Axis line: 1px strong hairline full-width */}
        <line
          x1={startX} y1={axisY}
          x2={startX + totalW * axisProgress} y2={axisY}
          stroke={theme.colors.lineStrong}
          strokeWidth={1}
        />

        {/* Left pole: 7px circle, fg 66% */}
        <g transform={`translate(${startX}, ${axisY}) scale(${poleScale})`} style={{ transformOrigin: '0 0' }}>
          <circle r={poleR} fill={theme.colors.foregroundSecondary} />
          <text
            y={poleR + 18}
            textAnchor="middle"
            fontFamily={theme.typography.chineseFont}
            fontSize={theme.typography.scale.small}
            fill={theme.colors.foregroundSecondary}
          >
            {leftPole}
          </text>
        </g>

        {/* Right pole: 7px circle, fg 66% */}
        <g transform={`translate(${endX}, ${axisY}) scale(${poleScale})`} style={{ transformOrigin: '0 0' }}>
          <circle r={poleR} fill={theme.colors.foregroundSecondary} />
          <text
            y={poleR + 18}
            textAnchor="middle"
            fontFamily={theme.typography.chineseFont}
            fontSize={theme.typography.scale.small}
            fill={theme.colors.foregroundSecondary}
          >
            {rightPole}
          </text>
        </g>

        {/* Marker: 14px circle accent */}
        <g transform={`translate(${markerX}, ${axisY}) scale(${markerScale})`} style={{ transformOrigin: '0 0' }}>
          <circle r={markerR} fill={theme.colors.accent} />
          {/* Subtle tick mark below */}
          <line
            x1={0} y1={markerR + 4}
            x2={0} y2={markerR + 12}
            stroke={theme.colors.accent}
            strokeWidth={1}
          />
        </g>

        {/* Tick marks along axis */}
        {Array.from({ length: 11 }).map((_, i) => {
          const x = startX + (totalW / 10) * i
          const isMajor = i % 5 === 0
          return (
            <line key={`tick-${i}`}
              x1={x} y1={axisY - (isMajor ? 6 : 3)}
              x2={x} y2={axisY + (isMajor ? 6 : 3)}
              stroke={theme.colors.lineStrong}
              strokeWidth={1}
              opacity={axisProgress}
            />
          )
        })}
      </svg>
    </div>
  )
}
