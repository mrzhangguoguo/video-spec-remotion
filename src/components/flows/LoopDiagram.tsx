import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface LoopNode {
  id: string
  label: string
}

interface LoopDiagramProps {
  nodes: LoopNode[]
  /** Exit condition text */
  exitCondition: string
  theme: DesignTokens
}

/**
 * broll-flows.loop — 循环图
 *
 * 4 nodes in ring (not linear), arc closed loop,
 * center infinity symbol + exit condition.
 */
export const LoopDiagram: React.FC<LoopDiagramProps> = ({ nodes, exitCondition, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const cx = 350
  const cy = 200
  const ringR = 120
  const nodeW = 100
  const nodeH = 44

  // Position nodes in a ring
  const positions: { x: number; y: number }[] = nodes.map((_, i) => {
    const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2
    return {
      x: cx + Math.cos(angle) * ringR,
      y: cy + Math.sin(angle) * ringR,
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
          <marker id="loop-arrow" markerWidth={7} markerHeight={7} refX={7} refY={3.5} orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={theme.colors.accent} />
          </marker>
        </defs>

        {/* Loop arcs connecting nodes in a ring */}
        {positions.map((pos, i) => {
          const next = positions[(i + 1) % positions.length]
          const delay = i * 10 + 5

          const progress = interpolate(frame, [delay, delay + 15], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })

          // Offset start/end from node center
          const dx = next.x - pos.x
          const dy = next.y - pos.y
          const len = Math.sqrt(dx * dx + dy * dy)
          const startX = pos.x + (dx / len) * (nodeW / 2 + 4)
          const startY = pos.y + (dy / len) * (nodeH / 2 + 4)
          const endX = next.x - (dx / len) * (nodeW / 2 + 4)
          const endY = next.y - (dy / len) * (nodeH / 2 + 4)

          // Curved arc toward center
          const midX = (startX + endX) / 2
          const midY = (startY + endY) / 2
          const toCenterX = cx - midX
          const toCenterY = cy - midY
          const toCenterLen = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY)
          const curveOffset = 20
          const ctrlX = midX + (toCenterX / toCenterLen) * curveOffset
          const ctrlY = midY + (toCenterY / toCenterLen) * curveOffset

          return (
            <path key={`arc-${i}`}
              d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${startX + (endX - startX) * progress} ${startY + (endY - startY) * progress}`}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth={1}
              markerEnd={progress >= 1 ? 'url(#loop-arrow)' : undefined}
            />
          )
        })}

        {/* Node rectangles */}
        {nodes.map((node, i) => {
          const pos = positions[i]
          const delay = i * 6

          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, stiffness: 180 },
          })

          return (
            <g key={node.id} transform={`translate(${pos.x - nodeW / 2}, ${pos.y - nodeH / 2}) scale(${scale})`} style={{ transformOrigin: `${nodeW / 2}px ${nodeH / 2}px` }}>
              <rect
                width={nodeW} height={nodeH}
                fill={theme.colors.surface}
                stroke={theme.colors.lineStrong}
                strokeWidth={1}
                rx={theme.borderRadius.sm}
              />
              <text
                x={nodeW / 2} y={nodeH / 2 + 4}
                textAnchor="middle"
                fontFamily={theme.typography.chineseFont}
                fontSize={theme.typography.scale.small}
                fill={theme.colors.foreground}
              >
                {node.label}
              </text>
            </g>
          )
        })}

        {/* Center: infinity symbol */}
        <text
          x={cx} y={cy - 10}
          textAnchor="middle"
          fontFamily={theme.typography.monoFont}
          fontSize={theme.typography.scale.display}
          fill={theme.colors.accent}
          opacity={interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        >
          {'∞'}
        </text>

        {/* Center: exit condition */}
        <text
          x={cx} y={cy + 20}
          textAnchor="middle"
          fontFamily={theme.typography.monoFont}
          fontSize={theme.typography.scale.cap}
          letterSpacing={theme.typography.letterSpacing.caps}
          fill={theme.colors.foregroundMuted}
          opacity={interpolate(frame, [25, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        >
          {exitCondition}
        </text>
      </svg>
    </div>
  )
}
