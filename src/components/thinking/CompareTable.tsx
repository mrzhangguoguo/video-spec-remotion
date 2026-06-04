import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface CompareRow {
  dimension: string
  values: string[]
  /** 最佳值索引 */
  bestIdx?: number
}

interface CompareTableProps {
  /** 候选方案名称 */
  candidates: string[]
  /** 对比维度行 */
  rows: CompareRow[]
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-thinking.compare-table — 对比表
 *
 * 表头左 mono caps 维度 / 右 cn 800 候选名。
 * 每行最佳 = accent + ★ 前缀，hairline 行分隔无竖线。
 */
export const CompareTable: React.FC<CompareTableProps> = ({
  candidates,
  rows,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Header entrance
  const headerProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  })

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.s5,
      backgroundColor: theme.colors.background,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 900,
      }}>
        {/* Header row */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${theme.colors.lineStrong}`,
          paddingBottom: theme.spacing.s2,
          marginBottom: theme.spacing.s1,
          opacity: headerProgress,
          transform: `translateY(${interpolate(headerProgress, [0, 1], [10, 0])}px)`,
        }}>
          {/* Dimension column header */}
          <div style={{
            flex: '0 0 180px',
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.cap,
            letterSpacing: theme.typography.letterSpacing.caps,
            textTransform: 'uppercase',
            color: theme.colors.foregroundMuted,
            paddingRight: theme.spacing.s2,
          }}>
            Dimension
          </div>

          {/* Candidate headers */}
          {candidates.map((name, i) => {
            const delay = 5 + i * 5
            const progress = spring({
              frame: Math.max(0, frame - delay),
              fps,
              config: { damping: 15, stiffness: 120 },
            })

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  fontFamily: theme.typography.chineseFont,
                  fontSize: theme.typography.scale.h4,
                  fontWeight: theme.typography.weight.heavy,
                  color: theme.colors.foreground,
                  textAlign: 'center',
                  opacity: progress,
                }}
              >
                {name}
              </div>
            )
          })}
        </div>

        {/* Data rows */}
        {rows.map((row, ri) => {
          const delay = 15 + ri * 6
          const rowProgress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          return (
            <div
              key={ri}
              style={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: `1px solid ${theme.colors.line}`,
                padding: `${theme.spacing.s2}px 0`,
                opacity: rowProgress,
                transform: `translateY(${interpolate(rowProgress, [0, 1], [8, 0])}px)`,
              }}
            >
              {/* Dimension label */}
              <div style={{
                flex: '0 0 180px',
                fontFamily: theme.typography.monoFont,
                fontSize: theme.typography.scale.small,
                letterSpacing: theme.typography.letterSpacing.caps,
                textTransform: 'uppercase',
                color: theme.colors.foregroundMuted,
                paddingRight: theme.spacing.s2,
              }}>
                {row.dimension}
              </div>

              {/* Values */}
              {row.values.map((value, vi) => {
                const isBest = row.bestIdx === vi
                const cellDelay = delay + vi * 3
                const cellProgress = spring({
                  frame: Math.max(0, frame - cellDelay),
                  fps,
                  config: { damping: 15, stiffness: 120 },
                })

                return (
                  <div
                    key={vi}
                    style={{
                      flex: 1,
                      fontFamily: theme.typography.sansFont,
                      fontSize: theme.typography.scale.body,
                      fontWeight: isBest ? theme.typography.weight.heavy : theme.typography.weight.regular,
                      color: isBest ? theme.colors.accent : theme.colors.foreground,
                      textAlign: 'center',
                      opacity: cellProgress,
                    }}
                  >
                    {isBest && (
                      <span style={{ marginRight: 4 }}>★</span>
                    )}
                    {value}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
