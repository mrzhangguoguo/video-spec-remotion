import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion'
import type { DesignTokens } from '../../themes/_template'

interface VersusProps {
  /** 左侧方案名 */
  leftTitle: string
  /** 左侧描述 */
  leftDesc?: string
  /** 右侧方案名 */
  rightTitle: string
  /** 右侧描述 */
  rightDesc?: string
  /** 哪边被推荐（accent 强调） */
  recommended?: 'left' | 'right'
  /** 对比维度（可选） */
  dimensions?: Array<{ label: string; left: string; right: string }>
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-abstract.versus — 对照
 *
 * 两个方案左右等宽对比，中间 "vs"，每行对齐对照。
 */
export const Versus: React.FC<VersusProps> = ({
  leftTitle,
  leftDesc,
  rightTitle,
  rightDesc,
  recommended,
  dimensions,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // 左卡入场
  const leftSlide = spring({
    frame: Math.max(0, frame),
    fps,
    config: { damping: 18, stiffness: 120 },
  })
  const leftX = interpolate(leftSlide, [0, 1], [-80, 0])

  // 右卡入场（延迟）
  const rightSlide = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 18, stiffness: 120 },
  })
  const rightX = interpolate(rightSlide, [0, 1], [80, 0])

  // VS 淡入
  const vsOpacity = interpolate(frame, [10, 20], [0, 1], { extrapolateRight: 'clamp' })

  // 推荐侧 pulse
  const pulse = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 6, stiffness: 300 },
  })
  const pulseScale = recommended ? interpolate(pulse, [0, 0.5, 1], [1, 1.03, 1]) : 1

  const cardStyle = (side: 'left' | 'right'): React.CSSProperties => ({
    flex: 1,
    padding: theme.spacing.componentGap * 2,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: recommended === side ? `${theme.colors.accent}15` : theme.colors.card,
    border: `1px solid ${recommended === side ? theme.colors.accent : theme.colors.cardBorder}`,
    transform: `translateX(${side === 'left' ? leftX : rightX}px) scale(${recommended === side ? pulseScale : 1})`,
  })

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.scenePadding,
      backgroundColor: theme.colors.background,
      gap: theme.spacing.componentGap,
    }}>
      {/* 左卡 */}
      <div style={cardStyle('left')}>
        <h3 style={{
          fontFamily: theme.typography.headingFont,
          fontWeight: theme.typography.headingWeight,
          fontSize: theme.typography.baseSize * 1.75,
          color: recommended === 'left' ? theme.colors.accent : theme.colors.foreground,
          margin: 0,
        }}>
          {leftTitle}
        </h3>
        {leftDesc && (
          <p style={{
            fontFamily: theme.typography.bodyFont,
            fontSize: theme.typography.baseSize,
            color: theme.colors.secondary,
            marginTop: theme.spacing.unit,
          }}>
            {leftDesc}
          </p>
        )}
      </div>

      {/* VS */}
      <div style={{
        fontFamily: theme.typography.headingFont,
        fontWeight: 300,
        fontStyle: 'italic',
        fontSize: theme.typography.baseSize * 2,
        color: theme.colors.secondary,
        opacity: vsOpacity,
        flexShrink: 0,
      }}>
        vs
      </div>

      {/* 右卡 */}
      <div style={cardStyle('right')}>
        <h3 style={{
          fontFamily: theme.typography.headingFont,
          fontWeight: theme.typography.headingWeight,
          fontSize: theme.typography.baseSize * 1.75,
          color: recommended === 'right' ? theme.colors.accent : theme.colors.foreground,
          margin: 0,
        }}>
          {rightTitle}
        </h3>
        {rightDesc && (
          <p style={{
            fontFamily: theme.typography.bodyFont,
            fontSize: theme.typography.baseSize,
            color: theme.colors.secondary,
            marginTop: theme.spacing.unit,
          }}>
            {rightDesc}
          </p>
        )}
      </div>
    </div>
  )
}
