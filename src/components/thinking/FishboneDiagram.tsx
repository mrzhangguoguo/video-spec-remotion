import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface CauseCategory {
  label: string
  /** 子原因 */
  causes: string[]
  /** 是否主因（accent） */
  main?: boolean
}

interface FishboneDiagramProps {
  /** 问题描述（鱼头） */
  problem: string
  /** 6 大原因分类 */
  categories: CauseCategory[]
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-thinking.fishbone — 鱼骨图
 *
 * 水平主干线，鱼头=问题在右，鱼尾在左。
 * 6 大原因分类斜向切入，主因 accent，小刺 14px。
 */
export const FishboneDiagram: React.FC<FishboneDiagramProps> = ({
  problem,
  categories,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const trunkY = 50 // percent from top
  const trunkLeft = 8
  const trunkRight = 85
  const categoryCount = Math.min(categories.length, 6)

  // Trunk entrance
  const trunkProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  })

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.s4,
      backgroundColor: theme.colors.background,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* SVG for lines */}
      <svg style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
      }}>
        {/* Main trunk */}
        <line
          x1={`${trunkLeft}%`}
          y1={`${trunkY}%`}
          x2={`${trunkLeft + (trunkRight - trunkLeft) * trunkProgress}%`}
          y2={`${trunkY}%`}
          stroke={theme.colors.foregroundSecondary}
          strokeWidth={2}
        />

        {/* Fish head arrow */}
        <polygon
          points={`${trunkRight},${trunkY} ${trunkRight - 3},${trunkY - 3} ${trunkRight - 3},${trunkY + 3}`}
          fill={theme.colors.foregroundSecondary}
          opacity={trunkProgress}
        />

        {/* Category spines */}
        {categories.slice(0, categoryCount).map((cat, i) => {
          const delay = 10 + i * 8
          const spineProgress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          // Alternate above/below trunk
          const isAbove = i % 2 === 0
          const xPos = trunkLeft + 12 + i * ((trunkRight - trunkLeft - 15) / categoryCount)
          const angle = isAbove ? -45 : 45
          const spineLen = 80 * spineProgress
          const endX = xPos + Math.cos(angle * Math.PI / 180) * spineLen * 0.5
          const endY = trunkY + Math.sin(angle * Math.PI / 180) * spineLen * 0.5

          const spineColor = cat.main ? theme.colors.accent : theme.colors.lineStrong

          return (
            <React.Fragment key={i}>
              {/* Spine line */}
              <line
                x1={`${xPos}%`}
                y1={`${trunkY}%`}
                x2={`${endX}%`}
                y2={`${endY}%`}
                stroke={spineColor}
                strokeWidth={cat.main ? 2 : 1}
              />

              {/* Cause barbs */}
              {cat.causes.map((cause, ci) => {
                const barbDelay = delay + 5 + ci * 4
                const barbProgress = spring({
                  frame: Math.max(0, frame - barbDelay),
                  fps,
                  config: { damping: 15, stiffness: 120 },
                })

                const barbFraction = 0.3 + ci * 0.25
                const barbX = xPos + (endX - xPos) * barbFraction
                const barbY = trunkY + (endY - trunkY) * barbFraction
                const barbAngle = isAbove ? -20 : 20
                const barbLen = 30 * barbProgress
                const barbEndX = barbX + Math.cos(barbAngle * Math.PI / 180) * barbLen * 0.4
                const barbEndY = barbY + Math.sin(barbAngle * Math.PI / 180) * barbLen * 0.4

                return (
                  <line
                    key={ci}
                    x1={`${barbX}%`}
                    y1={`${barbY}%`}
                    x2={`${barbEndX}%`}
                    y2={`${barbEndY}%`}
                    stroke={cat.main ? theme.colors.accent : theme.colors.line}
                    strokeWidth={1}
                    opacity={barbProgress}
                  />
                )
              })}
            </React.Fragment>
          )
        })}
      </svg>

      {/* Problem label (fish head) */}
      <div style={{
        position: 'absolute',
        right: '2%',
        top: `${trunkY}%`,
        transform: 'translateY(-50%)',
        fontFamily: theme.typography.sansFont,
        fontSize: theme.typography.scale.h3,
        fontWeight: theme.typography.weight.heavy,
        color: theme.colors.foreground,
        opacity: trunkProgress,
        textAlign: 'right',
        maxWidth: '15%',
      }}>
        {problem}
      </div>

      {/* Category labels */}
      {categories.slice(0, categoryCount).map((cat, i) => {
        const delay = 10 + i * 8
        const labelProgress = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 15, stiffness: 120 },
        })

        const isAbove = i % 2 === 0
        const xPos = trunkLeft + 12 + i * ((trunkRight - trunkLeft - 15) / categoryCount)
        const angle = isAbove ? -45 : 45
        const labelDist = 100
        const lx = xPos + Math.cos(angle * Math.PI / 180) * labelDist * 0.5
        const ly = trunkY + Math.sin(angle * Math.PI / 180) * labelDist * 0.5

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${lx}%`,
              top: `${ly}%`,
              transform: 'translate(-50%, -50%)',
              fontFamily: theme.typography.monoFont,
              fontSize: theme.typography.scale.small,
              fontWeight: cat.main ? theme.typography.weight.heavy : theme.typography.weight.mid,
              color: cat.main ? theme.colors.accent : theme.colors.foregroundSecondary,
              letterSpacing: theme.typography.letterSpacing.caps,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              opacity: labelProgress,
            }}
          >
            {cat.label}
          </div>
        )
      })}

      {/* Cause text labels */}
      {categories.slice(0, categoryCount).map((cat, i) => {
        const isAbove = i % 2 === 0
        const xPos = trunkLeft + 12 + i * ((trunkRight - trunkLeft - 15) / categoryCount)

        return cat.causes.map((cause, ci) => {
          const barbDelay = 10 + i * 8 + 5 + ci * 4
          const barbProgress = spring({
            frame: Math.max(0, frame - barbDelay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          const angle = isAbove ? -45 : 45
          const spineLen = 80
          const endX = xPos + Math.cos(angle * Math.PI / 180) * spineLen * 0.5
          const endY = trunkY + Math.sin(angle * Math.PI / 180) * spineLen * 0.5
          const barbFraction = 0.3 + ci * 0.25
          const barbAngle = isAbove ? -20 : 20
          const barbLen = 30
          const bx = xPos + (endX - xPos) * barbFraction + Math.cos(barbAngle * Math.PI / 180) * barbLen * 0.5
          const by = trunkY + (endY - trunkY) * barbFraction + Math.sin(barbAngle * Math.PI / 180) * barbLen * 0.5

          return (
            <div
              key={`${i}-${ci}`}
              style={{
                position: 'absolute',
                left: `${bx}%`,
                top: `${by}%`,
                transform: 'translate(-50%, -50%)',
                fontFamily: theme.typography.sansFont,
                fontSize: 14,
                color: cat.main ? theme.colors.accent : theme.colors.foregroundMuted,
                whiteSpace: 'nowrap',
                opacity: barbProgress,
              }}
            >
              {cause}
            </div>
          )
        })
      })}
    </div>
  )
}
