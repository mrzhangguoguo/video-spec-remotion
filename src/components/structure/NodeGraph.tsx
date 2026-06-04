import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface GraphNode {
  id: string
  label: string
  x: number
  y: number
  /** Hot node gets accent stroke + surface fill */
  hot?: boolean
}

interface GraphEdge {
  from: string
  to: string
}

interface NodeGraphProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  theme: DesignTokens
}

/**
 * broll-structure.node-graph — 节点图
 *
 * Edges 1px strong hairline no arrowheads, nodes radius 6px padding 8/14,
 * hot node accent stroke + surface fill.
 */
export const NodeGraph: React.FC<NodeGraphProps> = ({ nodes, edges, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const nodeMap: Record<string, GraphNode> = {}
  nodes.forEach(n => { nodeMap[n.id] = n })

  const nodeR = 6
  const padX = 14
  const padY = 8

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <svg width={700} height={400} style={{ overflow: 'visible' }}>
        {/* Edges: 1px hairline, no arrowheads */}
        {edges.map((edge, i) => {
          const from = nodeMap[edge.from]
          const to = nodeMap[edge.to]
          if (!from || !to) return null

          const delay = i * 5 + 10
          const progress = interpolate(frame, [delay, delay + 12], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })

          return (
            <line key={`edge-${i}`}
              x1={from.x} y1={from.y}
              x2={from.x + (to.x - from.x) * progress}
              y2={from.y + (to.y - from.y) * progress}
              stroke={theme.colors.lineStrong}
              strokeWidth={1}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const delay = i * 6

          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, stiffness: 180 },
          })

          const labelW = node.label.length * 8 + padX * 2
          const labelH = 20 + padY * 2

          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y}) scale(${scale})`} style={{ transformOrigin: '0 0' }}>
              {/* Node circle */}
              <circle
                r={nodeR}
                fill={node.hot ? theme.colors.accent3 : theme.colors.surface}
                stroke={node.hot ? theme.colors.accent : theme.colors.lineStrong}
                strokeWidth={1}
              />
              {/* Label */}
              <g transform={`translate(${nodeR + 6}, ${-labelH / 2})`}>
                <rect
                  width={labelW} height={labelH}
                  fill={node.hot ? theme.colors.accent3 : theme.colors.surface}
                  stroke={node.hot ? theme.colors.accent : theme.colors.line}
                  strokeWidth={1}
                  rx={theme.borderRadius.sm}
                />
                <text
                  x={labelW / 2} y={labelH / 2 + 4}
                  textAnchor="middle"
                  fontFamily={theme.typography.chineseFont}
                  fontSize={theme.typography.scale.small}
                  fill={node.hot ? theme.colors.accent : theme.colors.foreground}
                >
                  {node.label}
                </text>
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
