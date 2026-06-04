import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'
import {
  CornerCrossGroup,
  TickRule,
  SceneBackground,
  useEntrance,
} from '../../styles'

interface SpectrumProps {
  /** 标记位置 0-1 */
  marker: number
  /** 标记标签 */
  markerLabel: string
  /** 左极标签（默认白色） */
  leftPole?: string
  /** 右极标签（默认 accent meta） */
  rightPole?: string
  /** 中线标签（可选） */
  centerLabel?: string
  theme: DesignTokens
}

/**
 * broll-abstract.spectrum — 光谱轴
 *
 * 0-1 轴，11 个刻度（5n 为主刻度）。
 * 标记为倒三角 accent + mono 标签在上方。
 * 左极白 / 右极 accent meta。
 */
export const Spectrum: React.FC<SpectrumProps> = ({
  marker,
  markerLabel,
  leftPole = '0',
  rightPole = '1',
  centerLabel,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const entrance = useEntrance(theme, 'enter-up')

  // 标记入场 — 弹簧弹入
  const markerProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 10, stiffness: 200 },
  })

  // 标签淡入
  const labelOpacity = interpolate(frame, [20, 30], [0, 1], { extrapolateRight: 'clamp' })

  // 轴线绘制
  const axisProgress = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })

  const ticks = 11
  const axisWidth = '70%'

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

      {/* 标记标签 — 在轴上方 */}
      <div style={{
        fontFamily: theme.typography.monoFont,
        fontSize: theme.typography.scale.body,
        fontWeight: theme.typography.weight.mid,
        color: theme.colors.accent,
        marginBottom: theme.spacing.s2,
        opacity: labelOpacity,
        letterSpacing: theme.typography.letterSpacing.caps,
        textTransform: 'uppercase',
      }}>
        {markerLabel}
      </div>

      {/* 倒三角标记 */}
      <div style={{
        width: 0,
        height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: `10px solid ${theme.colors.accent}`,
        marginBottom: 4,
        // 定位到轴上 marker 位置
        marginLeft: `calc(-35% + ${marker * 100}% * 0.7)`,
        opacity: markerProgress,
        transform: `translateY(${interpolate(markerProgress, [0, 1], [-10, 0])}px)`,
      }} />

      {/* 轴线 + 刻度 */}
      <div style={{
        width: axisWidth,
        position: 'relative',
        transform: `scaleX(${axisProgress})`,
        transformOrigin: 'left',
      }}>
        {/* 主轴线 */}
        <div style={{
          width: '100%',
          height: 1,
          backgroundColor: theme.colors.lineStrong,
        }} />

        {/* 刻度 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          {Array.from({ length: ticks }, (_, i) => {
            const isMajor = i % 5 === 0
            return (
              <div
                key={i}
                style={{
                  width: 1,
                  height: isMajor ? 12 : 6,
                  backgroundColor: isMajor ? theme.colors.foregroundMuted : theme.colors.line,
                  transform: 'translateY(-50%)',
                }}
              />
            )
          })}
        </div>
      </div>

      {/* 极点标签 */}
      <div style={{
        width: axisWidth,
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing.s1,
      }}>
        <div style={{
          fontFamily: theme.typography.monoFont,
          fontSize: theme.typography.scale.cap,
          letterSpacing: theme.typography.letterSpacing.caps,
          textTransform: 'uppercase',
          color: theme.colors.foreground,
          opacity: labelOpacity,
        }}>
          {leftPole}
        </div>
        {centerLabel && (
          <div style={{
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.cap,
            letterSpacing: theme.typography.letterSpacing.caps,
            textTransform: 'uppercase',
            color: theme.colors.foregroundMuted,
            opacity: labelOpacity,
          }}>
            {centerLabel}
          </div>
        )}
        <div style={{
          fontFamily: theme.typography.monoFont,
          fontSize: theme.typography.scale.cap,
          letterSpacing: theme.typography.letterSpacing.caps,
          textTransform: 'uppercase',
          color: theme.colors.accent,
          opacity: labelOpacity,
        }}>
          {rightPole}
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
