import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface SceneRetrievalProps {
  theme: DesignTokens
  title?: string
  subtitle?: string
}

/**
 * illustrations.scene-retrieval — 检索场景
 *
 * Figure + magnifier + file cabinet, SVG + spring animations
 */
export const SceneRetrieval: React.FC<SceneRetrievalProps> = ({
  theme,
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // File cabinet
  const cabinetProgress = spring({
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

  // Magnifier
  const magnifierProgress = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 10, stiffness: 150 },
  })

  // Magnifier scan animation
  const scanX = interpolate(
    frame,
    [30, 70],
    [0, 30],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Found highlight
  const foundOpacity = interpolate(
    frame,
    [60, 70],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        style={{ width: '100%', height: '100%' }}
      >
        {/* File cabinet */}
        <g
          style={{
            opacity: cabinetProgress,
            transform: `translateY(${interpolate(cabinetProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          {/* Cabinet body */}
          <rect x="200" y="100" width="100" height="160" rx="2"
            fill={theme.colors.surface} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Drawer 1 */}
          <rect x="208" y="110" width="84" height="35" rx="2"
            fill={theme.colors.elevated} stroke={theme.colors.line} strokeWidth={1} />
          <rect x="240" y="124" width="20" height="4" rx="2"
            fill={theme.colors.foregroundFaint} />
          {/* Drawer 2 */}
          <rect x="208" y="155" width="84" height="35" rx="2"
            fill={theme.colors.elevated} stroke={theme.colors.line} strokeWidth={1} />
          <rect x="240" y="169" width="20" height="4" rx="2"
            fill={theme.colors.foregroundFaint} />
          {/* Drawer 3 (open) */}
          <rect x="208" y="200" width="84" height="35" rx="2"
            fill={theme.colors.elevated} stroke={theme.colors.accent} strokeWidth={1} />
          <rect x="240" y="214" width="20" height="4" rx="2"
            fill={theme.colors.accent} opacity={0.6} />
          {/* File folders peeking out */}
          <rect x="215" y="196" width="16" height="24" rx="1"
            fill={theme.colors.accent3} stroke={theme.colors.line} strokeWidth={1} />
          <rect x="235" y="198" width="16" height="22" rx="1"
            fill={theme.colors.accent3} stroke={theme.colors.line} strokeWidth={1} />
        </g>

        {/* Figure */}
        <g
          style={{
            opacity: figureProgress,
            transform: `translateX(${interpolate(figureProgress, [0, 1], [-20, 0])}px)`,
          }}
        >
          {/* Head */}
          <circle cx="120" cy="140" r="16"
            fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Body */}
          <rect x="106" y="160" width="28" height="50" rx="4"
            fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Arm holding magnifier */}
          <line x1="134" y1="170" x2="160" y2="150"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Legs */}
          <line x1="114" y1="210" x2="110" y2="250"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          <line x1="126" y1="210" x2="130" y2="250"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
        </g>

        {/* Magnifier */}
        <g
          style={{
            opacity: magnifierProgress,
            transform: `translate(${scanX}px, 0)`,
          }}
        >
          {/* Lens */}
          <circle cx="170" cy="140" r="20"
            fill="none" stroke={theme.colors.accent} strokeWidth={1.5} />
          {/* Handle */}
          <line x1="185" y1="155" x2="200" y2="170"
            stroke={theme.colors.accent} strokeWidth={2} strokeLinecap="round" />
          {/* Lens reflection */}
          <circle cx="165" cy="135" r="6"
            fill="none" stroke={theme.colors.accent} strokeWidth={0.5} opacity={0.4} />
        </g>

        {/* Found highlight on drawer */}
        <rect x="208" y="200" width="84" height="35" rx="2"
          fill={theme.colors.accent} opacity={foundOpacity * 0.15} />

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
