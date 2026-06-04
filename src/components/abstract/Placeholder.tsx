import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'
import {
  CornerCrossGroup,
  TickRule,
  SceneBackground,
  useEntrance,
} from '../../styles'

interface PlaceholderProps {
  /** 占位文字（默认 "[ DROP HERE ]"） */
  label?: string
  /** 宽度（如 "1920px"、"100%"） */
  dimensions?: string
  /** 时长（如 "3s"、"90 frames"） */
  duration?: string
  /** 编码格式（如 "H.264"、"ProRes"） */
  codec?: string
  theme: DesignTokens
}

/**
 * broll-abstract.placeholder — 占位框
 *
 * 45° 斜条纹底（4% 白）+ 1px strong hairline 边框 + 四角 bracket。
 * `[ DROP HERE ]` mono caps accent。
 * 底部注明 dimensions / duration / codec。
 */
export const Placeholder: React.FC<PlaceholderProps> = ({
  label = '[ DROP HERE ]',
  dimensions,
  duration,
  codec,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const entrance = useEntrance(theme, 'fade')

  // 标签 pulse
  const labelScale = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 6, stiffness: 300 },
  })

  // meta 信息淡入
  const metaOpacity = interpolate(frame, [15, 25], [0, 1], { extrapolateRight: 'clamp' })

  const metaItems = [dimensions, duration, codec].filter(Boolean)

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

      {/* 占位框主体 */}
      <div style={{
        width: '70%',
        height: '60%',
        position: 'relative',
        border: `1px solid ${theme.colors.lineStrong}`,
        borderRadius: theme.borderRadius.sm,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          rgba(255,255,255,0.04) 10px,
          rgba(255,255,255,0.04) 20px
        )`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.s3,
      }}>
        {/* 四角 bracket 装饰 */}
        {[
          { top: -1, left: -1, borderTop: `1px solid ${theme.colors.lineStrongest}`, borderLeft: `1px solid ${theme.colors.lineStrongest}` },
          { top: -1, right: -1, borderTop: `1px solid ${theme.colors.lineStrongest}`, borderRight: `1px solid ${theme.colors.lineStrongest}` },
          { bottom: -1, left: -1, borderBottom: `1px solid ${theme.colors.lineStrongest}`, borderLeft: `1px solid ${theme.colors.lineStrongest}` },
          { bottom: -1, right: -1, borderBottom: `1px solid ${theme.colors.lineStrongest}`, borderRight: `1px solid ${theme.colors.lineStrongest}` },
        ].map((corner, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 14,
              height: 14,
              ...corner,
            }}
          />
        ))}

        {/* 主标签 — mono caps accent */}
        <div style={{
          fontFamily: theme.typography.monoFont,
          fontSize: theme.typography.scale.h2,
          fontWeight: theme.typography.weight.mid,
          letterSpacing: theme.typography.letterSpacing.caps,
          textTransform: 'uppercase',
          color: theme.colors.accent,
          transform: `scale(${interpolate(labelScale, [0, 0.5, 1], [0.95, 1.02, 1])})`,
        }}>
          {label}
        </div>

        {/* meta 信息 */}
        {metaItems.length > 0 && (
          <div style={{
            display: 'flex',
            gap: theme.spacing.s3,
            opacity: metaOpacity,
          }}>
            {metaItems.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span style={{
                    color: theme.colors.line,
                    fontFamily: theme.typography.monoFont,
                    fontSize: theme.typography.scale.meta,
                  }}>
                    /
                  </span>
                )}
                <span style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: theme.typography.scale.small,
                  letterSpacing: theme.typography.letterSpacing.caps,
                  textTransform: 'uppercase',
                  color: theme.colors.foregroundMuted,
                }}>
                  {item}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

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
