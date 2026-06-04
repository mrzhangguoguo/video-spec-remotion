import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface SparklinePoint {
  value: number
}

interface KpiCardProps {
  theme: DesignTokens
  /** 大数字 */
  value: number
  /** 单位 */
  unit: string
  /** 标签 */
  label: string
  /** 是否为焦点卡片（左上角 accent 角标） */
  focused?: boolean
  /** 可选 sparkline 数据 */
  sparkline?: SparklinePoint[]
  /** 入场延迟帧 */
  delay?: number
}

/**
 * 单个 KPI 卡片
 *
 * KPI card = big number + unit + label,
 * focus card top-left accent corner mark,
 * sparkline hairline + single accent highlight dot
 */
const KpiCard: React.FC<KpiCardProps> = ({
  theme,
  value,
  unit,
  label,
  focused,
  sparkline,
  delay = 0,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = Math.max(0, frame - delay)

  const progress = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 120 },
  })

  // 数字递增动画
  const animatedValue = Math.round(
    interpolate(localFrame, [5, 35], [0, value], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  )

  // Sparkline 渲染
  const sparklineWidth = 80
  const sparklineHeight = 24
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null

    const values = sparkline.map((p) => p.value)
    const max = Math.max(...values)
    const min = Math.min(...values)
    const range = max - min || 1

    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * sparklineWidth
      const y = sparklineHeight - ((v - min) / range) * sparklineHeight
      return { x, y }
    })

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

    // 最高点 highlight dot
    const maxIndex = values.indexOf(max)
    const highlightPoint = points[maxIndex]

    return (
      <svg
        width={sparklineWidth}
        height={sparklineHeight}
        style={{ marginTop: theme.spacing.s1 }}
      >
        <path
          d={pathD}
          fill="none"
          stroke={theme.colors.line}
          strokeWidth={1}
        />
        <circle
          cx={highlightPoint.x}
          cy={highlightPoint.y}
          r={3}
          fill={theme.colors.accent}
        />
      </svg>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.line}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.s3,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [12, 0])}px)`,
      }}
    >
      {/* Focus corner mark */}
      {focused && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 16,
            height: 16,
            borderTop: `2px solid ${theme.colors.accent}`,
            borderLeft: `2px solid ${theme.colors.accent}`,
          }}
        />
      )}

      {/* Big number + unit */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          style={{
            fontFamily: theme.typography.condensedFont,
            fontSize: theme.typography.scale.h1,
            fontWeight: theme.typography.weight.heavy,
            letterSpacing: '-0.04em',
            lineHeight: 0.86,
            fontVariantNumeric: 'tabular-nums',
            color: theme.colors.foreground,
          }}
        >
          {animatedValue}
        </span>
        <span
          style={{
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.body,
            color: theme.colors.foregroundSecondary,
          }}
        >
          {unit}
        </span>
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: theme.typography.monoFont,
          fontSize: theme.typography.scale.cap,
          letterSpacing: theme.typography.letterSpacing.caps,
          textTransform: 'uppercase',
          color: theme.colors.foregroundMuted,
          marginTop: theme.spacing.s1,
        }}
      >
        {label}
      </div>

      {/* Sparkline */}
      {renderSparkline()}
    </div>
  )
}

interface DashboardProps {
  theme: DesignTokens
  /** KPI 卡片列表 */
  cards: Array<{
    value: number
    unit: string
    label: string
    focused?: boolean
    sparkline?: SparklinePoint[]
  }>
}

/**
 * broll-ui.dashboard — 仪表盘
 *
 * KPI card = big number + unit + label,
 * focus card top-left accent corner mark,
 * sparkline hairline + single accent highlight dot,
 * top-right accent dot + LIVE caps
 */
export const Dashboard: React.FC<DashboardProps> = ({ theme, cards }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const entryProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  })

  // LIVE 标记闪烁
  const liveVisible = Math.floor(frame / fps) % 2 === 0

  return (
    <div
      style={{
        position: 'relative',
        padding: theme.spacing.s3,
        opacity: entryProgress,
      }}
    >
      {/* LIVE indicator — top right */}
      <div
        style={{
          position: 'absolute',
          top: theme.spacing.s2,
          right: theme.spacing.s2,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          opacity: liveVisible ? 1 : 0.3,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: theme.colors.accent,
          }}
        />
        <span
          style={{
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.cap,
            letterSpacing: theme.typography.letterSpacing.caps,
            textTransform: 'uppercase',
            color: theme.colors.accent,
          }}
        >
          Live
        </span>
      </div>

      {/* KPI Cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(cards.length, 3)}, 1fr)`,
          gap: theme.spacing.s2,
        }}
      >
        {cards.map((card, i) => (
          <KpiCard
            key={i}
            theme={theme}
            value={card.value}
            unit={card.unit}
            label={card.label}
            focused={card.focused}
            sparkline={card.sparkline}
            delay={i * 8}
          />
        ))}
      </div>
    </div>
  )
}
