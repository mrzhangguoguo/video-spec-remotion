import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface SceneAnalyticsProps {
  theme: DesignTokens
  title?: string
  subtitle?: string
}

/**
 * illustrations.scene-analytics — 分析场景
 *
 * Figure + whiteboard + curve, SVG + spring animations
 */
export const SceneAnalytics: React.FC<SceneAnalyticsProps> = ({
  theme,
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Whiteboard
  const boardProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  })

  // Figure
  const figureProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 15, stiffness: 100 },
  })

  // Curve drawing animation
  const curveProgress = interpolate(
    frame,
    [25, 65],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Data points appearing
  const pointProgress = (index: number) =>
    spring({
      frame: Math.max(0, frame - 35 - index * 8),
      fps,
      config: { damping: 10, stiffness: 200 },
    })

  const dataPoints = [
    { x: 170, y: 190 },
    { x: 200, y: 170 },
    { x: 230, y: 180 },
    { x: 260, y: 140 },
    { x: 290, y: 120 },
  ]

  // Smooth curve path
  const curvePath = `M ${dataPoints.map((p) => `${p.x} ${p.y}`).join(' L ')}`

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Whiteboard */}
        <g
          style={{
            opacity: boardProgress,
            transform: `scale(${interpolate(boardProgress, [0, 1], [0.9, 1])})`,
            transformOrigin: '230px 140px',
          }}
        >
          {/* Board frame */}
          <rect x="150" y="70" width="160" height="140" rx="2"
            fill={theme.colors.surface} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Board stand legs */}
          <line x1="200" y1="210" x2="190" y2="260"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          <line x1="260" y1="210" x2="270" y2="260"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Cross brace */}
          <line x1="195" y1="240" x2="265" y2="240"
            stroke={theme.colors.line} strokeWidth={1} />

          {/* Grid lines on board */}
          {[0, 1, 2, 3].map((i) => (
            <line key={`h${i}`}
              x1="160" y1={90 + i * 28} x2="300" y2={90 + i * 28}
              stroke={theme.colors.line} strokeWidth={0.5} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={`v${i}`}
              x1={170 + i * 30} y1="80" x2={170 + i * 30} y2="200"
              stroke={theme.colors.line} strokeWidth={0.5} />
          ))}
        </g>

        {/* Curve on whiteboard */}
        <path
          d={curvePath}
          stroke={theme.colors.accent}
          strokeWidth={1.5}
          fill="none"
          strokeDasharray={200}
          strokeDashoffset={200 - curveProgress * 200}
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill={theme.colors.accent}
            opacity={pointProgress(i)}
          />
        ))}

        {/* Highlight dot on peak */}
        <circle
          cx={290}
          cy={120}
          r={5}
          fill={theme.colors.accent}
          opacity={pointProgress(4)}
        />

        {/* Figure */}
        <g
          style={{
            opacity: figureProgress,
            transform: `translateX(${interpolate(figureProgress, [0, 1], [-20, 0])}px)`,
          }}
        >
          {/* Head */}
          <circle cx="100" cy="140" r="16"
            fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Body */}
          <rect x="86" y="160" width="28" height="50" rx="4"
            fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Arm pointing at board */}
          <line x1="114" y1="170" x2="148" y2="140"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Legs */}
          <line x1="95" y1="210" x2="90" y2="250"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          <line x1="105" y1="210" x2="110" y2="250"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
        </g>

        {/* Ground line */}
        <line x1="60" y1="270" x2="340" y2="270"
          stroke={theme.colors.line} strokeWidth={1} />
      </svg>

      {(title || subtitle) && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: 'center',
            padding: theme.spacing.s2,
          }}
        >
          {title && (
            <div
              style={{
                fontFamily: theme.typography.sansFont,
                fontSize: theme.typography.scale.h4,
                fontWeight: theme.typography.weight.mid,
                color: theme.colors.foreground,
              }}
            >
              {title}
            </div>
          )}
          {subtitle && (
            <div
              style={{
                fontFamily: theme.typography.sansFont,
                fontSize: theme.typography.scale.small,
                color: theme.colors.foregroundMuted,
                marginTop: 4,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
