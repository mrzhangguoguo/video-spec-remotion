import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface SwotQuadrant {
  letter: string
  label: string
  items: string[]
  /** 是否正面（S/O 用 accent） */
  positive?: boolean
}

interface SwotGridProps {
  /** 四象限数据 [S, W, O, T] */
  quadrants: [SwotQuadrant, SwotQuadrant, SwotQuadrant, SwotQuadrant]
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-thinking.swot — SWOT 分析
 *
 * 2×2 等宽，S/O 用 accent（正面），W/T 中性。
 * 字母 mono 800 56px 作为视觉锚点，条目用 8px dash（非 dots）。
 */
export const SwotGrid: React.FC<SwotGridProps> = ({ quadrants, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.s5,
      backgroundColor: theme.colors.background,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 1,
        width: '100%',
        maxWidth: 900,
        maxHeight: '80%',
        backgroundColor: theme.colors.line,
      }}>
        {quadrants.map((q, i) => {
          const delay = i * 10
          const progress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          const accentColor = q.positive ? theme.colors.accent : theme.colors.foregroundSecondary

          return (
            <div
              key={i}
              style={{
                backgroundColor: theme.colors.background,
                padding: theme.spacing.s3,
                display: 'flex',
                flexDirection: 'column',
                opacity: progress,
                transform: `scale(${interpolate(progress, [0, 1], [0.95, 1])})`,
              }}
            >
              {/* Letter anchor */}
              <div style={{
                fontFamily: theme.typography.monoFont,
                fontSize: 56,
                fontWeight: theme.typography.weight.heavy,
                color: accentColor,
                lineHeight: theme.typography.lineHeight.heading,
                marginBottom: theme.spacing.s1,
                opacity: 0.3,
              }}>
                {q.letter}
              </div>

              {/* Label */}
              <div style={{
                fontFamily: theme.typography.sansFont,
                fontSize: theme.typography.scale.h4,
                fontWeight: theme.typography.weight.heavy,
                color: accentColor,
                marginBottom: theme.spacing.s2,
              }}>
                {q.label}
              </div>

              {/* Items with dash separator */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.s1,
              }}>
                {q.items.map((item, ii) => {
                  const itemDelay = delay + 8 + ii * 4
                  const itemProgress = spring({
                    frame: Math.max(0, frame - itemDelay),
                    fps,
                    config: { damping: 15, stiffness: 120 },
                  })

                  return (
                    <div
                      key={ii}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: theme.spacing.s1,
                        opacity: itemProgress,
                      }}
                    >
                      <span style={{
                        display: 'inline-block',
                        width: 8,
                        height: 1,
                        backgroundColor: accentColor,
                        marginTop: '0.6em',
                        flexShrink: 0,
                        opacity: 0.5,
                      }} />
                      <span style={{
                        fontFamily: theme.typography.sansFont,
                        fontSize: theme.typography.scale.body,
                        color: theme.colors.foreground,
                        lineHeight: theme.typography.lineHeight.body,
                      }}>
                        {item}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
