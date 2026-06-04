import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface FunnelStage {
  label: string
  value: number
}

interface FunnelProps {
  stages: FunnelStage[]
  theme: DesignTokens
}

/**
 * broll-structure.funnel — 漏斗图
 *
 * 4 stages width 80->58->40->22%, final stage accent border,
 * right column mono numbers right-aligned.
 */
export const Funnel: React.FC<FunnelProps> = ({ stages, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Width percentages for each stage
  const widthPcts = [0.80, 0.58, 0.40, 0.22]
  const totalW = 460
  const stageH = 56
  const gap = 6
  const rightColW = 100
  const svgW = totalW + rightColW + 60
  const svgH = stages.length * (stageH + gap) - gap + 40

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: theme.colors.background,
    }}>
      <svg width={svgW} height={svgH} style={{ overflow: 'visible' }}>
        {stages.map((stage, i) => {
          const pct = widthPcts[i] || widthPcts[widthPcts.length - 1]
          const w = totalW * pct
          const x = (totalW - w) / 2 + 20
          const y = i * (stageH + gap) + 20
          const isLast = i === stages.length - 1

          const delay = i * 10
          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          return (
            <g key={i}>
              {/* Stage rectangle */}
              <g
                transform={`translate(${x + w / 2}, ${y + stageH / 2}) scale(${scale})`}
                style={{ transformOrigin: '0 0' }}
              >
                <rect
                  x={-w / 2} y={-stageH / 2}
                  width={w} height={stageH}
                  fill={theme.colors.surface}
                  stroke={isLast ? theme.colors.accent : theme.colors.lineStrong}
                  strokeWidth={isLast ? 2 : 1}
                  rx={theme.borderRadius.sm}
                />
                <text
                  y={4}
                  textAnchor="middle"
                  fontFamily={theme.typography.chineseFont}
                  fontSize={theme.typography.scale.body}
                  fill={isLast ? theme.colors.accent : theme.colors.foreground}
                >
                  {stage.label}
                </text>
              </g>

              {/* Right column: mono number right-aligned */}
              <text
                x={totalW + rightColW + 30}
                y={y + stageH / 2 + 4}
                textAnchor="end"
                fontFamily={theme.typography.monoFont}
                fontSize={theme.typography.scale.h4}
                fontWeight={theme.typography.weight.bold}
                fontVariantNumeric="tabular-nums"
                fill={isLast ? theme.colors.accent : theme.colors.foregroundSecondary}
                opacity={interpolate(frame, [delay + 5, delay + 12], [0, 1], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                })}
              >
                {stage.value}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
