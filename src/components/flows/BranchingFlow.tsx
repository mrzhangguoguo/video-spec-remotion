import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface BranchNode {
  id: string
  label: string
  /** Whether this is the decision diamond */
  isDecision?: boolean
  /** Question text for decision diamond */
  question?: string
}

interface BranchEdge {
  from: string
  to: string
  /** YES or NO label */
  label: 'YES' | 'NO'
  /** Is this the main (accent) path? */
  main?: boolean
}

interface BranchingFlowProps {
  nodes: BranchNode[]
  edges: BranchEdge[]
  theme: DesignTokens
}

/**
 * broll-flows.branching — 分支流程图
 *
 * Decision diamond + center question, YES/NO labels at line midpoints mono caps,
 * main path accent.
 */
export const BranchingFlow: React.FC<BranchingFlowProps> = ({ nodes, edges, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Simple layout: decision node center, branches left/right
  const nodePositions: Record<string, { x: number; y: number; w: number; h: number }> = {}
  const decision = nodes.find(n => n.isDecision)
  const others = nodes.filter(n => !n.isDecision)
  const leftNodes = others.filter((_, i) => i < others.length / 2)
  const rightNodes = others.filter((_, i) => i >= others.length / 2)

  if (decision) {
    nodePositions[decision.id] = { x: 300, y: 180, w: 120, h: 120 }
  }
  leftNodes.forEach((n, i) => {
    nodePositions[n.id] = { x: 60, y: 100 + i * 100, w: 140, h: 60 }
  })
  rightNodes.forEach((n, i) => {
    nodePositions[n.id] = { x: 500, y: 100 + i * 100, w: 140, h: 60 }
  })

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <svg width={700} height={400} style={{ overflow: 'visible' }}>
        <defs>
          <marker id="branch-arrow" markerWidth={7} markerHeight={7} refX={7} refY={3.5} orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={theme.colors.foregroundMuted} />
          </marker>
          <marker id="branch-arrow-accent" markerWidth={7} markerHeight={7} refX={7} refY={3.5} orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={theme.colors.accent} />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const from = nodePositions[edge.from]
          const to = nodePositions[edge.to]
          if (!from || !to) return null

          const fromCx = from.x + from.w / 2
          const fromCy = from.y + from.h / 2
          const toCx = to.x + to.w / 2
          const toCy = to.y + to.h / 2

          // Start from edge of diamond/node
          const startX = edge.label === 'YES' ? from.x + from.w : from.x
          const startY = fromCy
          const endX = edge.label === 'YES' ? to.x : to.x + to.w
          const endY = toCy

          const delay = i * 15 + 20
          const progress = interpolate(frame, [delay, delay + 15], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })

          const midX = (startX + endX) / 2
          const midY = (startY + endY) / 2

          return (
            <g key={`edge-${i}`}>
              <line
                x1={startX} y1={startY}
                x2={startX + (endX - startX) * progress}
                y2={startY + (endY - startY) * progress}
                stroke={edge.main ? theme.colors.accent : theme.colors.lineStrong}
                strokeWidth={1}
                strokeDasharray={edge.main ? undefined : '6 4'}
                markerEnd={progress >= 1 ? (edge.main ? 'url(#branch-arrow-accent)' : 'url(#branch-arrow)') : undefined}
              />
              {/* YES/NO label at midpoint */}
              {progress >= 0.5 && (
                <text
                  x={midX + (edge.label === 'YES' ? -16 : 16)}
                  y={midY - 10}
                  textAnchor="middle"
                  fontFamily={theme.typography.monoFont}
                  fontSize={theme.typography.scale.cap}
                  fontWeight={theme.typography.weight.mid}
                  letterSpacing={theme.typography.letterSpacing.caps}
                  fill={edge.main ? theme.colors.accent : theme.colors.foregroundMuted}
                  opacity={interpolate(frame, [delay + 10, delay + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
                >
                  {edge.label}
                </text>
              )}
            </g>
          )
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const pos = nodePositions[node.id]
          if (!pos) return null
          const delay = i * 10

          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, stiffness: 180 },
          })

          if (node.isDecision) {
            // Diamond shape
            const cx = pos.x + pos.w / 2
            const cy = pos.y + pos.h / 2
            const hw = pos.w / 2
            const hh = pos.h / 2
            return (
              <g key={node.id} transform={`scale(${scale})`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
                <polygon
                  points={`${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`}
                  fill={theme.colors.surface}
                  stroke={theme.colors.accent}
                  strokeWidth={1}
                />
                {node.question && (
                  <text
                    x={cx} y={cy + 4}
                    textAnchor="middle"
                    fontFamily={theme.typography.chineseFont}
                    fontSize={theme.typography.scale.small}
                    fill={theme.colors.foreground}
                  >
                    {node.question}
                  </text>
                )}
              </g>
            )
          }

          // Regular rectangle node
          return (
            <g key={node.id} transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`} style={{ transformOrigin: `${pos.w / 2}px ${pos.h / 2}px` }}>
              <rect
                width={pos.w} height={pos.h}
                fill={theme.colors.surface}
                stroke={theme.colors.line}
                strokeWidth={1}
                rx={theme.borderRadius.sm}
              />
              <text
                x={pos.w / 2} y={pos.h / 2 + 4}
                textAnchor="middle"
                fontFamily={theme.typography.chineseFont}
                fontSize={theme.typography.scale.body}
                fill={theme.colors.foreground}
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
