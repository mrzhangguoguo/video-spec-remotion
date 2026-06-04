import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface TreeNode {
  label: string
  highlighted?: boolean
  children?: TreeNode[]
}

interface TreeDiagramProps {
  /** 根节点 */
  root: TreeNode
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-structures2.tree — 树形图
 *
 * 3 层结构 root -> class -> instance，直线连接。
 * 主分支 accent 强调，深层矩形逐级缩小。
 */
export const TreeDiagram: React.FC<TreeDiagramProps> = ({ root, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Flatten tree into layers
  const layers: TreeNode[][] = []
  const collect = (node: TreeNode, depth: number) => {
    if (!layers[depth]) layers[depth] = []
    layers[depth].push(node)
    if (node.children) {
      for (const child of node.children) collect(child, depth + 1)
    }
  }
  collect(root, 0)

  const nodeConfigs = [
    { width: 200, height: 48, fontSize: theme.typography.scale.h3, font: theme.typography.sansFont, weight: theme.typography.weight.heavy },
    { width: 150, height: 40, fontSize: theme.typography.scale.body, font: theme.typography.monoFont, weight: theme.typography.weight.mid },
    { width: 110, height: 34, fontSize: theme.typography.scale.small, font: theme.typography.monoFont, weight: theme.typography.weight.mid },
  ]

  // Build flat list with parent-child line info
  const lines: Array<{ parentIdx: number; childIdx: number; depth: number; parentHighlighted: boolean; childHighlighted: boolean }> = []
  let parentOffset = 0
  for (let d = 0; d < layers.length - 1; d++) {
    const parentLayer = layers[d]
    const childLayer = layers[d + 1]
    let childOffset = 0
    for (let pi = 0; pi < parentLayer.length; pi++) {
      const children = parentLayer[pi].children || []
      for (let ci = 0; ci < children.length; ci++) {
        lines.push({
          parentIdx: parentOffset + pi,
          childIdx: parentOffset + parentLayer.length + childOffset + ci,
          depth: d,
          parentHighlighted: !!parentLayer[pi].highlighted,
          childHighlighted: !!children[ci].highlighted,
        })
      }
      childOffset += children.length
    }
    parentOffset += parentLayer.length
  }

  const layerGap = 90

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.s5,
      backgroundColor: theme.colors.background,
      position: 'relative',
    }}>
      {layers.map((layer, depth) => {
        const cfg = nodeConfigs[Math.min(depth, 2)]
        const layerDelay = depth * 15

        return (
          <div
            key={depth}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: theme.spacing.s3,
              marginTop: depth === 0 ? 0 : layerGap,
              position: 'relative',
            }}
          >
            {layer.map((node, ni) => {
              const delay = layerDelay + ni * 8
              const progress = spring({
                frame: Math.max(0, frame - delay),
                fps,
                config: { damping: 15, stiffness: 120 },
              })

              return (
                <div
                  key={ni}
                  style={{
                    width: cfg.width,
                    height: cfg.height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: node.highlighted ? theme.colors.accent3 : theme.colors.surface,
                    border: `1px solid ${node.highlighted ? theme.colors.accent : theme.colors.line}`,
                    borderRadius: theme.borderRadius.sm,
                    fontFamily: cfg.font,
                    fontSize: cfg.fontSize,
                    fontWeight: node.highlighted ? theme.typography.weight.heavy : cfg.weight,
                    color: node.highlighted ? theme.colors.accent : theme.colors.foreground,
                    letterSpacing: depth === 2 ? theme.typography.letterSpacing.caps : theme.typography.letterSpacing.normal,
                    textTransform: depth === 2 ? 'uppercase' : undefined,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    padding: `0 ${theme.spacing.s1}px`,
                    opacity: progress,
                    transform: `scale(${interpolate(progress, [0, 1], [0.85, 1])})`,
                  }}
                >
                  {node.label}
                </div>
              )
            })}

            {/* Draw connector lines to children using SVG overlay */}
            {depth < layers.length - 1 && (
              <svg
                style={{
                  position: 'absolute',
                  bottom: -layerGap,
                  left: 0,
                  width: '100%',
                  height: layerGap,
                  pointerEvents: 'none',
                  overflow: 'visible',
                }}
              >
                {(() => {
                  const parentCount = layer.length
                  const childLayer = layers[depth + 1]
                  const childCount = childLayer.length
                  const parentSpacing = 100 / (parentCount + 1)
                  const childSpacing = 100 / (childCount + 1)

                  let childIdx = 0
                  return layer.flatMap((parent, pi) => {
                    const children = parent.children || []
                    const result = children.map((child, ci) => {
                      const x1 = parentSpacing * (pi + 1)
                      const y1 = 0
                      const x2 = childSpacing * (childIdx + ci + 1)
                      const y2 = layerGap

                      const lineDelay = depth * 15 + pi * 5 + ci * 3
                      const lineProgress = spring({
                        frame: Math.max(0, frame - lineDelay),
                        fps,
                        config: { damping: 20, stiffness: 100 },
                      })

                      const isHighlighted = parent.highlighted || child.highlighted

                      return (
                        <line
                          key={`${pi}-${ci}`}
                          x1={`${x1}%`}
                          y1={y1}
                          x2={`${x2}%`}
                          y2={y2 * lineProgress}
                          stroke={isHighlighted ? theme.colors.accent : theme.colors.lineStrong}
                          strokeWidth={isHighlighted ? 2 : 1}
                        />
                      )
                    })
                    childIdx += children.length
                    return result
                  })
                })()}
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )
}
