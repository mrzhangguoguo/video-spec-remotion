import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface SwimlaneStep {
  id: string
  label: string
  /** Which lane (0-indexed) */
  lane: number
}

interface SwimlaneHandoff {
  from: string
  to: string
}

interface SwimlaneDiagramProps {
  lanes: { id: string; name: string; number: string }[]
  steps: SwimlaneStep[]
  handoffs: SwimlaneHandoff[]
  theme: DesignTokens
}

/**
 * broll-flows.swimlane — 泳道图
 *
 * Horizontal lanes, left mono numbering + cn role names,
 * cross-lane arrows = handoff.
 */
export const SwimlaneDiagram: React.FC<SwimlaneDiagramProps> = ({ lanes, steps, handoffs, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const laneH = 100
  const labelW = 100
  const stepW = 120
  const stepH = 40
  const stepGap = 30
  const laneGap = 2
  const totalH = lanes.length * (laneH + laneGap)

  // Position steps within lanes
  const stepPositions: Record<string, { x: number; y: number }> = {}
  const laneCounters: Record<number, number> = {}
  steps.forEach((step) => {
    const idx = laneCounters[step.lane] || 0
    laneCounters[step.lane] = idx + 1
    stepPositions[step.id] = {
      x: labelW + 20 + idx * (stepW + stepGap),
      y: step.lane * (laneH + laneGap) + (laneH - stepH) / 2,
    }
  })

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <svg width={760} height={totalH + 20} style={{ overflow: 'visible' }}>
        <defs>
          <marker id="sw-arrow" markerWidth={7} markerHeight={7} refX={7} refY={3.5} orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={theme.colors.accent} />
          </marker>
        </defs>

        {/* Lane backgrounds and labels */}
        {lanes.map((lane, i) => {
          const y = i * (laneH + laneGap)
          return (
            <g key={lane.id}>
              {/* Lane background */}
              <rect
                x={0} y={y}
                width={760} height={laneH}
                fill={i % 2 === 0 ? theme.colors.surface : 'transparent'}
                stroke={theme.colors.line}
                strokeWidth={1}
              />
              {/* Lane separator */}
              {i > 0 && (
                <line x1={labelW} y1={y} x2={760} y2={y} stroke={theme.colors.lineStrong} strokeWidth={1} />
              )}
              {/* Left label: mono number */}
              <text
                x={16} y={y + laneH / 2 - 8}
                fontFamily={theme.typography.monoFont}
                fontSize={theme.typography.scale.h3}
                fontWeight={theme.typography.weight.bold}
                fill={theme.colors.foregroundMuted}
              >
                {lane.number}
              </text>
              {/* Left label: cn role name */}
              <text
                x={16} y={y + laneH / 2 + 14}
                fontFamily={theme.typography.chineseFont}
                fontSize={theme.typography.scale.small}
                fill={theme.colors.foregroundSecondary}
              >
                {lane.name}
              </text>
            </g>
          )
        })}

        {/* Steps */}
        {steps.map((step, i) => {
          const pos = stepPositions[step.id]
          if (!pos) return null
          const delay = i * 8

          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, stiffness: 180 },
          })

          return (
            <g key={step.id} transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`} style={{ transformOrigin: `${stepW / 2}px ${stepH / 2}px` }}>
              <rect
                width={stepW} height={stepH}
                fill={theme.colors.surface}
                stroke={theme.colors.lineStrong}
                strokeWidth={1}
                rx={theme.borderRadius.sm}
              />
              <text
                x={stepW / 2} y={stepH / 2 + 4}
                textAnchor="middle"
                fontFamily={theme.typography.chineseFont}
                fontSize={theme.typography.scale.small}
                fill={theme.colors.foreground}
              >
                {step.label}
              </text>
            </g>
          )
        })}

        {/* Handoff arrows (cross-lane) */}
        {handoffs.map((h, i) => {
          const fromPos = stepPositions[h.from]
          const toPos = stepPositions[h.to]
          if (!fromPos || !toPos) return null

          const delay = i * 12 + 20
          const progress = interpolate(frame, [delay, delay + 15], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })

          const x1 = fromPos.x + stepW
          const y1 = fromPos.y + stepH / 2
          const x2 = toPos.x
          const y2 = toPos.y + stepH / 2

          return (
            <line key={`handoff-${i}`}
              x1={x1} y1={y1}
              x2={x1 + (x2 - x1) * progress}
              y2={y1 + (y2 - y1) * progress}
              stroke={theme.colors.accent}
              strokeWidth={1}
              strokeDasharray="6 4"
              markerEnd={progress >= 1 ? 'url(#sw-arrow)' : undefined}
              opacity={progress}
            />
          )
        })}
      </svg>
    </div>
  )
}
