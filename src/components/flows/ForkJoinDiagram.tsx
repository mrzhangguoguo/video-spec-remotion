import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface Worker {
  id: string
  label: string
}

interface ForkJoinDiagramProps {
  workers: Worker[]
  /** Concurrency count displayed */
  concurrency: number
  theme: DesignTokens
}

/**
 * broll-flows.fork-join — Fork/Join 并发图
 *
 * Fork/join 6x20 solid accent bars, workers side-by-side stacked,
 * count = concurrency.
 */
export const ForkJoinDiagram: React.FC<ForkJoinDiagramProps> = ({ workers, concurrency, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const barW = 6
  const barH = 200
  const workerW = 120
  const workerH = 50
  const workerGap = 20
  const totalWorkersW = workers.length * workerW + (workers.length - 1) * workerGap
  const svgW = totalWorkersW + 200
  const svgH = 300
  const forkX = 40
  const joinX = svgW - 40
  const workerStartX = (svgW - totalWorkersW) / 2
  const workerY = (svgH - workerH) / 2

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <svg width={svgW} height={svgH} style={{ overflow: 'visible' }}>
        {/* Fork bar */}
        {(() => {
          const delay = 0
          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })
          return (
            <rect
              x={forkX} y={svgH / 2 - barH / 2}
              width={barW} height={barH * scale}
              fill={theme.colors.accent}
              rx={2}
            />
          )
        })()}

        {/* Join bar */}
        {(() => {
          const delay = 30
          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })
          return (
            <rect
              x={joinX} y={svgH / 2 - barH / 2}
              width={barW} height={barH * scale}
              fill={theme.colors.accent}
              rx={2}
            />
          )
        })()}

        {/* Lines from fork to workers */}
        {workers.map((_, i) => {
          const wx = workerStartX + i * (workerW + workerGap) + workerW / 2
          const delay = 8 + i * 4
          const progress = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })
          return (
            <line key={`fork-line-${i}`}
              x1={forkX + barW} y1={svgH / 2}
              x2={forkX + barW + (wx - forkX - barW) * progress} y2={svgH / 2}
              stroke={theme.colors.lineStrong}
              strokeWidth={1}
            />
          )
        })}

        {/* Lines from workers to join */}
        {workers.map((_, i) => {
          const wx = workerStartX + i * (workerW + workerGap) + workerW / 2
          const delay = 30 + i * 4
          const progress = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })
          return (
            <line key={`join-line-${i}`}
              x1={wx} y1={svgH / 2}
              x2={wx + (joinX - wx) * progress} y2={svgH / 2}
              stroke={theme.colors.lineStrong}
              strokeWidth={1}
            />
          )
        })}

        {/* Worker nodes */}
        {workers.map((worker, i) => {
          const x = workerStartX + i * (workerW + workerGap)
          const delay = 12 + i * 6

          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, stiffness: 180 },
          })

          return (
            <g key={worker.id} transform={`translate(${x}, ${workerY}) scale(${scale})`} style={{ transformOrigin: `${workerW / 2}px ${workerH / 2}px` }}>
              <rect
                width={workerW} height={workerH}
                fill={theme.colors.surface}
                stroke={theme.colors.lineStrong}
                strokeWidth={1}
                rx={theme.borderRadius.sm}
              />
              <text
                x={workerW / 2} y={workerH / 2 + 4}
                textAnchor="middle"
                fontFamily={theme.typography.chineseFont}
                fontSize={theme.typography.scale.small}
                fill={theme.colors.foreground}
              >
                {worker.label}
              </text>
            </g>
          )
        })}

        {/* Concurrency count label */}
        <text
          x={svgW / 2} y={svgH - 20}
          textAnchor="middle"
          fontFamily={theme.typography.monoFont}
          fontSize={theme.typography.scale.h3}
          fontWeight={theme.typography.weight.bold}
          fill={theme.colors.accent}
          opacity={interpolate(frame, [25, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        >
          x{concurrency}
        </text>
      </svg>
    </div>
  )
}
