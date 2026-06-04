import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'
import {
  CornerCrossGroup,
  TickRule,
  SceneBackground,
  useEntrance,
  useCountUp,
} from '../../styles'

interface BigNumberProps {
  /** 数值 */
  value: number
  /** 单位（如 "%"、"x"、"ms"） */
  unit?: string
  /** 标题说明 */
  caption?: string
  /** 左侧发现标签 */
  finding?: string
  /** 右侧方法标签 */
  method?: string
  /** 底部连接说明 */
  connector?: string
  theme: DesignTokens
}

/**
 * broll-hero.big-number — 大数字
 *
 * Number cond 280-360px accent tabular-nums。
 * unit 0.32em white superscript 0.6em。
 * caption 28/800 + 32×2px accent dash。
 * chrome = left finding / right method / bottom dashed connector。
 */
export const BigNumber: React.FC<BigNumberProps> = ({
  value,
  unit,
  caption,
  finding,
  method,
  connector,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const entrance = useEntrance(theme, 'slam')

  // 数字计数动画
  const displayValue = useCountUp(value, 30)

  // chrome 标签淡入
  const chromeOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' })

  // caption 入场
  const captionProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 12, stiffness: 150 },
  })

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

      {/* 左侧 finding */}
      {finding && (
        <div style={{
          position: 'absolute',
          top: '30%',
          left: theme.spacing.s3,
          fontFamily: theme.typography.monoFont,
          fontSize: theme.typography.scale.cap,
          letterSpacing: theme.typography.letterSpacing.caps,
          textTransform: 'uppercase',
          color: theme.colors.foregroundMuted,
          opacity: chromeOpacity,
          transform: 'rotate(-90deg)',
          transformOrigin: 'left center',
        }}>
          {finding}
        </div>
      )}

      {/* 右侧 method */}
      {method && (
        <div style={{
          position: 'absolute',
          top: '30%',
          right: theme.spacing.s3,
          fontFamily: theme.typography.monoFont,
          fontSize: theme.typography.scale.cap,
          letterSpacing: theme.typography.letterSpacing.caps,
          textTransform: 'uppercase',
          color: theme.colors.foregroundMuted,
          opacity: chromeOpacity,
          transform: 'rotate(90deg)',
          transformOrigin: 'right center',
        }}>
          {method}
        </div>
      )}

      {/* 主数字 — cond 280-360px accent */}
      <div style={{
        fontFamily: theme.typography.condensedFont,
        fontSize: 320,
        fontWeight: theme.typography.weight.heavy,
        color: theme.colors.accent,
        lineHeight: 0.86,
        letterSpacing: '-0.04em',
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum" 1',
        display: 'flex',
        alignItems: 'baseline',
      }}>
        {displayValue}
        {/* 单位 — 0.32em white superscript 0.6em */}
        {unit && (
          <span style={{
            fontSize: '0.32em',
            color: theme.colors.foreground,
            verticalAlign: 'super',
            marginLeft: '0.1em',
            fontWeight: theme.typography.weight.bold,
          }}>
            {unit}
          </span>
        )}
      </div>

      {/* caption — 28/800 + accent dash */}
      {caption && (
        <div style={{
          marginTop: theme.spacing.s3,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.s2,
          opacity: captionProgress,
          transform: `translateY(${interpolate(captionProgress, [0, 1], [10, 0])}px)`,
        }}>
          {/* 32×2px accent dash */}
          <div style={{ width: 32, height: 2, backgroundColor: theme.colors.accent }} />

          <span style={{
            fontFamily: theme.typography.chineseFont,
            fontSize: 28,
            fontWeight: theme.typography.weight.heavy,
            color: theme.colors.foreground,
          }}>
            {caption}
          </span>
        </div>
      )}

      {/* 底部 dashed connector */}
      {connector && (
        <div style={{
          position: 'absolute',
          bottom: theme.spacing.s4,
          left: '20%',
          right: '20%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: chromeOpacity,
        }}>
          <div style={{
            width: '100%',
            height: 0,
            borderTop: `1px dashed ${theme.colors.lineStrong}`,
          }} />
          <div style={{
            marginTop: theme.spacing.s1,
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.small,
            letterSpacing: theme.typography.letterSpacing.caps,
            textTransform: 'uppercase',
            color: theme.colors.foregroundMuted,
            textAlign: 'center',
          }}>
            {connector}
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
