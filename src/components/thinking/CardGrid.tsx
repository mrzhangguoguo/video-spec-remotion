import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface GridCard {
  /** 编号 */
  number: string
  /** 标题 */
  title: string
  /** 副标题 */
  subtitle?: string
  /** 是否推荐 */
  recommended?: boolean
}

interface CardGridProps {
  /** 卡片数据（最多 8 张，4x2） */
  cards: GridCard[]
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-thinking.card-grid — 卡片网格
 *
 * 4×2 等宽等高 16px gap。
 * 卡片：左上编号 + 左下标题 + 副标题。
 * 推荐卡片 = surface 填充 + accent 边框。
 */
export const CardGrid: React.FC<CardGridProps> = ({ cards, theme }) => {
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
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: 16,
        width: '100%',
        maxWidth: 900,
        aspectRatio: '2 / 1',
      }}>
        {cards.slice(0, 8).map((card, i) => {
          const delay = i * 6
          const progress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          const isRec = card.recommended

          return (
            <div
              key={i}
              style={{
                backgroundColor: isRec ? theme.colors.surface : 'transparent',
                border: `1px solid ${isRec ? theme.colors.accent : theme.colors.line}`,
                borderRadius: theme.borderRadius.sm,
                padding: theme.spacing.s2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                opacity: progress,
                transform: `scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
              }}
            >
              {/* Number — top left */}
              <div style={{
                fontFamily: theme.typography.monoFont,
                fontSize: theme.typography.scale.h2,
                fontWeight: theme.typography.weight.heavy,
                color: isRec ? theme.colors.accent : theme.colors.foregroundMuted,
                lineHeight: theme.typography.lineHeight.heading,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {card.number}
              </div>

              {/* Title + subtitle — bottom left */}
              <div>
                <div style={{
                  fontFamily: theme.typography.sansFont,
                  fontSize: theme.typography.scale.h4,
                  fontWeight: theme.typography.weight.heavy,
                  color: isRec ? theme.colors.accent : theme.colors.foreground,
                  lineHeight: theme.typography.lineHeight.tight,
                  marginBottom: card.subtitle ? 4 : 0,
                }}>
                  {card.title}
                </div>
                {card.subtitle && (
                  <div style={{
                    fontFamily: theme.typography.sansFont,
                    fontSize: theme.typography.scale.small,
                    color: theme.colors.foregroundSecondary,
                    lineHeight: theme.typography.lineHeight.body,
                  }}>
                    {card.subtitle}
                  </div>
                )}
              </div>

              {/* Recommended indicator */}
              {isRec && (
                <div style={{
                  position: 'absolute',
                  top: theme.spacing.s1,
                  right: theme.spacing.s1,
                  fontFamily: theme.typography.monoFont,
                  fontSize: theme.typography.scale.meta,
                  letterSpacing: theme.typography.letterSpacing.caps,
                  textTransform: 'uppercase',
                  color: theme.colors.accent,
                }}>
                  ★
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
