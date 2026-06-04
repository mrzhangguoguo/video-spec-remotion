import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface SankeyNode {
  id: string
  label: string
}

interface SankeyLink {
  source: number  // index into nodes
  target: number  // index into nodes
  value: number
}

export interface SankeyChartProps {
  nodes: SankeyNode[]
  links: SankeyLink[]
  title?: string
  theme: DesignTokens
}

/**
 * broll-charts.sankey — 桑基图
 *
 * 节点 18px 宽矩形 (accent / 62% 白)，流 bezier 宽度映射流量，accent 32% / 白 42% 不透明度。
 */
export const SankeyChart: React.FC<SankeyChartProps> = ({ nodes, links, title, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  if (nodes.length === 0 || links.length === 0) return null

  const width = 800
  const height = 500
  const nodeWidth = 18
  const nodePadding = 20

  // Calculate node positions (simple left-to-right layout)
  // Determine column for each node based on links
  const columns: number[] = new Array(nodes.length).fill(0)
  const assigned = new Set<number>()

  // BFS to assign columns
  const queue: number[] = []
  // Find root nodes (no incoming links)
  const hasIncoming = new Set(links.map(l => l.target))
  nodes.forEach((_, i) => {
    if (!hasIncoming.has(i)) {
      columns[i] = 0
      assigned.add(i)
      queue.push(i)
    }
  })

  while (queue.length > 0) {
    const current = queue.shift()!
    links.forEach(l => {
      if (l.source === current && !assigned.has(l.target)) {
        columns[l.target] = columns[current] + 1
        assigned.add(l.target)
        queue.push(l.target)
      }
    })
  }

  // Group nodes by column
  const maxCol = Math.max(...columns)
  const colGroups: number[][] = Array.from({ length: maxCol + 1 }, () => [])
  columns.forEach((col, i) => colGroups[col].push(i))

  // Position nodes within each column
  const nodePositions: { x: number; y: number; height: number }[] = new Array(nodes.length)

  colGroups.forEach((group, col) => {
    const totalValue = group.reduce((sum, nodeIdx) => {
      const incoming = links.filter(l => l.target === nodeIdx).reduce((s, l) => s + l.value, 0)
      const outgoing = links.filter(l => l.source === nodeIdx).reduce((s, l) => s + l.value, 0)
      return sum + Math.max(incoming, outgoing, 1)
    }, 0)

    const availableHeight = height - (group.length - 1) * nodePadding
    let currentY = 0

    group.forEach(nodeIdx => {
      const incoming = links.filter(l => l.target === nodeIdx).reduce((s, l) => s + l.value, 0)
      const outgoing = links.filter(l => l.source === nodeIdx).reduce((s, l) => s + l.value, 0)
      const nodeValue = Math.max(incoming, outgoing, 1)
      const nodeHeight = Math.max((nodeValue / totalValue) * availableHeight, 20)

      nodePositions[nodeIdx] = {
        x: (col / maxCol) * (width - nodeWidth * 2) + nodeWidth,
        y: currentY,
        height: nodeHeight,
      }

      currentY += nodeHeight + nodePadding
    })
  })

  // Node colors: alternating accent / 62% white
  const nodeColors = [
    theme.colors.accent,
    'rgba(255,255,255,0.62)',
  ]

  // Link colors: alternating accent 32% / white 42%
  const linkColors = [
    `${theme.colors.accent}52`,  // 32% opacity
    'rgba(255,255,255,0.42)',
  ]

  const maxValue = Math.max(...links.map(l => l.value))

  // Animation
  const flowProgress = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 15, stiffness: 80 } })
  const nodeProgress = spring({ frame, fps, config: { damping: 12, stiffness: 120 } })

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing.s5,
      backgroundColor: theme.colors.background,
    }}>
      {title && (
        <h3 style={{
          fontFamily: theme.typography.sansFont,
          fontWeight: theme.typography.weight.bold,
          fontSize: theme.typography.scale.h3,
          color: theme.colors.foreground,
          marginBottom: theme.spacing.s3,
          opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          {title}
        </h3>
      )}

      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        {/* Links (flows) */}
        {links.map((link, i) => {
          const source = nodePositions[link.source]
          const target = nodePositions[link.target]
          if (!source || !target) return null

          const sourceX = source.x + nodeWidth
          const targetX = target.x
          const sourceY = source.y + source.height / 2
          const targetY = target.y + target.height / 2

          const flowWidth = interpolate(link.value, [0, maxValue], [2, 40])
          const midX = (sourceX + targetX) / 2

          const path = `M ${sourceX} ${sourceY - flowWidth / 2}
            C ${midX} ${sourceY - flowWidth / 2}, ${midX} ${targetY - flowWidth / 2}, ${targetX} ${targetY - flowWidth / 2}
            L ${targetX} ${targetY + flowWidth / 2}
            C ${midX} ${targetY + flowWidth / 2}, ${midX} ${sourceY + flowWidth / 2}, ${sourceX} ${sourceY + flowWidth / 2}
            Z`

          const delay = 10 + i * 5
          const linkOpacity = interpolate(
            frame,
            [delay, delay + 15],
            [0, flowProgress],
            { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' },
          )

          return (
            <path
              key={i}
              d={path}
              fill={linkColors[i % linkColors.length]}
              opacity={linkOpacity}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const pos = nodePositions[i]
          if (!pos) return null

          const delay = i * 4
          const nodeOpacity = interpolate(
            frame,
            [delay, delay + 10],
            [0, nodeProgress],
            { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' },
          )

          return (
            <g key={i}>
              <rect
                x={pos.x}
                y={pos.y}
                width={nodeWidth}
                height={pos.height * nodeProgress}
                fill={nodeColors[i % nodeColors.length]}
                rx={theme.borderRadius.sm}
                opacity={nodeOpacity}
              />
              <text
                x={pos.x + nodeWidth + 8}
                y={pos.y + pos.height / 2 + 5}
                fontFamily={theme.typography.monoFont}
                fontSize={theme.typography.scale.small}
                fill={theme.colors.foregroundSecondary}
                fontVariantNumeric="tabular-nums"
                opacity={nodeOpacity}
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
