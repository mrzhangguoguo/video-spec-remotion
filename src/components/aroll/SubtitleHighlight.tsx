import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../themes/_template'
import { getFontWeight } from '../styles'

interface SubtitleHighlightProps {
  text: string
  keywords?: string[]
  mode?: 'karaoke' | 'sentence' | 'keyword-only'
  theme: DesignTokens
  framesPerWord?: number
  highlightColor?: string
}

/**
 * aroll.subtitle-highlight — 字幕高亮
 *
 * 对应 spec-mono-components.md:
 * 思源黑体 800 · clamp 28-56px。
 * 默认 fg 42%,念到 accent,念过纯白。
 * 强调仅 3px accent 底线(scaleX 入场),无底色块。
 * 下 14% / 左右 8% padding。
 */
export const SubtitleHighlight: React.FC<SubtitleHighlightProps> = ({
  text,
  keywords = [],
  mode = 'karaoke',
  theme,
  framesPerWord = 8,
  highlightColor,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const accentColor = highlightColor || theme.colors.accent

  // 整句模式
  if (mode === 'sentence') {
    const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' })
    return (
      <div style={{
        position: 'absolute',
        bottom: '14%',
        left: '8%',
        right: '8%',
        textAlign: 'center',
        opacity,
      }}>
        <span style={{
          // 对应原版: 思源黑体 800
          fontFamily: theme.typography.chineseFont,
          fontWeight: theme.typography.weight.heavy,
          fontSize: 'clamp(28px, 3vw, 56px)',
          color: theme.colors.foreground,
        }}>
          {text}
        </span>
      </div>
    )
  }

  // keyword-only 模式
  if (mode === 'keyword-only') {
    return (
      <div style={{
        position: 'absolute',
        bottom: '14%',
        left: '8%',
        right: '8%',
        display: 'flex',
        justifyContent: 'center',
        gap: theme.spacing.s3,
        flexWrap: 'wrap',
      }}>
        {keywords.map((kw, i) => {
          const showFrame = i * 15
          const scale = spring({
            frame: Math.max(0, frame - showFrame),
            fps,
            config: { damping: 10, stiffness: 200 },
          })
          const opacity = interpolate(
            frame,
            [showFrame, showFrame + 8],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          )

          return (
            <span
              key={i}
              style={{
                fontFamily: theme.typography.chineseFont,
                fontWeight: theme.typography.weight.heavy,
                fontSize: 'clamp(32px, 4vw, 64px)',
                color: accentColor,
                opacity,
                transform: `scale(${scale})`,
              }}
            >
              {kw}
            </span>
          )
        })}
      </div>
    )
  }

  // karaoke 模式（默认）
  const currentWordIndex = Math.floor(frame / framesPerWord)

  return (
    <div style={{
      position: 'absolute',
      bottom: '14%',
      left: '8%',
      right: '8%',
      textAlign: 'center',
    }}>
      <div style={{
        // 对应原版: 思源黑体 800 · 无底色块
        fontFamily: theme.typography.chineseFont,
        fontWeight: theme.typography.weight.heavy,
        fontSize: 'clamp(28px, 3vw, 56px)',
        lineHeight: 1.6,
        display: 'inline-block',
      }}>
        {words(text).map((word, i) => {
          const isKeyword = keywords.some(kw => word.includes(kw))
          const isActive = i <= currentWordIndex
          const isCurrent = i === currentWordIndex

          // 对应原版: 默认 fg 42%,念到 accent,念过纯白
          const color = isActive
            ? (isCurrent ? accentColor : theme.colors.foreground)
            : theme.colors.foregroundMuted // 42%

          // 当前词底线动画 — 对应原版: 仅 3px accent 底线 scaleX 入场
          const lineWidth = isCurrent
            ? spring({
                frame: frame % framesPerWord,
                fps,
                config: { damping: 15, stiffness: 200 },
              })
            : 0

          return (
            <span
              key={i}
              style={{
                color,
                display: 'inline-block',
                position: 'relative',
                fontWeight: isKeyword ? theme.typography.weight.heavy : undefined,
              }}
            >
              {word}
              {/* 3px accent 底线 */}
              {isCurrent && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: accentColor,
                  transform: `scaleX(${lineWidth})`,
                  transformOrigin: 'left',
                }} />
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/** 分词 — 按中文字符和英文单词分割 */
function words(text: string): string[] {
  return text.split(/(?<=[一-鿿])|(?<=[\s,.!?])/).filter(Boolean)
}
