import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface Spoke {
  label: string
  /** 是否关键连接（实线 vs 虚线） */
  key?: boolean
}

interface HubSpokeProps {
  /** 中心标签 */
  hubLabel: string
  /** 辐条数据（最多 6 条） */
  spokes: Spoke[]
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-structures2.hub-spoke — 中心辐射
 *
 * 中心实心 accent 圆 80px 居中，6 条辐条。
 * 关键连接实线，其他虚线。
 */
export const HubSpoke: React.FC<HubSpokeProps> = ({
  hubLabel,
  spokes,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const spokeCount = Math.min(spokes.length, 6)
  const angleStep = 360 / spokeCount
  const spokeLength = 180

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.s5,
      backgroundColor: theme.colors.background,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* SVG spokes */}
      <svg style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
      }}>
        {spokes.slice(0, spokeCount).map((spoke, i) => {
          const angle = (angleStep * i - 90) * (Math.PI / 180)
          const delay = 8 + i * 6
          const lineProgress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          const endX = 50 + Math.cos(angle) * (spokeLength / 5) * lineProgress
          const endY = 50 + Math.sin(angle) * (spokeLength / 5) * lineProgress

          return (
            <line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${endX}%`}
              y2={`${endY}%`}
              stroke={spoke.key ? theme.colors.accent : theme.colors.lineStrong}
              strokeWidth={spoke.key ? 2 : 1}
              strokeDasharray={spoke.key ? 'none' : '6 4'}
            />
          )
        })}
      </svg>

      {/* Spoke labels */}
      {spokes.slice(0, spokeCount).map((spoke, i) => {
        const angle = (angleStep * i - 90) * (Math.PI / 180)
        const delay = 12 + i * 6
        const progress = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 15, stiffness: 120 },
        })

        const labelDist = spokeLength + 30
        const x = 50 + Math.cos(angle) * (labelDist / 5) * progress
        const y = 50 + Math.sin(angle) * (labelDist / 5) * progress

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              fontFamily: theme.typography.monoFont,
              fontSize: theme.typography.scale.small,
              fontWeight: spoke.key ? theme.typography.weight.heavy : theme.typography.weight.regular,
              color: spoke.key ? theme.colors.accent : theme.colors.foregroundSecondary,
              whiteSpace: 'nowrap',
              textAlign: 'center',
              opacity: progress,
            }}
          >
            {spoke.label}
          </div>
        )
      })}

      {/* Center hub circle */}
      {(() => {
        const hubProgress = spring({
          frame,
          fps,
          config: { damping: 12, stiffness: 150 },
        })

        return (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: theme.colors.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transform: `translate(-50%, -50%) scale(${hubProgress})`,
          }}>
            <span style={{
              fontFamily: theme.typography.sansFont,
              fontSize: theme.typography.scale.small,
              fontWeight: theme.typography.weight.heavy,
              color: theme.colors.background,
              textAlign: 'center',
              lineHeight: theme.typography.lineHeight.tight,
              padding: theme.spacing.s1,
            }}>
              {hubLabel}
            </span>
          </div>
        )
      })()}
    </div>
  )
}
