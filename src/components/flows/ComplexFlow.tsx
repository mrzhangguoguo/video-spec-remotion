import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface FlowNodeData {
  id: string
  mono: string
  cn: string
  /** hot = lights up tick/latency; key = dashed frame + inverted label */
  segment: 'normal' | 'hot' | 'key'
}

interface ComplexFlowProps {
  nodes: FlowNodeData[]
  theme: DesignTokens
}

/**
 * broll-flows.complex — 复杂流程图
 *
 * 170x108 节点，mono subtitle + cn label，双轨虚线。
 * hot 段点亮 tick/latency，key 段虚线框 + 反白标签。
 */
export const ComplexFlow: React.FC<ComplexFlowProps> = ({ nodes, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const nodeW = 170
  const nodeH = 108
  const gapX = 48
  const cols = 4
  const rows = Math.ceil(nodes.length / cols)

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      position: 'relative',
    }}>
      <svg width={cols * (nodeW + gapX) - gapX} height={rows * (nodeH + 60) - 60}
        style={{ overflow: 'visible' }}>
        {/* Dual dashed rails */}
        {Array.from({ length: rows }).map((_, r) => (
          <React.Fragment key={`rail-${r}`}>
            <line
              x1={0} y1={r * (nodeH + 60) + nodeH / 2 - 6}
              x2={cols * (nodeW + gapX) - gapX} y2={r * (nodeH + 60) + nodeH / 2 - 6}
              stroke={theme.colors.lineStrong} strokeWidth={1} strokeDasharray="6 4"
            />
            <line
              x1={0} y1={r * (nodeH + 60) + nodeH / 2 + 6}
              x2={cols * (nodeW + gapX) - gapX} y2={r * (nodeH + 60) + nodeH / 2 + 6}
              stroke={theme.colors.lineStrong} strokeWidth={1} strokeDasharray="6 4"
            />
          </React.Fragment>
        ))}

        {/* Connecting vertical arrows between rows */}
        {rows > 1 && Array.from({ length: rows - 1 }).map((_, r) => {
          const x = (cols - 1) * (nodeW + gapX) + nodeW / 2
          const y1 = r * (nodeH + 60) + nodeH
          const y2 = (r + 1) * (nodeH + 60)
          return (
            <line key={`vert-${r}`}
              x1={x} y1={y1} x2={x} y2={y2}
              stroke={theme.colors.lineStrong} strokeWidth={1}
              markerEnd="url(#arrow)"
            />
          )
        })}

        {/* Arrow marker definition */}
        <defs>
          <marker id="arrow" markerWidth={7} markerHeight={7} refX={7} refY={3.5} orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={theme.colors.foregroundMuted} />
          </marker>
        </defs>

        {/* Horizontal arrows between nodes */}
        {nodes.map((_, i) => {
          const col = i % cols
          const row = Math.floor(i / cols)
          if (col === cols - 1 || i >= nodes.length - 1) return null
          const x1 = col * (nodeW + gapX) + nodeW
          const x2 = (col + 1) * (nodeW + gapX)
          const y = row * (nodeH + 60) + nodeH / 2
          const delay = i * 6
          const progress = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })
          return (
            <line key={`arrow-${i}`}
              x1={x1} y1={y} x2={x1 + (x2 - x1) * progress} y2={y}
              stroke={theme.colors.lineStrongest} strokeWidth={1}
              markerEnd={progress >= 1 ? 'url(#arrow)' : undefined}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const col = i % cols
          const row = Math.floor(i / cols)
          const x = col * (nodeW + gapX)
          const y = row * (nodeH + 60)
          const delay = i * 8

          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, stiffness: 180 },
          })

          const isHot = node.segment === 'hot'
          const isKey = node.segment === 'key'

          return (
            <g key={node.id} transform={`translate(${x}, ${y}) scale(${scale})`} style={{ transformOrigin: `${nodeW / 2}px ${nodeH / 2}px` }}>
              {/* Key segment: dashed frame */}
              {isKey && (
                <rect
                  x={-6} y={-6}
                  width={nodeW + 12} height={nodeH + 12}
                  fill="none"
                  stroke={theme.colors.accent}
                  strokeWidth={1}
                  strokeDasharray="8 4"
                  rx={theme.borderRadius.md + 2}
                />
              )}
              {/* Node rectangle */}
              <rect
                width={nodeW} height={nodeH}
                fill={isHot ? theme.colors.accent3 : theme.colors.surface}
                stroke={isHot ? theme.colors.accent : isKey ? theme.colors.accent : theme.colors.line}
                strokeWidth={1}
                rx={theme.borderRadius.sm}
              />
              {/* Mono subtitle */}
              <text
                x={nodeW / 2} y={nodeH / 2 - 10}
                textAnchor="middle"
                fontFamily={theme.typography.monoFont}
                fontSize={theme.typography.scale.small}
                fontWeight={theme.typography.weight.mid}
                letterSpacing={theme.typography.letterSpacing.caps}
                fill={isHot ? theme.colors.accent : theme.colors.foregroundSecondary}
              >
                {node.mono}
              </text>
              {/* CN label */}
              <text
                x={nodeW / 2} y={nodeH / 2 + 14}
                textAnchor="middle"
                fontFamily={theme.typography.chineseFont}
                fontSize={theme.typography.scale.body}
                fontWeight={theme.typography.weight.regular}
                fill={isHot ? theme.colors.accent : theme.colors.foreground}
              >
                {node.cn}
              </text>
              {/* Key segment: inverted label */}
              {isKey && (
                <g>
                  <rect
                    x={nodeW / 2 - 28} y={nodeH - 16}
                    width={56} height={18}
                    fill={theme.colors.foreground}
                    rx={theme.borderRadius.sm}
                  />
                  <text
                    x={nodeW / 2} y={nodeH - 3}
                    textAnchor="middle"
                    fontFamily={theme.typography.monoFont}
                    fontSize={theme.typography.scale.meta}
                    fontWeight={theme.typography.weight.mid}
                    fill={theme.colors.background}
                  >
                    KEY
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
