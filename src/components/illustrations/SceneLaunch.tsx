import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface SceneLaunchProps {
  theme: DesignTokens
  title?: string
  subtitle?: string
}

/**
 * illustrations.scene-launch — 发布场景
 *
 * Waving figure + rocket trail, SVG + spring animations
 */
export const SceneLaunch: React.FC<SceneLaunchProps> = ({
  theme,
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Figure entrance
  const figureProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  })

  // Rocket launch
  const rocketProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 10, stiffness: 80 },
  })

  // Rocket Y position — launches upward
  const rocketY = interpolate(
    frame,
    [15, 60],
    [180, 40],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Trail opacity fades
  const trailOpacity = interpolate(
    frame,
    [20, 50, 70],
    [0, 0.6, 0.2],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Waving arm animation
  const waveAngle = interpolate(
    frame % 30,
    [0, 15, 30],
    [-15, 15, -15],
  )

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Rocket trail */}
        {frame > 20 && (
          <g opacity={trailOpacity}>
            {/* Trail particles */}
            {[0, 1, 2, 3, 4].map((i) => {
              const particleY = rocketY + 40 + i * 18
              const particleX = 200 + (i % 2 === 0 ? -3 : 3)
              const particleR = 3 + i * 1.5
              return (
                <circle
                  key={i}
                  cx={particleX}
                  cy={Math.min(particleY, 220)}
                  r={particleR}
                  fill={theme.colors.foregroundFaint}
                  opacity={1 - i * 0.2}
                />
              )
            })}
            {/* Main trail */}
            <rect x="198" y={rocketY + 25} width="4" height={180 - rocketY}
              fill={theme.colors.accent} opacity={0.3} />
          </g>
        )}

        {/* Rocket */}
        <g
          style={{
            opacity: rocketProgress,
            transform: `translateY(${rocketY - 180}px)`,
          }}
        >
          {/* Body */}
          <rect x="192" y="150" width="16" height="30" rx="8 8 2 2"
            fill={theme.colors.surface} stroke={theme.colors.accent} strokeWidth={1} />
          {/* Nose cone */}
          <path d="M192 150 L200 135 L208 150"
            fill="none" stroke={theme.colors.accent} strokeWidth={1} />
          {/* Fins */}
          <path d="M192 175 L185 185 L192 180"
            fill="none" stroke={theme.colors.accent} strokeWidth={1} />
          <path d="M208 175 L215 185 L208 180"
            fill="none" stroke={theme.colors.accent} strokeWidth={1} />
          {/* Window */}
          <circle cx="200" cy="160" r="4"
            fill="none" stroke={theme.colors.accent} strokeWidth={1} />
          {/* Flame */}
          <path d="M196 180 L200 195 L204 180"
            fill={theme.colors.accent} opacity={0.6} />
        </g>

        {/* Waving figure */}
        <g
          style={{
            opacity: figureProgress,
            transform: `translateY(${interpolate(figureProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          {/* Head */}
          <circle cx="100" cy="160" r="16"
            fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Body */}
          <rect x="86" y="180" width="28" height="50" rx="4"
            fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Waving arm */}
          <g transform={`rotate(${waveAngle}, 114, 185)`}>
            <line x1="114" y1="185" x2="135" y2="160"
              stroke={theme.colors.lineStrong} strokeWidth={1} />
            {/* Hand */}
            <circle cx="135" cy="158" r="4"
              fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          </g>
          {/* Other arm */}
          <line x1="86" y1="190" x2="75" y2="210"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Legs */}
          <line x1="95" y1="230" x2="90" y2="260"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          <line x1="105" y1="230" x2="110" y2="260"
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
