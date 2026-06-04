import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface ScenePromptProps {
  theme: DesignTokens
  title?: string
  subtitle?: string
}

/**
 * illustrations.scene-prompt — 提示词场景
 *
 * Standing figure + terminal + floating symbols, SVG + spring animations
 */
export const ScenePrompt: React.FC<ScenePromptProps> = ({
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

  // Terminal entrance
  const terminalProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 12, stiffness: 120 },
  })

  // Floating symbols — each with different delay
  const symbols = [
    { x: 280, y: 70, char: '{}', delay: 20 },
    { x: 320, y: 110, char: '</>', delay: 28 },
    { x: 260, y: 50, char: '()', delay: 36 },
    { x: 340, y: 80, char: '=>', delay: 44 },
  ]

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Standing figure */}
        <g
          style={{
            opacity: figureProgress,
            transform: `translateY(${interpolate(figureProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          {/* Head */}
          <circle cx="120" cy="120" r="16"
            fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Body */}
          <rect x="106" y="140" width="28" height="55" rx="4"
            fill={theme.colors.elevated} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Arm extended to terminal */}
          <line x1="134" y1="155" x2="170" y2="140"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Legs */}
          <line x1="114" y1="195" x2="110" y2="250"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
          <line x1="126" y1="195" x2="130" y2="250"
            stroke={theme.colors.lineStrong} strokeWidth={1} />
        </g>

        {/* Terminal window */}
        <g
          style={{
            opacity: terminalProgress,
            transform: `scale(${interpolate(terminalProgress, [0, 1], [0.9, 1])})`,
            transformOrigin: '220px 140px',
          }}
        >
          {/* Terminal frame */}
          <rect x="160" y="100" width="120" height="80" rx="4"
            fill={theme.colors.surface} stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Title bar */}
          <line x1="160" y1="116" x2="280" y2="116"
            stroke={theme.colors.line} strokeWidth={1} />
          {/* 3 dots */}
          <circle cx="172" cy="108" r="3"
            fill="none" stroke={theme.colors.lineStrong} strokeWidth={1} />
          <circle cx="182" cy="108" r="3"
            fill="none" stroke={theme.colors.lineStrong} strokeWidth={1} />
          <circle cx="192" cy="108" r="3"
            fill="none" stroke={theme.colors.lineStrong} strokeWidth={1} />
          {/* Cursor line */}
          <rect x="170" y="125" width="8" height="12"
            fill={theme.colors.accent} opacity={Math.floor(frame / fps) % 2 === 0 ? 1 : 0} />
          {/* Code lines */}
          <rect x="170" y="125" width="50" height="3" rx="1"
            fill={theme.colors.foregroundFaint} />
          <rect x="170" y="135" width="80" height="3" rx="1"
            fill={theme.colors.foregroundFaint} />
          <rect x="170" y="145" width="35" height="3" rx="1"
            fill={theme.colors.accent} opacity={0.4} />
          <rect x="170" y="155" width="60" height="3" rx="1"
            fill={theme.colors.foregroundFaint} />
          <rect x="170" y="165" width="45" height="3" rx="1"
            fill={theme.colors.foregroundFaint} />
        </g>

        {/* Floating symbols */}
        {symbols.map((sym, i) => {
          const symProgress = spring({
            frame: Math.max(0, frame - sym.delay),
            fps,
            config: { damping: 8, stiffness: 100, mass: 0.5 },
          })

          const floatY = interpolate(
            frame,
            [sym.delay, sym.delay + 60],
            [0, -8],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )

          return (
            <g
              key={i}
              style={{
                opacity: symProgress,
                transform: `translate(${interpolate(symProgress, [0, 1], [20, 0])}px, ${floatY}px)`,
              }}
            >
              <text
                x={sym.x}
                y={sym.y}
                fontFamily={theme.typography.monoFont}
                fontSize="14"
                fill={theme.colors.accent}
                opacity={0.7}
              >
                {sym.char}
              </text>
            </g>
          )
        })}

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
