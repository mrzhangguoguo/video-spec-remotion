import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'
import {
  CornerCrossGroup,
  TickRule,
  SceneBackground,
  useEntrance,
} from '../../styles'

interface BlackBoxProps {
  /** 主问题文字 */
  question?: string
  /** 左侧标签 */
  leftLabel?: string
  /** 右侧标签 */
  rightLabel?: string
  /** 中心编号（可选） */
  index?: string
  theme: DesignTokens
}

/**
 * broll-abstract.black-box — 黑盒
 *
 * DASHED accent 边框 + 四角 bracket 样式。
 * 中心 84px cond accent `?`，左右箭头 hairline + 强 hairline 尖三角。
 */
export const BlackBox: React.FC<BlackBoxProps> = ({
  question = '?',
  leftLabel,
  rightLabel,
  index,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const entrance = useEntrance(theme, 'fade')

  // 问号入场 — 弹簧
  const questionScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 200 },
  })

  // 箭头淡入
  const arrowOpacity = interpolate(frame, [12, 22], [0, 1], { extrapolateRight: 'clamp' })

  // 标签淡入
  const labelOpacity = interpolate(frame, [18, 28], [0, 1], { extrapolateRight: 'clamp' })

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

      {/* 左右标签 + 箭头 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.s3,
        width: '100%',
        justifyContent: 'center',
      }}>
        {/* 左标签 */}
        {leftLabel && (
          <div style={{
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.cap,
            letterSpacing: theme.typography.letterSpacing.caps,
            textTransform: 'uppercase',
            color: theme.colors.foregroundMuted,
            opacity: labelOpacity,
            textAlign: 'right',
            flex: 1,
          }}>
            {leftLabel}
          </div>
        )}

        {/* 左箭头 — hairline + 强 hairline 尖三角 */}
        <svg
          width="48"
          height="20"
          viewBox="0 0 48 20"
          style={{ opacity: arrowOpacity, flexShrink: 0 }}
        >
          <line x1="0" y1="10" x2="38" y2="10" stroke={theme.colors.line} strokeWidth={1} />
          <polygon points="38,4 48,10 38,16" fill={theme.colors.lineStrongest} />
        </svg>

        {/* 黑盒主体 — DASHED accent 边框 */}
        <div style={{
          width: 160,
          height: 160,
          border: `1px dashed ${theme.colors.accent}`,
          borderRadius: theme.borderRadius.sm,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
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
                width: 12,
                height: 12,
                ...corner,
              }}
            />
          ))}

          {/* 问号 — 84px cond accent */}
          <div style={{
            fontFamily: theme.typography.condensedFont,
            fontSize: 84,
            fontWeight: theme.typography.weight.heavy,
            color: theme.colors.accent,
            lineHeight: 1,
            transform: `scale(${questionScale})`,
          }}>
            {question}
          </div>

          {/* 编号（可选） */}
          {index && (
            <div style={{
              position: 'absolute',
              bottom: -20,
              fontFamily: theme.typography.monoFont,
              fontSize: theme.typography.scale.meta,
              letterSpacing: theme.typography.letterSpacing.mission,
              textTransform: 'uppercase',
              color: theme.colors.foregroundMuted,
            }}>
              {index}
            </div>
          )}
        </div>

        {/* 右箭头 — hairline + 强 hairline 尖三角 */}
        <svg
          width="48"
          height="20"
          viewBox="0 0 48 20"
          style={{ opacity: arrowOpacity, flexShrink: 0, transform: 'scaleX(-1)' }}
        >
          <line x1="0" y1="10" x2="38" y2="10" stroke={theme.colors.line} strokeWidth={1} />
          <polygon points="38,4 48,10 38,16" fill={theme.colors.lineStrongest} />
        </svg>

        {/* 右标签 */}
        {rightLabel && (
          <div style={{
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.cap,
            letterSpacing: theme.typography.letterSpacing.caps,
            textTransform: 'uppercase',
            color: theme.colors.foregroundMuted,
            opacity: labelOpacity,
            textAlign: 'left',
            flex: 1,
          }}>
            {rightLabel}
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
