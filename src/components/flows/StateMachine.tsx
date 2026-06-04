import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface StateNode {
  id: string
  name: string
}

interface StateTransition {
  from: string
  to: string
  event: string
  /** Is this a self-loop? */
  selfLoop?: boolean
}

interface StateMachineProps {
  states: StateNode[]
  transitions: StateTransition[]
  theme: DesignTokens
}

/**
 * broll-flows.state-machine — 状态机
 *
 * Circular nodes + mono caps names, event names above arrows, self-loop arcs.
 */
export const StateMachine: React.FC<StateMachineProps> = ({ states, transitions, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const cx = 350
  const cy = 200
  const radius = 140
  const nodeR = 36

  // Position states in a circle
  const positions: Record<string, { x: number; y: number }> = {}
  states.forEach((s, i) => {
    const angle = (i / states.length) * Math.PI * 2 - Math.PI / 2
    positions[s.id] = {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    }
  })

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <svg width={700} height={400} style={{ overflow: 'visible' }}>
        <defs>
          <marker id="sm-arrow" markerWidth={7} markerHeight={7} refX={7} refY={3.5} orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={theme.colors.foregroundMuted} />
          </marker>
        </defs>

        {/* Transitions */}
        {transitions.map((t, i) => {
          const from = positions[t.from]
          const to = positions[t.to]
          if (!from || !to) return null

          const delay = i * 10 + 15
          const progress = interpolate(frame, [delay, delay + 15], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })

          if (t.selfLoop) {
            // Self-loop arc above the node
            const loopR = 30
            const arcCx = from.x
            const arcCy = from.y - nodeR - loopR
            const startAngle = Math.PI * 0.15
            const endAngle = Math.PI * 0.85
            const x1 = arcCx + Math.cos(startAngle) * loopR
            const y1 = arcCy + Math.sin(startAngle) * loopR
            const x2 = arcCx + Math.cos(endAngle) * loopR
            const y2 = arcCy + Math.sin(endAngle) * loopR

            return (
              <g key={`transition-${i}`} opacity={progress}>
                <path
                  d={`M ${x1} ${y1} A ${loopR} ${loopR} 0 1 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={theme.colors.lineStrong}
                  strokeWidth={1}
                  markerEnd="url(#sm-arrow)"
                />
                <text
                  x={arcCx}
                  y={arcCy - loopR - 6}
                  textAnchor="middle"
                  fontFamily={theme.typography.monoFont}
                  fontSize={theme.typography.scale.cap}
                  letterSpacing={theme.typography.letterSpacing.caps}
                  fill={theme.colors.foregroundMuted}
                >
                  {t.event}
                </text>
              </g>
            )
          }

          // Normal transition: curved line
          const midX = (from.x + to.x) / 2
          const midY = (from.y + to.y) / 2
          // Offset midpoint perpendicular for curve
          const dx = to.x - from.x
          const dy = to.y - from.y
          const len = Math.sqrt(dx * dx + dy * dy)
          const offset = 30
          const ctrlX = midX + (-dy / len) * offset
          const ctrlY = midY + (dx / len) * offset

          // Start/end at circle edge
          const angleToCtrl = Math.atan2(ctrlY - from.y, ctrlX - from.x)
          const startX = from.x + Math.cos(angleToCtrl) * nodeR
          const startY = from.y + Math.sin(angleToCtrl) * nodeR
          const angleFromCtrl = Math.atan2(to.y - ctrlY, to.x - ctrlX)
          const endX = to.x - Math.cos(angleFromCtrl) * nodeR
          const endY = to.y - Math.sin(angleFromCtrl) * nodeR

          return (
            <g key={`transition-${i}`} opacity={progress}>
              <path
                d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
                fill="none"
                stroke={theme.colors.lineStrong}
                strokeWidth={1}
                markerEnd="url(#sm-arrow)"
              />
              <text
                x={ctrlX}
                y={ctrlY - 8}
                textAnchor="middle"
                fontFamily={theme.typography.monoFont}
                fontSize={theme.typography.scale.cap}
                letterSpacing={theme.typography.letterSpacing.caps}
                fill={theme.colors.foregroundMuted}
              >
                {t.event}
              </text>
            </g>
          )
        })}

        {/* State nodes */}
        {states.map((state, i) => {
          const pos = positions[state.id]
          const delay = i * 8

          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, stiffness: 180 },
          })

          return (
            <g key={state.id} transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`} style={{ transformOrigin: '0 0' }}>
              <circle
                r={nodeR}
                fill={theme.colors.surface}
                stroke={theme.colors.lineStrong}
                strokeWidth={1}
              />
              <text
                y={4}
                textAnchor="middle"
                fontFamily={theme.typography.monoFont}
                fontSize={theme.typography.scale.cap}
                fontWeight={theme.typography.weight.mid}
                letterSpacing={theme.typography.letterSpacing.caps}
                fill={theme.colors.foreground}
                textTransform="uppercase"
              >
                {state.name}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
