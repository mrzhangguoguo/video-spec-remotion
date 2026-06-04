import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface MatrixItem {
  label: string
  /** 象限索引 0-3: TL, TR, BL, BR */
  quadrant: number
  highlighted?: boolean
}

interface Matrix2x2Props {
  /** 象限标签 [TL, TR, BL, BR] */
  quadrantLabels: [string, string, string, string]
  /** 数据点 */
  items: MatrixItem[]
  /** 理想象限索引（显示 ★） */
  idealQuadrant?: number
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-structures2.matrix-2x2 — 2x2 矩阵
 *
 * 十字 hairline 轴 + 象限角标。
 * 点 = 色块 + 标签，关键项 accent+800，理想象限 ★。
 */
export const Matrix2x2: React.FC<Matrix2x2Props> = ({
  quadrantLabels,
  items,
  idealQuadrant,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Axis entrance
  const hLineProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  })
  const vLineProgress = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 20, stiffness: 100 },
  })

  // Quadrant positions (percent-based)
  const quadrantPositions = [
    { x: 25, y: 25 }, // TL
    { x: 75, y: 25 }, // TR
    { x: 25, y: 75 }, // BL
    { x: 75, y: 75 }, // BR
  ]

  const cornerPositions = [
    { x: 2, y: 2 },   // TL
    { x: 98, y: 2 },  // TR
    { x: 2, y: 98 },  // BL
    { x: 98, y: 98 }, // BR
  ]

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
    }}>
      {/* Quadrant corner labels */}
      {quadrantLabels.map((label, i) => {
        const pos = cornerPositions[i]
        const labelDelay = 15 + i * 5
        const labelProgress = spring({
          frame: Math.max(0, frame - labelDelay),
          fps,
          config: { damping: 15, stiffness: 120 },
        })

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(${i % 2 === 0 ? '0' : '-100%'}, ${i < 2 ? '0' : '-100%'})`,
              fontFamily: theme.typography.monoFont,
              fontSize: theme.typography.scale.cap,
              letterSpacing: theme.typography.letterSpacing.caps,
              textTransform: 'uppercase',
              color: theme.colors.foregroundMuted,
              opacity: labelProgress,
            }}
          >
            {label}
            {idealQuadrant === i && (
              <span style={{ color: theme.colors.accent, marginLeft: 4 }}>★</span>
            )}
          </div>
        )
      })}

      {/* Horizontal axis */}
      <div style={{
        position: 'absolute',
        left: '10%',
        right: '10%',
        top: '50%',
        height: 1,
        backgroundColor: theme.colors.lineStrong,
        transform: `scaleX(${hLineProgress})`,
        transformOrigin: 'center',
      }} />

      {/* Vertical axis */}
      <div style={{
        position: 'absolute',
        top: '10%',
        bottom: '10%',
        left: '50%',
        width: 1,
        backgroundColor: theme.colors.lineStrong,
        transform: `scaleY(${vLineProgress})`,
        transformOrigin: 'center',
      }} />

      {/* Data points */}
      {items.map((item, i) => {
        const qPos = quadrantPositions[item.quadrant]
        const delay = 20 + i * 6
        const progress = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 12, stiffness: 150 },
        })

        // Spread items within quadrant
        const angle = (i * 137.5) % 360
        const spread = 8
        const offsetX = Math.cos(angle * Math.PI / 180) * spread
        const offsetY = Math.sin(angle * Math.PI / 180) * spread

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${qPos.x + offsetX}%`,
              top: `${qPos.y + offsetY}%`,
              transform: `translate(-50%, -50%) scale(${progress})`,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.s1,
              opacity: progress,
            }}
          >
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: item.highlighted ? theme.colors.accent : theme.colors.foregroundSecondary,
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: theme.typography.monoFont,
              fontSize: theme.typography.scale.small,
              fontWeight: item.highlighted ? theme.typography.weight.heavy : theme.typography.weight.regular,
              color: item.highlighted ? theme.colors.accent : theme.colors.foreground,
              whiteSpace: 'nowrap',
            }}>
              {item.label}
            </span>
          </div>
        )
      })}

      {/* Ideal quadrant star */}
      {idealQuadrant !== undefined && (() => {
        const starPos = quadrantPositions[idealQuadrant]
        const starDelay = 35
        const starProgress = spring({
          frame: Math.max(0, frame - starDelay),
          fps,
          config: { damping: 6, stiffness: 200 },
        })
        return (
          <div style={{
            position: 'absolute',
            left: `${starPos.x}%`,
            top: `${starPos.y}%`,
            transform: `translate(-50%, -50%) scale(${starProgress})`,
            fontFamily: theme.typography.condensedFont,
            fontSize: theme.typography.scale.display,
            color: theme.colors.accent2,
            opacity: starProgress,
            pointerEvents: 'none',
          }}>
            ★
          </div>
        )
      })()}
    </div>
  )
}
