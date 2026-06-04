import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface SceneCoCreateProps {
  theme: DesignTokens
  title?: string
  subtitle?: string
}

/**
 * illustrations.scene-co-create — 共创场景
 *
 * Two people + screen, SVG + spring animations
 */
export const SceneCoCreate: React.FC<SceneCoCreateProps> = ({
  theme,
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Left person
  const leftProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  })

  // Right person
  const rightProgress = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 15, stiffness: 100 },
  })

  // Screen
  const screenProgress = spring({
    frame: Math.max(0, frame - 16),
    fps,
    config: { damping: 12, stiffness: 120 },
  })

  // Content lines appearing on screen
  const lineProgress = (lineIndex: number) =>
    spring({
      frame: Math.max(0, frame - 30 - lineIndex * 6),
      fps,
      config: { damping: 18, stiffness: 100 },
    })

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Left person */}
        <g
          style={{
            opacity: leftProgress,
            transform: `translateX(${interpolate(leftProgress, [0, 1], [-30, 0])}px)`,
          }}
        >
          {/* Head */}
          <circle cx="100" cy="130" r="16"
            fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Body */}
          <rect x="86" y="150" width="28" height="50" rx="4"
            fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Arm pointing to screen */}
          <line x1="114" y1="165" x2="150" y2="140"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Legs */}
          <line x1="95" y1="200" x2="90" y2="240"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          <line x1="105" y1="200" x2="110" y2="240"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
        </g>

        {/* Right person */}
        <g
          style={{
            opacity: rightProgress,
            transform: `translateX(${interpolate(rightProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          {/* Head */}
          <circle cx="300" cy="130" r="16"
            fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Body */}
          <rect x="286" y="150" width="28" height="50" rx="4"
            fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Arm pointing to screen */}
          <line x1="286" y1="165" x2="250" y2="140"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Legs */}
          <line x1="295" y1="200" x2="290" y2="240"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          <line x1="305" y1="200" x2="310" y2="240"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
        </g>

        {/* Screen */}
        <g
          style={{
            opacity: screenProgress,
            transform: `scale(${interpolate(screenProgress, [0, 1], [0.9, 1])})`,
            transformOrigin: '200px 120px',
          }}
        >
          {/* Screen frame */}
          <rect x="150" y="80" width="100" height="80" rx="4"
            fill={theme.colors.surface} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Screen stand */}
          <line x1="200" y1="160" x2="200" y2="180"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          <line x1="185" y1="180" x2="215" y2="180"
            stroke={theme.colors.lineStrong} strokeWidth={1} />

          {/* Content lines on screen */}
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x="160"
              y={92 + i * 14}
              width={interpolate(lineProgress(i), [0, 1], [0, 60 + i * 8])}
              height="4"
              rx="2"
              fill={i === 2 ? theme.colors.accent : theme.colors.foregroundFaint}
              opacity={lineProgress(i)}
            />
          ))}
        </g>

        {/* Connection arrows (dashed) */}
        <line x1="120" y1="140" x2="150" y2="120"
          stroke={theme.colors.line} strokeWidth={1} strokeDasharray="4 2"
          opacity={interpolate(frame, [25, 40], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
        <line x1="280" y1="140" x2="250" y2="120"
          stroke={theme.colors.line} strokeWidth={1} strokeDasharray="4 2"
          opacity={interpolate(frame, [25, 40], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />

        {/* Ground line */}
        <line x1="60" y1="260" x2="340" y2="260"
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
