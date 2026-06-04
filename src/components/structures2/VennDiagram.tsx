import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface VennCircle {
  label: string
  /** 是否主圆 */
  highlighted?: boolean
}

interface VennDiagramProps {
  /** 圆圈数据（2-3 个） */
  circles: VennCircle[]
  /** 交叉区域核心词 */
  soulWord?: string
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-structures2.venn — 维恩图
 *
 * 半透明圆填充 + hairline 描边。
 * 主圆 accent 18%，其他 white 6%，交叉中心 ★ + 灵魂词。
 */
export const VennDiagram: React.FC<VennDiagramProps> = ({
  circles,
  soulWord,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Position circles for 2 or 3 circle layout
  const getCircleLayout = () => {
    if (circles.length === 2) {
      return [
        { cx: 38, cy: 50, r: 150 },
        { cx: 62, cy: 50, r: 150 },
      ]
    }
    // 3 circles: triangle arrangement
    return [
      { cx: 50, cy: 35, r: 140 },
      { cx: 35, cy: 62, r: 140 },
      { cx: 65, cy: 62, r: 140 },
    ]
  }

  const layout = getCircleLayout()

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
      {/* SVG circles */}
      <svg style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
      }}>
        {circles.map((circle, i) => {
          const delay = i * 12
          const progress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, stiffness: 120 },
          })

          const l = layout[i]
          const fillColor = circle.highlighted
            ? theme.colors.accent
            : theme.colors.foreground
          const fillOpacity = circle.highlighted ? 0.18 : 0.06
          const strokeColor = circle.highlighted
            ? theme.colors.accent
            : theme.colors.lineStrong

          return (
            <circle
              key={i}
              cx={`${l.cx}%`}
              cy={`${l.cy}%`}
              r={l.r * progress}
              fill={fillColor}
              fillOpacity={fillOpacity}
              stroke={strokeColor}
              strokeWidth={1}
            />
          )
        })}

        {/* Circle labels */}
        {circles.map((circle, i) => {
          const delay = i * 12 + 5
          const progress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          const l = layout[i]
          // Position label at the non-overlapping edge
          const labelOffset = circles.length === 2
            ? (i === 0 ? -10 : 10)
            : (i === 0 ? 0 : (i === 1 ? -10 : 10))
          const labelYOffset = circles.length === 3 && i === 0 ? -12 : 8

          return (
            <text
              key={`label-${i}`}
              x={`${l.cx + labelOffset}%`}
              y={`${l.cy + labelYOffset}%`}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontFamily: theme.typography.sansFont,
                fontSize: theme.typography.scale.h4,
                fontWeight: circle.highlighted ? theme.typography.weight.heavy : theme.typography.weight.mid,
                fill: circle.highlighted ? theme.colors.accent : theme.colors.foregroundSecondary,
                opacity: progress,
              }}
            >
              {circle.label}
            </text>
          )
        })}
      </svg>

      {/* Soul word at intersection center */}
      {soulWord && (() => {
        const centerDelay = 25
        const centerProgress = spring({
          frame: Math.max(0, frame - centerDelay),
          fps,
          config: { damping: 8, stiffness: 200 },
        })

        // Center of intersection
        const centerX = circles.length === 2 ? 50 : 50
        const centerY = circles.length === 2 ? 50 : 53

        return (
          <div style={{
            position: 'absolute',
            left: `${centerX}%`,
            top: `${centerY}%`,
            transform: `translate(-50%, -50%) scale(${centerProgress})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: theme.spacing.s1,
            zIndex: 10,
            opacity: centerProgress,
          }}>
            <span style={{
              fontFamily: theme.typography.condensedFont,
              fontSize: theme.typography.scale.h1,
              color: theme.colors.accent,
              lineHeight: 1,
            }}>
              ★
            </span>
            <span style={{
              fontFamily: theme.typography.sansFont,
              fontSize: theme.typography.scale.h3,
              fontWeight: theme.typography.weight.heavy,
              color: theme.colors.accent,
              letterSpacing: theme.typography.letterSpacing.tight,
            }}>
              {soulWord}
            </span>
          </div>
        )
      })()}
    </div>
  )
}
