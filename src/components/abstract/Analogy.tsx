import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion'
import type { DesignTokens } from '../../themes/_template'

interface AnalogyProps {
  /** 陌生概念（左侧） */
  unfamiliar: string
  /** 陌生概念副释 */
  unfamiliarDesc?: string
  /** 熟悉概念（右侧） */
  familiar: string
  /** 熟悉概念副释 */
  familiarDesc?: string
  /** 类比的成立维度 */
  similarity?: string
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-abstract.analogy — 类比框
 *
 * 把陌生概念左右对应到熟悉事物，中间用 ≈ 连接。
 * 最常用的抽象组件。
 */
export const Analogy: React.FC<AnalogyProps> = ({
  unfamiliar,
  unfamiliarDesc,
  familiar,
  familiarDesc,
  similarity,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // 左侧入场
  const leftSlide = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120 },
  })
  const leftX = interpolate(leftSlide, [0, 1], [-60, 0])

  // 右侧入场
  const rightSlide = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 18, stiffness: 120 },
  })
  const rightX = interpolate(rightSlide, [0, 1], [60, 0])

  // 等号淡入
  const eqOpacity = interpolate(frame, [15, 25], [0, 1], { extrapolateRight: 'clamp' })
  const eqScale = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 8, stiffness: 200 },
  })

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.scenePadding,
      backgroundColor: theme.colors.background,
      gap: theme.spacing.componentGap,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.componentGap * 2,
      }}>
        {/* 陌生概念 */}
        <div style={{
          flex: 1,
          padding: theme.spacing.componentGap * 1.5,
          borderRadius: theme.borderRadius.lg,
          backgroundColor: theme.colors.card,
          border: `1px solid ${theme.colors.cardBorder}`,
          textAlign: 'center',
          transform: `translateX(${leftX}px)`,
        }}>
          <div style={{
            fontFamily: theme.typography.headingFont,
            fontWeight: theme.typography.headingWeight,
            fontSize: theme.typography.baseSize * 1.75,
            color: theme.colors.foreground,
          }}>
            {unfamiliar}
          </div>
          {unfamiliarDesc && (
            <div style={{
              fontFamily: theme.typography.bodyFont,
              fontSize: theme.typography.baseSize,
              color: theme.colors.secondary,
              marginTop: theme.spacing.unit,
            }}>
              {unfamiliarDesc}
            </div>
          )}
        </div>

        {/* ≈ 符号 */}
        <div style={{
          fontFamily: theme.typography.headingFont,
          fontSize: theme.typography.baseSize * 3,
          color: theme.colors.accent,
          opacity: eqOpacity,
          transform: `scale(${eqScale})`,
          flexShrink: 0,
        }}>
          ≈
        </div>

        {/* 熟悉概念 */}
        <div style={{
          flex: 1,
          padding: theme.spacing.componentGap * 1.5,
          borderRadius: theme.borderRadius.lg,
          backgroundColor: `${theme.colors.accent}10`,
          border: `1px solid ${theme.colors.accent}40`,
          textAlign: 'center',
          transform: `translateX(${rightX}px)`,
        }}>
          <div style={{
            fontFamily: theme.typography.headingFont,
            fontWeight: theme.typography.headingWeight,
            fontSize: theme.typography.baseSize * 1.75,
            color: theme.colors.accent,
          }}>
            {familiar}
          </div>
          {familiarDesc && (
            <div style={{
              fontFamily: theme.typography.bodyFont,
              fontSize: theme.typography.baseSize,
              color: theme.colors.secondary,
              marginTop: theme.spacing.unit,
            }}>
              {familiarDesc}
            </div>
          )}
        </div>
      </div>

      {/* 相似维度说明 */}
      {similarity && (
        <div style={{
          fontFamily: theme.typography.bodyFont,
          fontSize: theme.typography.baseSize,
          color: theme.colors.secondary,
          textAlign: 'center',
          opacity: interpolate(frame, [25, 35], [0, 1], { extrapolateRight: 'clamp' }),
          fontStyle: 'italic',
        }}>
          {similarity}
        </div>
      )}
    </div>
  )
}
