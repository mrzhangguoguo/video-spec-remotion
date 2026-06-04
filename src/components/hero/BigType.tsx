import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../themes/_template'
import {
  heroStyle,
  labelStyle,
  CornerCrossGroup,
  TickRule,
  Idx,
  useEntrance,
  usePulse,
  SceneBackground,
} from '../styles'

interface BigTypeProps {
  title: string
  accentWords?: string[]
  chapter?: string
  subtitle?: string
  theme: DesignTokens
  entrance?: 'slam' | 'enter-up' | 'fade'
}

/**
 * broll-hero.big-type — 大字海报
 *
 * 对应 spec-mono-components.md:
 * Barlow Semi Condensed 800 · 4K 下 180-220px。
 * 挑一字换 Instrument Serif italic + accent。
 * chrome = 左上 idx + 右上 rule + 底刻度尺 + 时码。
 */
export const BigType: React.FC<BigTypeProps> = ({
  title,
  accentWords = [],
  chapter,
  subtitle,
  theme,
  entrance = 'slam',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // 入场动画 — 使用统一的 useEntrance
  const entranceStyle = useEntrance(theme, entrance === 'slam' ? 'slam' : entrance === 'fade' ? 'fade' : 'enter-up')

  // accent 词 pulse
  const pulseScale = usePulse(entrance === 'slam' ? 20 : 30)

  // 渲染标题，accent 词换 serif italic
  const renderTitle = () => {
    if (accentWords.length === 0) return title

    const parts: React.ReactNode[] = []
    let remaining = title
    let key = 0

    for (const word of accentWords) {
      const idx = remaining.indexOf(word)
      if (idx === -1) continue
      if (idx > 0) parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>)
      parts.push(
        <span
          key={key++}
          style={{
            // 对应原版: 挑一字换 Instrument Serif italic + accent
            fontFamily: theme.typography.serifFont,
            fontStyle: 'italic',
            color: theme.colors.accent,
            display: 'inline-block',
            transform: `scale(${pulseScale})`,
            fontWeight: theme.typography.weight.regular,
          }}
        >
          {word}
        </span>
      )
      remaining = remaining.slice(idx + word.length)
    }
    if (remaining) parts.push(<span key={key++}>{remaining}</span>)
    return parts
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      padding: theme.spacing.s5,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 背景纹理 */}
      <SceneBackground theme={theme} />

      {/* 四角针脚 */}
      {theme.decoration.cornerCross && (
        <CornerCrossGroup color={theme.colors.accent} size={12} />
      )}

      {/* 左上编号 — 对应原版 idx */}
      {chapter && (
        <div style={{ position: 'absolute', top: theme.spacing.s3, left: theme.spacing.s3 }}>
          <Idx theme={theme} text={chapter} />
        </div>
      )}

      {/* 主标题 — hero style */}
      <h1 style={{
        ...heroStyle(theme),
        // 覆盖为指定字号（不是 display 级别的 96px，而是适合视频的尺寸）
        fontSize: theme.typography.scale.display * 0.67, // 约 64px
        color: theme.colors.foreground,
        textAlign: 'center',
        maxWidth: '80%',
        margin: 0,
        ...entranceStyle,
      }}>
        {renderTitle()}
      </h1>

      {/* 副标题 */}
      {subtitle && (
        <p style={{
          fontFamily: theme.typography.sansFont,
          fontSize: theme.typography.scale.h3,
          fontWeight: theme.typography.weight.regular,
          color: theme.colors.foregroundSecondary,
          marginTop: theme.spacing.s3,
          opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          {subtitle}
        </p>
      )}

      {/* 底栏刻度尺 — 对应原版 tick-rule */}
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
