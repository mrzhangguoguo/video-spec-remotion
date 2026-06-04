import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface FlowChartNode {
  id: string
  label: string
}

interface FlowChartEdge {
  from: string
  to: string
}

interface FlowChartProps {
  nodes: FlowChartNode[]
  edges: FlowChartEdge[]
  theme: DesignTokens
  /** Advance speed: ms per step (default 900) */
  stepDuration?: number
}

/**
 * broll-structure.flow-chart — 流程图
 *
 * Nodes hairline -> hot solid accent, arrows 1px + 7px triangle,
 * advance 900ms/step, past lines accent, future 0.5 opacity.
 */
export const FlowChart: React.FC<FlowChartProps> = ({ nodes, edges, theme, stepDuration = 900 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const stepFrames = Math.round((stepDuration / 1000) * fps)
  const currentStep = Math.floor(frame / stepFrames)

  const nodeW = 130
  const nodeH = 44
  const gapX = 60
  const gapY = 20

  // Layout: left to right, wrap rows
  const cols = Math.min(nodes.length, 4)
  const positions: Record<string, { x: number; y: number; index: number }> = {}
  nodes.forEach((node, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    positions[node.id] = {
      x: col * (nodeW + gapX),
      y: row * (nodeH + gapY),
      index: i,
    }
  })

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <svg width={cols * (nodeW + gapX) - gapX + 40} height={Math.ceil(nodes.length / cols) * (nodeH + gapY) - gapY + 40}
        style={{ overflow: 'visible' }}>
        <defs>
          <marker id="fc-arrow" markerWidth={7} markerHeight={7} refX={7} refY={3.5} orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={theme.colors.foregroundMuted} />
          </marker>
          <marker id="fc-arrow-accent" markerWidth={7} markerHeight={7} refX={7} refY={3.5} orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={theme.colors.accent} />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const from = positions[edge.from]
          const to = positions[edge.to]
          if (!from || !to) return null

          const x1 = from.x + nodeW
          const y1 = from.y + nodeH / 2
          const x2 = to.x
          const y2 = to.y + nodeH / 2

          const edgeIndex = Math.max(from.index, to.index)
          const isPast = edgeIndex <= currentStep
          const isFuture = edgeIndex > currentStep + 1

          return (
            <line key={`edge-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isPast ? theme.colors.accent : theme.colors.lineStrong}
              strokeWidth={1}
              opacity={isFuture ? 0.5 : 1}
              markerEnd={isPast ? 'url(#fc-arrow-accent)' : 'url(#fc-arrow)'}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const pos = positions[node.id]
          const isPast = i < currentStep
          const isCurrent = i === currentStep
          const isFuture = i > currentStep

          const delay = i * 6
          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, stiffness: 180 },
          })

          // Hot pulse on current node
          const pulse = isCurrent ? interpolate(
            frame % stepFrames,
            [0, stepFrames / 2, stepFrames],
            [1, 1.05, 1],
          ) : 1

          return (
            <g key={node.id}
              transform={`translate(${pos.x}, ${pos.y}) scale(${scale * pulse})`}
              style={{ transformOrigin: `${nodeW / 2}px ${nodeH / 2}px` }}
              opacity={isFuture ? 0.5 : 1}
            >
              <rect
                width={nodeW} height={nodeH}
                fill={isPast || isCurrent ? theme.colors.accent3 : theme.colors.surface}
                stroke={isPast || isCurrent ? theme.colors.accent : theme.colors.line}
                strokeWidth={1}
                rx={theme.borderRadius.sm}
              />
              <text
                x={nodeW / 2} y={nodeH / 2 + 4}
                textAnchor="middle"
                fontFamily={theme.typography.chineseFont}
                fontSize={theme.typography.scale.small}
                fill={isPast || isCurrent ? theme.colors.accent : theme.colors.foreground}
              >
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
