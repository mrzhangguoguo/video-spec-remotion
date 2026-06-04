import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface PyramidLayer {
  label: string
  /** Whether top label gets accent */
  accent?: boolean
}

interface PyramidProps {
  layers: PyramidLayer[]
  theme: DesignTokens
}

/**
 * broll-structure.pyramid — 金字塔
 *
 * 3 layers width 32/52/72% (golden ratio), gap 8px no overlap,
 * top label accent.
 */
export const Pyramid: React.FC<PyramidProps> = ({ layers, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Width percentages from top to bottom (golden ratio inspired)
  const widthPcts = [0.32, 0.52, 0.72]
  const totalW = 500
  const layerH = 60
  const gap = 8
  const totalH = layers.length * layerH + (layers.length - 1) * gap

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <svg width={totalW + 40} height={totalH + 40} style={{ overflow: 'visible' }}>
        {layers.map((layer, i) => {
          const pct = widthPcts[i] || 0.72
          const w = totalW * pct
          const x = (totalW - w) / 2 + 20
          const y = i * (layerH + gap) + 20

          const delay = i * 10
          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          const isAccent = layer.accent || i === 0

          return (
            <g key={i}
              transform={`translate(${x + w / 2}, ${y + layerH / 2}) scale(${scale})`}
              style={{ transformOrigin: '0 0' }}
            >
              <rect
                x={-w / 2} y={-layerH / 2}
                width={w} height={layerH}
                fill={isAccent ? theme.colors.accent3 : theme.colors.surface}
                stroke={isAccent ? theme.colors.accent : theme.colors.lineStrong}
                strokeWidth={1}
                rx={theme.borderRadius.sm}
              />
              <text
                y={4}
                textAnchor="middle"
                fontFamily={theme.typography.chineseFont}
                fontSize={theme.typography.scale.body}
                fontWeight={isAccent ? theme.typography.weight.mid : theme.typography.weight.regular}
                fill={isAccent ? theme.colors.accent : theme.colors.foreground}
              >
                {layer.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
