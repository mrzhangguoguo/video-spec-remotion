import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface TreeNode {
  id: string
  label: string
  /** Whether this is the root */
  isRoot?: boolean
  /** Whether this is a decision diamond */
  isDecision?: boolean
  /** Whether this leaf is recommended */
  recommended?: boolean
}

interface TreeEdge {
  from: string
  to: string
  label?: string
  /** Is this the recommended path? */
  recommended?: boolean
}

interface DecisionTreeProps {
  nodes: TreeNode[]
  edges: TreeEdge[]
  theme: DesignTokens
}

/**
 * broll-flows.decision-tree — 决策树
 *
 * Root -> decision diamond -> leaf rectangles.
 * Recommended leaf accent, recommended path full accent.
 */
export const DecisionTree: React.FC<DecisionTreeProps> = ({ nodes, edges, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Layout: root at top center, children spread below
  const positions: Record<string, { x: number; y: number }> = {}
  const root = nodes.find(n => n.isRoot)
  const decisions = nodes.filter(n => n.isDecision)
  const leaves = nodes.filter(n => !n.isRoot && !n.isDecision)

  if (root) positions[root.id] = { x: 350, y: 40 }
  decisions.forEach((d, i) => {
    positions[d.id] = { x: 250 + i * 200, y: 170 }
  })
  leaves.forEach((l, i) => {
    const total = leaves.length
    const startX = 350 - ((total - 1) * 120) / 2
    positions[l.id] = { x: startX + i * 120, y: 320 }
  })

  const nodeW = 120
  const nodeH = 48
  const diamondSize = 50

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <svg width={700} height={420} style={{ overflow: 'visible' }}>
        <defs>
          <marker id="dt-arrow" markerWidth={7} markerHeight={7} refX={7} refY={3.5} orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={theme.colors.foregroundMuted} />
          </marker>
          <marker id="dt-arrow-accent" markerWidth={7} markerHeight={7} refX={7} refY={3.5} orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={theme.colors.accent} />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const from = positions[edge.from]
          const to = positions[edge.to]
          if (!from || !to) return null

          const fromNode = nodes.find(n => n.id === edge.from)
          const startX = from.x + (fromNode?.isDecision ? 0 : nodeW / 2)
          const startY = from.y + (fromNode?.isDecision ? diamondSize : nodeH)
          const endX = to.x + nodeW / 2
          const endY = to.y

          const delay = i * 12 + 10
          const progress = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })

          return (
            <g key={`edge-${i}`}>
              <line
                x1={startX} y1={startY}
                x2={startX + (endX - startX) * progress}
                y2={startY + (endY - startY) * progress}
                stroke={edge.recommended ? theme.colors.accent : theme.colors.lineStrong}
                strokeWidth={edge.recommended ? 2 : 1}
                markerEnd={progress >= 1 ? (edge.recommended ? 'url(#dt-arrow-accent)' : 'url(#dt-arrow)') : undefined}
              />
              {edge.label && progress >= 0.6 && (
                <text
                  x={(startX + endX) / 2 + 8}
                  y={(startY + endY) / 2}
                  fontFamily={theme.typography.monoFont}
                  fontSize={theme.typography.scale.cap}
                  fill={edge.recommended ? theme.colors.accent : theme.colors.foregroundMuted}
                  opacity={interpolate(frame, [delay + 8, delay + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
                >
                  {edge.label}
                </text>
              )}
            </g>
          )
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const pos = positions[node.id]
          if (!pos) return null
          const delay = i * 8

          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, stiffness: 180 },
          })

          if (node.isDecision) {
            const cx = pos.x
            const cy = pos.y + diamondSize
            return (
              <g key={node.id} transform={`scale(${scale})`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
                <polygon
                  points={`${cx},${pos.y} ${cx + diamondSize},${cy} ${cx},${cy + diamondSize} ${cx - diamondSize},${cy}`}
                  fill={theme.colors.surface}
                  stroke={theme.colors.lineStrong}
                  strokeWidth={1}
                />
                <text
                  x={cx} y={cy + 4}
                  textAnchor="middle"
                  fontFamily={theme.typography.chineseFont}
                  fontSize={theme.typography.scale.small}
                  fill={theme.colors.foreground}
                >
                  {node.label}
                </text>
              </g>
            )
          }

          return (
            <g key={node.id} transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`} style={{ transformOrigin: `${nodeW / 2}px ${nodeH / 2}px` }}>
              <rect
                width={nodeW} height={nodeH}
                fill={node.recommended ? theme.colors.accent3 : theme.colors.surface}
                stroke={node.recommended ? theme.colors.accent : theme.colors.line}
                strokeWidth={1}
                rx={theme.borderRadius.sm}
              />
              <text
                x={nodeW / 2} y={nodeH / 2 + 4}
                textAnchor="middle"
                fontFamily={theme.typography.chineseFont}
                fontSize={theme.typography.scale.small}
                fill={node.recommended ? theme.colors.accent : theme.colors.foreground}
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
