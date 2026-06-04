import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../themes/_template'
import {
  labelStyle,
  metaStyle,
  useEntrance,
  useSlideIn,
  CornerCrossGroup,
  TickRule,
  Idx,
  Eyebrow,
  SceneBackground,
} from '../styles'

interface PullQuoteProps {
  quote: string
  author: string
  authorTitle?: string
  year?: string
  category?: string
  theme: DesignTokens
}

/**
 * broll-hero.pull-quote — 引用块
 *
 * 对应 spec-mono-components.md:
 * Instrument Serif italic · 76px。
 * 一关键词换 accent,弱化句换 fg 66%。
 * 巨型左引号 opacity 0.18 装饰。
 * byline = mono caps + 36px 短杠。
 */
export const PullQuote: React.FC<PullQuoteProps> = ({
  quote,
  author,
  authorTitle,
  year,
  category,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fadeIn = useEntrance(theme, 'fade')
  const quoteSlide = useSlideIn('left', 40, 5)

  // 作者打字机效果
  const authorChars = Math.min(
    author.length,
    Math.floor(interpolate(frame, [20, 20 + author.length * 3], [0, author.length], { extrapolateRight: 'clamp' }))
  )

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.s6,
      backgroundColor: theme.colors.background,
      position: 'relative',
      ...fadeIn,
    }}>
      <SceneBackground theme={theme} />

      {theme.decoration.cornerCross && (
        <CornerCrossGroup color={theme.colors.accent} size={12} />
      )}

      {/* 分类标签 — eyebrow */}
      {category && (
        <div style={{ position: 'absolute', top: theme.spacing.s3, left: theme.spacing.s3 }}>
          <Eyebrow theme={theme} text={category} />
        </div>
      )}

      {/* 巨型左引号 — 对应原版 opacity 0.18 装饰 */}
      <div style={{
        fontFamily: theme.typography.serifFont,
        fontSize: theme.typography.scale.display * 1.5,
        color: theme.colors.accent,
        opacity: 0.18,
        lineHeight: 0.8,
        alignSelf: 'flex-start',
        marginBottom: -theme.typography.scale.display * 0.4,
        ...quoteSlide,
      }}>
        "
      </div>

      {/* 引文 — Instrument Serif italic */}
      <blockquote style={{
        fontFamily: theme.typography.serifFont,
        fontWeight: theme.typography.weight.regular,
        fontStyle: 'italic',
        fontSize: theme.typography.scale.display * 0.5, // 约 48px
        lineHeight: 1.3,
        color: theme.colors.foreground,
        textAlign: 'center',
        maxWidth: '85%',
        margin: 0,
      }}>
        {quote}
      </blockquote>

      {/* 署名 — mono caps + 短杠 */}
      <div style={{
        marginTop: theme.spacing.s4,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.s2,
      }}>
        {/* accent 短杠 */}
        <div style={{ width: 36, height: 1, backgroundColor: theme.colors.accent }} />

        <span style={{
          ...labelStyle(theme),
          color: theme.colors.foregroundMuted,
        }}>
          {author.slice(0, authorChars)}
          {authorTitle && `, ${authorTitle}`}
          {year && `, ${year}`}
        </span>
      </div>

      {theme.decoration.tickRow && (
        <div style={{
          position: 'absolute',
          bottom: theme.spacing.s2,
          left: theme.spacing.s3,
          right: theme.spacing.s3,
        }}>
          <TickRule theme={theme} />
        </div>
      )}
    </div>
  )
}
