import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'
import {
  CornerCrossGroup,
  TickRule,
  SceneBackground,
  useEntrance,
} from '../../styles'

interface EquationTerm {
  /** 项的文字 */
  label: string
  /** 是否加 accent 边框 */
  accent?: boolean
}

interface EquationProps {
  /** 等式左侧项（按顺序） */
  terms: EquationTerm[]
  /** 运算符（默认 "+"） */
  operator?: string
  /** 等式右侧结果 */
  result: string
  /** 顶部标签（如 "EQ"） */
  topLabel?: string
  /** 注释栏文字（可选） */
  annotation?: string
  theme: DesignTokens
}

/**
 * broll-abstract.equation — 等式
 *
 * 水平等距排列，运算符 serif italic 56px accent。
 * key terms 带 accent 边框。
 * 顶部 EQ 标签 + hairline 注释栏（教科书感）。
 */
export const Equation: React.FC<EquationProps> = ({
  terms,
  operator = '+',
  result,
  topLabel = 'EQ',
  annotation,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const entrance = useEntrance(theme, 'enter-up')

  // 各项逐个入场
  const itemDelay = 6

  // 等号入场
  const eqProgress = spring({
    frame: Math.max(0, frame - (terms.length + 1) * itemDelay),
    fps,
    config: { damping: 8, stiffness: 200 },
  })

  // 结果入场
  const resultDelay = (terms.length + 2) * itemDelay
  const resultProgress = spring({
    frame: Math.max(0, frame - resultDelay),
    fps,
    config: { damping: 12, stiffness: 150 },
  })

  // 注释栏淡入
  const annotOpacity = interpolate(frame, [resultDelay + 10, resultDelay + 20], [0, 1], { extrapolateRight: 'clamp' })

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
      ...entrance,
    }}>
      <SceneBackground theme={theme} />

      {theme.decoration.cornerCross && (
        <CornerCrossGroup color={theme.colors.accent} size={12} />
      )}

      {/* 顶部 EQ 标签 */}
      <div style={{
        position: 'absolute',
        top: theme.spacing.s3,
        left: theme.spacing.s3,
        fontFamily: theme.typography.monoFont,
        fontSize: theme.typography.scale.cap,
        letterSpacing: theme.typography.letterSpacing.caps,
        textTransform: 'uppercase',
        color: theme.colors.accent,
      }}>
        {topLabel}
      </div>

      {/* 主等式区 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.s3,
      }}>
        {terms.map((term, i) => {
          const delay = i * itemDelay
          const progress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })
          const x = interpolate(progress, [0, 1], [30, 0])

          return (
            <React.Fragment key={i}>
              {/* 运算符（第一项前不加） */}
              {i > 0 && (
                <div style={{
                  fontFamily: theme.typography.serifFont,
                  fontSize: 56,
                  fontWeight: theme.typography.weight.regular,
                  fontStyle: 'italic',
                  color: theme.colors.accent,
                  opacity: interpolate(progress, [0, 1], [0, 1]),
                  flexShrink: 0,
                }}>
                  {operator}
                </div>
              )}

              {/* 项 */}
              <div style={{
                padding: `${theme.spacing.s2}px ${theme.spacing.s3}px`,
                border: term.accent
                  ? `1px solid ${theme.colors.accent}`
                  : `1px solid ${theme.colors.line}`,
                borderRadius: theme.borderRadius.sm,
                fontFamily: theme.typography.sansFont,
                fontSize: theme.typography.scale.h2,
                fontWeight: theme.typography.weight.bold,
                color: term.accent ? theme.colors.accent : theme.colors.foreground,
                opacity: progress,
                transform: `translateX(${x}px)`,
              }}>
                {term.label}
              </div>
            </React.Fragment>
          )
        })}

        {/* 等号 */}
        <div style={{
          fontFamily: theme.typography.serifFont,
          fontSize: 56,
          fontWeight: theme.typography.weight.regular,
          fontStyle: 'italic',
          color: theme.colors.accent,
          opacity: eqProgress,
          transform: `scale(${eqProgress})`,
          flexShrink: 0,
        }}>
          =
        </div>

        {/* 结果 */}
        <div style={{
          padding: `${theme.spacing.s2}px ${theme.spacing.s3}px`,
          border: `1px solid ${theme.colors.accent}`,
          borderRadius: theme.borderRadius.sm,
          fontFamily: theme.typography.condensedFont,
          fontSize: theme.typography.scale.h1,
          fontWeight: theme.typography.weight.heavy,
          color: theme.colors.accent,
          opacity: resultProgress,
          transform: `scale(${interpolate(resultProgress, [0, 1], [0.9, 1])})`,
        }}>
          {result}
        </div>
      </div>

      {/* 注释栏 — hairline 上方 */}
      {annotation && (
        <div style={{
          marginTop: theme.spacing.s4,
          width: '80%',
          opacity: annotOpacity,
        }}>
          <div style={{
            height: 1,
            backgroundColor: theme.colors.line,
            marginBottom: theme.spacing.s1,
          }} />
          <div style={{
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.small,
            letterSpacing: theme.typography.letterSpacing.caps,
            textTransform: 'uppercase',
            color: theme.colors.foregroundMuted,
            textAlign: 'center',
          }}>
            {annotation}
          </div>
        </div>
      )}

      {/* 底部刻度尺 */}
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
