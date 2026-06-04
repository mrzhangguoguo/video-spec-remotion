import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface SceneThinkingProps {
  theme: DesignTokens
  title?: string
  subtitle?: string
}

/**
 * illustrations.scene-thinking — 思考场景
 *
 * Seated figure + thought bubble + lightbulb, SVG + spring animations
 */
export const SceneThinking: React.FC<SceneThinkingProps> = ({
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

  // Thought bubble delay
  const bubbleProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 12, stiffness: 120 },
  })

  // Lightbulb delay
  const bulbProgress = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  })

  // Lightbulb glow pulse
  const glowOpacity = interpolate(
    frame,
    [35, 50, 65],
    [0, 0.3, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Seated figure */}
        <g
          style={{
            opacity: figureProgress,
            transform: `translateY(${interpolate(figureProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          {/* Body */}
          <rect x="140" y="160" width="40" height="60" rx="4"
            fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Head */}
          <circle cx="160" cy="140" r="18"
            fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Seat */}
          <rect x="120" y="220" width="80" height="10" rx="2"
            fill={theme.colors.surface} stroke={theme.colors.line} strokeWidth={1} />
          {/* Legs */}
          <line x1="130" y1="230" x2="130" y2="260"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          <line x1="190" y1="230" x2="190" y2="260"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
        </g>

        {/* Thought bubble chain */}
        <g
          style={{
            opacity: bubbleProgress,
            transform: `scale(${interpolate(bubbleProgress, [0, 1], [0.5, 1])})`,
            transformOrigin: '220px 130px',
          }}
        >
          <circle cx="200" cy="130" r="4"
            fill={theme.colors.foregroundFaint} />
          <circle cx="215" cy="115" r="6"
            fill={theme.colors.foregroundFaint} />
          {/* Main thought bubble */}
          <rect x="230" y="60" width="120" height="60" rx="30"
            fill={theme.colors.surface} stroke={theme.colors.lineStrong} strokeWidth={1} />
        </g>

        {/* Lightbulb inside thought bubble */}
        <g
          style={{
            opacity: bulbProgress,
            transform: `translateY(${interpolate(bulbProgress, [0, 1], [10, 0])}px)`,
          }}
        >
          {/* Glow */}
          <circle cx="290" cy="90" r="24"
            fill={theme.colors.accent} opacity={glowOpacity} />
          {/* Bulb body */}
          <path
            d="M282 95 C282 82, 298 82, 298 95 L296 102 L284 102 Z"
            fill="none" stroke={theme.colors.accent} strokeWidth={1.5} />
          {/* Bulb base */}
          <rect x="285" y="102" width="10" height="6" rx="1"
            fill={theme.colors.accent} opacity={0.6} />
          {/* Filament */}
          <line x1="288" y1="93" x2="292" y2="93"
            stroke={theme.colors.accent} strokeWidth={1} />
          <line x1="288" y1="96" x2="292" y2="96"
            stroke={theme.colors.accent} strokeWidth={1} />
        </g>

        {/* Ground line */}
        <line x1="80" y1="270" x2="320" y2="270"
          stroke={theme.colors.line} strokeWidth={1} />
      </svg>

      {/* Title + subtitle */}
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
