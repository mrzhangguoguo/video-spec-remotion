import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

type CellState = 'active' | 'idle' | 'error'

interface GridCell {
  state: CellState
  label?: string
}

interface GridMapProps {
  /** 12x6 网格数据（行优先） */
  cells: GridCell[][]
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-structures2.grid-map — 网格地图
 *
 * 12×6 单元格 gap 8px，颜色映射状态。
 * active = accent / idle = 16% white / error = red。
 * active 单元格呼吸脉冲 + 交错延迟。
 */
export const GridMap: React.FC<GridMapProps> = ({ cells, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const stateColors: Record<CellState, string> = {
    active: theme.colors.accent,
    idle: theme.colors.foregroundFaint,
    error: theme.colors.red,
  }

  const stateBg: Record<CellState, string> = {
    active: theme.colors.accent3,
    idle: 'rgba(255,255,255,0.04)',
    error: 'rgba(255,51,51,0.12)',
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.s4,
      backgroundColor: theme.colors.background,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(6, 1fr)',
        gap: 8,
        width: '100%',
        maxWidth: 800,
        aspectRatio: '2 / 1',
      }}>
        {cells.flatMap((row, ri) =>
          row.map((cell, ci) => {
            const delay = (ri + ci) * 2
            const entryProgress = spring({
              frame: Math.max(0, frame - delay),
              fps,
              config: { damping: 15, stiffness: 120 },
            })

            // Breathe pulse for active cells (staggered)
            const breatheFrame = Math.max(0, frame - 20 - delay)
            const breathe = cell.state === 'active'
              ? interpolate(
                  Math.sin(breatheFrame * 0.08),
                  [-1, 1],
                  [0.7, 1],
                )
              : 1

            return (
              <div
                key={`${ri}-${ci}`}
                style={{
                  backgroundColor: stateBg[cell.state],
                  border: `1px solid ${stateColors[cell.state]}`,
                  borderRadius: theme.borderRadius.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 32,
                  opacity: entryProgress * breathe,
                  transform: `scale(${interpolate(entryProgress, [0, 1], [0.8, 1])})`,
                }}
              >
                {cell.label && (
                  <span style={{
                    fontFamily: theme.typography.monoFont,
                    fontSize: theme.typography.scale.meta,
                    color: stateColors[cell.state],
                    letterSpacing: theme.typography.letterSpacing.caps,
                    textTransform: 'uppercase',
                  }}>
                    {cell.label}
                  </span>
                )}
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}
