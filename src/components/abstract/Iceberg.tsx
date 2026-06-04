import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'
import {
  CornerCrossGroup,
  TickRule,
  SceneBackground,
  useEntrance,
} from '../../styles'

interface IcebergProps {
  /** 水面以上比例文字（默认 "10%"） */
  aboveLabel?: string
  /** 水面以下比例文字（默认 "90%"） */
  belowLabel?: string
  /** 水面线标签（默认 "WATERLINE"） */
  waterlineLabel?: string
  /** 水面上标题 */
  aboveTitle?: string
  /** 水面下标题 */
  belowTitle?: string
  theme: DesignTokens
}

/**
 * broll-abstract.iceberg — 冰山图
 *
 * 水面线 accent dashed + WATERLINE 标签。
 * 水面上：solid line accent + "10%" 标签。
 * 水面下：dashed + light fill grayscale + "90%" 标签。
 */
export const Iceberg: React.FC<IcebergProps> = ({
  aboveLabel = '10%',
  belowLabel = '90%',
  waterlineLabel = 'WATERLINE',
  aboveTitle,
  belowTitle,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const entrance = useEntrance(theme, 'enter-up')

  // 水面上部分入场
  const aboveProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  })

  // 水面线绘制
  const waterlineProgress = interpolate(frame, [8, 20], [0, 1], { extrapolateRight: 'clamp' })

  // 水面下部分入场（延迟）
  const belowProgress = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 15, stiffness: 100 },
  })

  // 标签淡入
  const labelOpacity = interpolate(frame, [20, 30], [0, 1], { extrapolateRight: 'clamp' })

  const icebergHeight = 400
  const aboveHeight = icebergHeight * 0.15
  const belowHeight = icebergHeight * 0.85

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

      {/* 冰山容器 */}
      <div style={{
        position: 'relative',
        width: 300,
        height: icebergHeight,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* 水面以上 — solid accent 边框 */}
        <div style={{
          height: aboveHeight,
          border: `1px solid ${theme.colors.accent}`,
          borderBottom: 'none',
          borderRadius: `${theme.borderRadius.sm}px ${theme.borderRadius.sm}px 0 0`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          opacity: aboveProgress,
          transform: `translateY(${interpolate(aboveProgress, [0, 1], [20, 0])}px)`,
        }}>
          {aboveTitle && (
            <div style={{
              fontFamily: theme.typography.sansFont,
              fontSize: theme.typography.scale.body,
              fontWeight: theme.typography.weight.mid,
              color: theme.colors.foreground,
              textAlign: 'center',
            }}>
              {aboveTitle}
            </div>
          )}

          {/* 比例标签 — 右侧 */}
          <div style={{
            position: 'absolute',
            right: -60,
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.h3,
            fontWeight: theme.typography.weight.heavy,
            color: theme.colors.accent,
            opacity: labelOpacity,
          }}>
            {aboveLabel}
          </div>
        </div>

        {/* 水面线 — accent dashed */}
        <div style={{
          position: 'relative',
          height: 0,
          borderTop: `1px dashed ${theme.colors.accent}`,
          transform: `scaleX(${waterlineProgress})`,
          transformOrigin: 'left',
          zIndex: 2,
        }}>
          {/* WATERLINE 标签 */}
          <div style={{
            position: 'absolute',
            top: -16,
            left: 0,
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.meta,
            letterSpacing: theme.typography.letterSpacing.mission,
            textTransform: 'uppercase',
            color: theme.colors.accent,
            opacity: labelOpacity,
          }}>
            {waterlineLabel}
          </div>
        </div>

        {/* 水面以下 — dashed + light fill */}
        <div style={{
          height: belowHeight,
          border: `1px dashed ${theme.colors.lineStrong}`,
          borderTop: 'none',
          borderRadius: `0 0 ${theme.borderRadius.sm}px ${theme.borderRadius.sm}px`,
          backgroundColor: theme.colors.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          opacity: belowProgress,
          transform: `translateY(${interpolate(belowProgress, [0, 1], [-20, 0])}px)`,
        }}>
          {belowTitle && (
            <div style={{
              fontFamily: theme.typography.sansFont,
              fontSize: theme.typography.scale.h2,
              fontWeight: theme.typography.weight.heavy,
              color: theme.colors.foregroundSecondary,
              textAlign: 'center',
            }}>
              {belowTitle}
            </div>
          )}

          {/* 比例标签 — 右侧 */}
          <div style={{
            position: 'absolute',
            right: -60,
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.h3,
            fontWeight: theme.typography.weight.heavy,
            color: theme.colors.foregroundMuted,
            opacity: labelOpacity,
          }}>
            {belowLabel}
          </div>
        </div>
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
