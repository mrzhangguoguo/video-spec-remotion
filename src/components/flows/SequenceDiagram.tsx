import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface Actor {
  id: string
  name: string
}

interface SequenceCall {
  from: string
  to: string
  label: string
  /** sync = solid line, async = dashed */
  async?: boolean
  /** key calls get accent color */
  key?: boolean
}

interface SequenceDiagramProps {
  actors: Actor[]
  calls: SequenceCall[]
  theme: DesignTokens
}

/**
 * broll-flows.sequence — 时序图
 *
 * Actor top rectangles + dashed lifelines,
 * solid=sync / dashed=async, key calls accent.
 */
export const SequenceDiagram: React.FC<SequenceDiagramProps> = ({ actors, calls, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const actorW = 100
  const actorH = 36
  const gap = 80
  const lifelineTop = actorH + 10
  const lifelineH = 300
  const callSpacing = 50

  const actorPositions: Record<string, number> = {}
  actors.forEach((a, i) => {
    actorPositions[a.id] = i * (actorW + gap) + actorW / 2
  })

  const totalW = actors.length * actorW + (actors.length - 1) * gap

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <svg width={totalW + 40} height={lifelineTop + lifelineH + 40} style={{ overflow: 'visible' }}>
        <defs>
          <marker id="seq-arrow" markerWidth={7} markerHeight={7} refX={7} refY={3.5} orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={theme.colors.foregroundMuted} />
          </marker>
          <marker id="seq-arrow-accent" markerWidth={7} markerHeight={7} refX={7} refY={3.5} orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={theme.colors.accent} />
          </marker>
        </defs>

        {/* Lifelines (dashed vertical lines) */}
        {actors.map((actor, i) => {
          const x = actorPositions[actor.id]
          return (
            <line key={`lifeline-${i}`}
              x1={x} y1={lifelineTop}
              x2={x} y2={lifelineTop + lifelineH}
              stroke={theme.colors.lineStrong}
              strokeWidth={1}
              strokeDasharray="6 4"
            />
          )
        })}

        {/* Call arrows */}
        {calls.map((call, i) => {
          const fromX = actorPositions[call.from]
          const toX = actorPositions[call.to]
          if (fromX === undefined || toX === undefined) return null

          const y = lifelineTop + 20 + i * callSpacing
          const delay = i * 12 + 10
          const progress = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })

          return (
            <g key={`call-${i}`} opacity={progress}>
              <line
                x1={fromX} y1={y}
                x2={toX} y2={y}
                stroke={call.key ? theme.colors.accent : theme.colors.lineStrongest}
                strokeWidth={1}
                strokeDasharray={call.async ? '6 4' : undefined}
                markerEnd={call.key ? 'url(#seq-arrow-accent)' : 'url(#seq-arrow)'}
              />
              <text
                x={(fromX + toX) / 2}
                y={y - 8}
                textAnchor="middle"
                fontFamily={theme.typography.monoFont}
                fontSize={theme.typography.scale.cap}
                fill={call.key ? theme.colors.accent : theme.colors.foregroundMuted}
              >
                {call.label}
              </text>
            </g>
          )
        })}

        {/* Actor rectangles */}
        {actors.map((actor, i) => {
          const x = actorPositions[actor.id] - actorW / 2
          const delay = i * 6

          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, stiffness: 180 },
          })

          return (
            <g key={actor.id} transform={`translate(${x}, 0) scale(${scale})`} style={{ transformOrigin: `${actorW / 2}px ${actorH / 2}px` }}>
              <rect
                width={actorW} height={actorH}
                fill={theme.colors.surface}
                stroke={theme.colors.lineStrong}
                strokeWidth={1}
                rx={theme.borderRadius.sm}
              />
              <text
                x={actorW / 2} y={actorH / 2 + 4}
                textAnchor="middle"
                fontFamily={theme.typography.chineseFont}
                fontSize={theme.typography.scale.small}
                fill={theme.colors.foreground}
              >
                {actor.name}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
