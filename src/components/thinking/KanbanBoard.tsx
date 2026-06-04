import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface KanbanCard {
  /** mono 标签 */
  label: string
  /** 中文任务描述 */
  task: string
}

interface KanbanColumn {
  title: string
  cards: KanbanCard[]
  /** 是否当前列（accent header） */
  current?: boolean
}

interface KanbanBoardProps {
  /** 4 列数据 */
  columns: [KanbanColumn, KanbanColumn, KanbanColumn, KanbanColumn]
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-thinking.kanban — 看板
 *
 * 4 等列，当前列 accent header。
 * 卡片：上 mono label / 下 cn task，列头带计数。
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, theme }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.s4,
      backgroundColor: theme.colors.background,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: theme.spacing.s2,
        width: '100%',
        height: '80%',
        alignItems: 'start',
      }}>
        {columns.map((col, ci) => {
          const colDelay = ci * 8
          const colProgress = spring({
            frame: Math.max(0, frame - colDelay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          return (
            <div
              key={ci}
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                opacity: colProgress,
                transform: `translateY(${interpolate(colProgress, [0, 1], [20, 0])}px)`,
              }}
            >
              {/* Column header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `${theme.spacing.s1}px ${theme.spacing.s2}px`,
                marginBottom: theme.spacing.s2,
                borderBottom: `2px solid ${col.current ? theme.colors.accent : theme.colors.line}`,
              }}>
                <span style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: theme.typography.scale.small,
                  fontWeight: theme.typography.weight.heavy,
                  color: col.current ? theme.colors.accent : theme.colors.foreground,
                  letterSpacing: theme.typography.letterSpacing.caps,
                  textTransform: 'uppercase',
                }}>
                  {col.title}
                </span>
                <span style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: theme.typography.scale.cap,
                  color: col.current ? theme.colors.accent : theme.colors.foregroundMuted,
                  backgroundColor: col.current ? theme.colors.accent3 : theme.colors.surface,
                  padding: '2px 8px',
                  borderRadius: theme.borderRadius.sm,
                  border: `1px solid ${col.current ? theme.colors.accent : theme.colors.line}`,
                }}>
                  {col.cards.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.s1,
                flex: 1,
                overflow: 'hidden',
              }}>
                {col.cards.map((card, ki) => {
                  const cardDelay = colDelay + 10 + ki * 5
                  const cardProgress = spring({
                    frame: Math.max(0, frame - cardDelay),
                    fps,
                    config: { damping: 15, stiffness: 120 },
                  })

                  return (
                    <div
                      key={ki}
                      style={{
                        backgroundColor: theme.colors.surface,
                        border: `1px solid ${col.current ? theme.colors.accent3 : theme.colors.line}`,
                        borderRadius: theme.borderRadius.sm,
                        padding: theme.spacing.s2,
                        opacity: cardProgress,
                        transform: `translateX(${interpolate(cardProgress, [0, 1], [10, 0])}px)`,
                      }}
                    >
                      {/* Mono label */}
                      <div style={{
                        fontFamily: theme.typography.monoFont,
                        fontSize: theme.typography.scale.cap,
                        letterSpacing: theme.typography.letterSpacing.caps,
                        textTransform: 'uppercase',
                        color: col.current ? theme.colors.accent : theme.colors.foregroundMuted,
                        marginBottom: theme.spacing.s1,
                      }}>
                        {card.label}
                      </div>

                      {/* Task description */}
                      <div style={{
                        fontFamily: theme.typography.chineseFont,
                        fontSize: theme.typography.scale.body,
                        color: theme.colors.foreground,
                        lineHeight: theme.typography.lineHeight.body,
                      }}>
                        {card.task}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
