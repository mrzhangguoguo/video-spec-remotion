import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion'
import type { DesignTokens } from '../../themes/_template'

interface BarData {
  /** 类别名 */
  label: string
  /** 数值 */
  value: number
  /** 是否被强调 */
  highlighted?: boolean
}

interface BarChartProps {
  /** 柱形数据 */
  data: BarData[]
  /** 主标题 */
  title?: string
  /** 单位 */
  unit?: string
  /** 主题 tokens */
  theme: DesignTokens
  /** 是否横向 */
  horizontal?: boolean
}

/**
 * broll-charts.bar-chart — 柱形图
 *
 * 离散类别的数值高低对比。
 * 柱子从底部生长入场，数字滚动计数。
 */
export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  unit,
  theme,
  horizontal = false,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing.scenePadding,
      backgroundColor: theme.colors.background,
    }}>
      {/* 标题 */}
      {title && (
        <h3 style={{
          fontFamily: theme.typography.headingFont,
          fontWeight: theme.typography.headingWeight,
          fontSize: theme.typography.baseSize * 1.5,
          color: theme.colors.foreground,
          marginBottom: theme.spacing.componentGap * 2,
          opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          {title}
        </h3>
      )}

      {/* 图表区域 */}
      <div style={{
        display: 'flex',
        flexDirection: horizontal ? 'column' : 'row',
        alignItems: 'flex-end',
        gap: theme.spacing.unit * 2,
        height: horizontal ? 'auto' : '60%',
        width: horizontal ? '100%' : 'auto',
      }}>
        {data.map((bar, i) => {
          const barDelay = i * 8
          const barProgress = spring({
            frame: Math.max(0, frame - barDelay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          const percentage = (bar.value / maxValue) * 100
          const barHeight = percentage * barProgress

          // 数字滚动
          const displayValue = Math.round(bar.value * barProgress)

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: horizontal ? 'row' : 'column',
                alignItems: 'center',
                flex: horizontal ? undefined : 1,
                width: horizontal ? '100%' : undefined,
                gap: theme.spacing.unit,
              }}
            >
              {/* 数值 */}
              <div style={{
                fontFamily: theme.typography.monoFont,
                fontSize: theme.typography.baseSize * 1.25,
                fontWeight: 700,
                color: bar.highlighted ? theme.colors.accent : theme.colors.foreground,
                opacity: interpolate(frame, [barDelay + 5, barDelay + 15], [0, 1], { extrapolateRight: 'clamp' }),
              }}>
                {displayValue}{unit}
              </div>

              {/* 柱子 */}
              <div style={{
                width: horizontal ? `${barHeight}%` : '80%',
                height: horizontal ? theme.spacing.unit * 5 : `${barHeight}%`,
                backgroundColor: bar.highlighted ? theme.colors.accent : theme.colors.muted,
                borderRadius: theme.borderRadius.sm,
                minHeight: horizontal ? undefined : 4,
                minWidth: horizontal ? 4 : undefined,
              }} />

              {/* 标签 */}
              <div style={{
                fontFamily: theme.typography.bodyFont,
                fontSize: theme.typography.baseSize * 0.875,
                color: theme.colors.secondary,
                textAlign: 'center',
              }}>
                {bar.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
