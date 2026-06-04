import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'
import {
  CornerCrossGroup,
  useEntrance,
} from '../../styles'

interface ConceptCardProps {
  /** 标题（中文，其中一个词换 serif italic） */
  title: string
  /** 需要换 serif italic 的词 */
  accentWord?: string
  /** 正文（≤3 行） */
  body: string
  /** 来源脚注（可选） */
  source?: string
  theme: DesignTokens
}

/**
 * aroll.concept-card — 概念卡
 *
 * surface bg + 1px hairline + 4 corner crosses，radius 8px，padding 32/36px。
 * Title cn 38/800（挑一词换 serif italic）+ 28×2px accent divider + body cn 16/400。
 * 底部 hairline divider + source 脚注。
 * 0 shadows，每卡一个概念，body ≤3 行。
 * 入场 700ms ease-out。
 */
export const ConceptCard: React.FC<ConceptCardProps> = ({
  title,
  accentWord,
  body,
  source,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // 入场 700ms ease-out
  const entrance = useEntrance(theme, 'enter-up')

  // 渲染标题，accent 词换 serif italic
  const renderTitle = () => {
    if (!accentWord) return title

    const idx = title.indexOf(accentWord)
    if (idx === -1) return title

    const parts: React.ReactNode[] = []
    if (idx > 0) parts.push(<span key="pre">{title.slice(0, idx)}</span>)
    parts.push(
      <span
        key="accent"
        style={{
          fontFamily: theme.typography.serifFont,
          fontStyle: 'italic',
          color: theme.colors.accent,
          fontWeight: theme.typography.weight.regular,
        }}
      >
        {accentWord}
      </span>
    )
    const after = idx + accentWord.length
    if (after < title.length) parts.push(<span key="post">{title.slice(after)}</span>)
    return parts
  }

  // divider 动画
  const dividerProgress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 15, stiffness: 120 },
  })

  // body 淡入
  const bodyOpacity = interpolate(frame, [15, 25], [0, 1], { extrapolateRight: 'clamp' })

  // source 淡入
  const sourceOpacity = interpolate(frame, [25, 35], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <div style={{
      width: '50%',
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.line}`,
      borderRadius: theme.borderRadius.lg,
      padding: '32px 36px',
      position: 'relative',
      ...entrance,
    }}>
      {/* 四角十字针脚 */}
      <CornerCrossGroup color={theme.colors.accent} size={10} />

      {/* 标题 — cn 38/800 */}
      <h3 style={{
        fontFamily: theme.typography.chineseFont,
        fontSize: 38,
        fontWeight: theme.typography.weight.heavy,
        color: theme.colors.foreground,
        margin: 0,
        lineHeight: theme.typography.lineHeight.tight,
      }}>
        {renderTitle()}
      </h3>

      {/* accent divider — 28×2px */}
      <div style={{
        width: 28,
        height: 2,
        backgroundColor: theme.colors.accent,
        marginTop: theme.spacing.s2,
        marginBottom: theme.spacing.s2,
        transform: `scaleX(${dividerProgress})`,
        transformOrigin: 'left',
      }} />

      {/* 正文 — cn 16/400，≤3 行 */}
      <p style={{
        fontFamily: theme.typography.chineseFont,
        fontSize: 16,
        fontWeight: theme.typography.weight.regular,
        color: theme.colors.foregroundSecondary,
        lineHeight: theme.typography.lineHeight.body,
        margin: 0,
        opacity: bodyOpacity,
        // 限制 3 行
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {body}
      </p>

      {/* 底部 hairline divider + source 脚注 */}
      {source && (
        <div style={{
          marginTop: theme.spacing.s3,
          paddingTop: theme.spacing.s2,
          borderTop: `1px solid ${theme.colors.line}`,
          opacity: sourceOpacity,
        }}>
          <span style={{
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.meta,
            letterSpacing: theme.typography.letterSpacing.meta,
            textTransform: 'uppercase',
            color: theme.colors.foregroundFaint,
          }}>
            {source}
          </span>
        </div>
      )}
    </div>
  )
}
