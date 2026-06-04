import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface MindMapBranch {
  label: string
  children?: string[]
}

interface MindMapProps {
  /** 中心主题 */
  center: string
  /** 一级分支 */
  branches: MindMapBranch[]
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-structures2.mind-map — 思维导图
 *
 * 中心实心 accent 圆 + 反白文字。
 * 一级 800 重，二级 14px，主分支均匀放射。
 */
export const MindMap: React.FC<MindMapProps> = ({ center, branches, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const branchCount = branches.length
  const angleStep = 360 / branchCount
  const radius = 220
  const cx = 50 // percent
  const cy = 50 // percent

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* SVG lines from center to branches */}
      <svg style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}>
        {branches.map((_, bi) => {
          const angle = (angleStep * bi - 90) * (Math.PI / 180)
          const delay = 10 + bi * 8
          const lineProgress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          const endX = cx + Math.cos(angle) * (radius / 10) * lineProgress
          const endY = cy + Math.sin(angle) * (radius / 10) * lineProgress

          return (
            <line
              key={bi}
              x1={`${cx}%`}
              y1={`${cy}%`}
              x2={`${endX}%`}
              y2={`${endY}%`}
              stroke={theme.colors.lineStrong}
              strokeWidth={1}
            />
          )
        })}

        {/* Sub-branch lines */}
        {branches.map((branch, bi) => {
          if (!branch.children) return null
          const angle = (angleStep * bi - 90) * (Math.PI / 180)
          const bx = cx + Math.cos(angle) * (radius / 10)
          const by = cy + Math.sin(angle) * (radius / 10)

          return branch.children.map((_, ci) => {
            const subAngle = angle + (ci - (branch.children!.length - 1) / 2) * 0.35
            const subRadius = 6
            const subDelay = 20 + bi * 8 + ci * 4
            const subProgress = spring({
              frame: Math.max(0, frame - subDelay),
              fps,
              config: { damping: 15, stiffness: 120 },
            })

            const ex = bx + Math.cos(subAngle) * subRadius * subProgress
            const ey = by + Math.sin(subAngle) * subRadius * subProgress

            return (
              <line
                key={`${bi}-${ci}`}
                x1={`${bx}%`}
                y1={`${by}%`}
                x2={`${ex}%`}
                y2={`${ey}%`}
                stroke={theme.colors.line}
                strokeWidth={1}
              />
            )
          })
        })}
      </svg>

      {/* Center circle */}
      {(() => {
        const centerProgress = spring({
          frame,
          fps,
          config: { damping: 12, stiffness: 150 },
        })
        return (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: theme.colors.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transform: `translate(-50%, -50%) scale(${centerProgress})`,
          }}>
            <span style={{
              fontFamily: theme.typography.sansFont,
              fontSize: theme.typography.scale.body,
              fontWeight: theme.typography.weight.heavy,
              color: theme.colors.background,
              textAlign: 'center',
              lineHeight: theme.typography.lineHeight.tight,
              padding: theme.spacing.s1,
            }}>
              {center}
            </span>
          </div>
        )
      })()}

      {/* Branch nodes */}
      {branches.map((branch, bi) => {
        const angle = (angleStep * bi - 90) * (Math.PI / 180)
        const delay = 10 + bi * 8
        const branchProgress = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 15, stiffness: 120 },
        })

        const xPct = cx + Math.cos(angle) * (radius / 10) * branchProgress
        const yPct = cy + Math.sin(angle) * (radius / 10) * branchProgress

        return (
          <React.Fragment key={bi}>
            {/* Branch label */}
            <div style={{
              position: 'absolute',
              left: `${xPct}%`,
              top: `${yPct}%`,
              transform: 'translate(-50%, -50%)',
              fontFamily: theme.typography.sansFont,
              fontSize: theme.typography.scale.h4,
              fontWeight: theme.typography.weight.heavy,
              color: theme.colors.foreground,
              whiteSpace: 'nowrap',
              padding: `${theme.spacing.s1}px ${theme.spacing.s2}px`,
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.line}`,
              borderRadius: theme.borderRadius.sm,
              opacity: branchProgress,
              zIndex: 5,
            }}>
              {branch.label}
            </div>

            {/* Sub-branches */}
            {branch.children?.map((child, ci) => {
              const subDelay = delay + 10 + ci * 5
              const subProgress = spring({
                frame: Math.max(0, frame - subDelay),
                fps,
                config: { damping: 15, stiffness: 120 },
              })

              const subAngle = angle + (ci - (branch.children!.length - 1) / 2) * 0.35
              const subRadius = 60
              const sx = xPct + Math.cos(subAngle) * (subRadius / 10) * subProgress
              const sy = yPct + Math.sin(subAngle) * (subRadius / 10) * subProgress

              return (
                <div
                  key={ci}
                  style={{
                    position: 'absolute',
                    left: `${sx}%`,
                    top: `${sy}%`,
                    transform: 'translate(-50%, -50%)',
                    fontFamily: theme.typography.sansFont,
                    fontSize: 14,
                    fontWeight: theme.typography.weight.regular,
                    color: theme.colors.foregroundSecondary,
                    whiteSpace: 'nowrap',
                    padding: `2px ${theme.spacing.s1}px`,
                    opacity: subProgress,
                    zIndex: 4,
                  }}
                >
                  {child}
                </div>
              )
            })}
          </React.Fragment>
        )
      })}
    </div>
  )
}
