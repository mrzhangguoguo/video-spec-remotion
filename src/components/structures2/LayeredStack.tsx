import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface StackLayer {
  label: string
  /** 是否聚焦层 */
  focused?: boolean
}

interface LayeredStackProps {
  /** 层数据（从上到下） */
  layers: StackLayer[]
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-structures2.layered-stack — 分层堆叠
 *
 * 上窄下宽视觉（实际等高），左侧 L 编号 mono 递减。
 * 聚焦层 accent 边框。
 */
export const LayeredStack: React.FC<LayeredStackProps> = ({
  layers,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const layerCount = layers.length
  // Width percentages: top narrower, bottom wider (visual illusion)
  const widthRange = [55, 65, 75, 85, 95, 100]

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.s5,
      backgroundColor: theme.colors.background,
      gap: theme.spacing.s1,
    }}>
      {layers.map((layer, i) => {
        const delay = i * 10
        const progress = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 15, stiffness: 120 },
        })

        const widthPct = widthRange[Math.min(i, widthRange.length - 1)]
        const layerHeight = 52
        // L-number font size decreases top to bottom
        const lFontSize = interpolate(i, [0, layerCount - 1], [
          theme.typography.scale.h2,
          theme.typography.scale.body,
        ])

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              gap: theme.spacing.s2,
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
            }}
          >
            {/* L-numbering */}
            <div style={{
              fontFamily: theme.typography.monoFont,
              fontSize: lFontSize,
              fontWeight: theme.typography.weight.heavy,
              color: layer.focused ? theme.colors.accent : theme.colors.foregroundMuted,
              width: 60,
              textAlign: 'right',
              flexShrink: 0,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: theme.typography.lineHeight.tight,
            }}>
              L{i + 1}
            </div>

            {/* Layer bar */}
            <div style={{
              width: `${widthPct}%`,
              height: layerHeight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: layer.focused ? theme.colors.accent3 : theme.colors.surface,
              border: `1px solid ${layer.focused ? theme.colors.accent : theme.colors.line}`,
              borderRadius: theme.borderRadius.sm,
              fontFamily: theme.typography.sansFont,
              fontSize: theme.typography.scale.body,
              fontWeight: layer.focused ? theme.typography.weight.heavy : theme.typography.weight.regular,
              color: layer.focused ? theme.colors.accent : theme.colors.foreground,
              letterSpacing: theme.typography.letterSpacing.normal,
            }}>
              {layer.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
