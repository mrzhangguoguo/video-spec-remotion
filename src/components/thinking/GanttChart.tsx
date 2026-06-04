import React from 'react'
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface GanttTask {
  name: string
  /** 开始周 (0-indexed) */
  startWeek: number
  /** 持续周数 */
  duration: number
  /** 是否里程碑 */
  milestone?: boolean
}

interface GanttChartProps {
  /** 任务列表 */
  tasks: GanttTask[]
  /** 总周数 */
  totalWeeks?: number
  /** 主题 tokens */
  theme: DesignTokens
}

/**
 * broll-thinking.gantt — 甘特图
 *
 * 左列任务名 + 右侧周条，条高 26px 圆角 2px。
 * 关键里程碑 accent，表头 W1-W10 mono caps。
 */
export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  totalWeeks = 10,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const weekHeaders = Array.from({ length: totalWeeks }, (_, i) => `W${i + 1}`)

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
        {/* Header */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${theme.colors.lineStrong}`,
          paddingBottom: theme.spacing.s1,
          marginBottom: theme.spacing.s2,
        }}>
          {/* Task name column */}
          <div style={{
            width: 160,
            flexShrink: 0,
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.cap,
            letterSpacing: theme.typography.letterSpacing.caps,
            textTransform: 'uppercase',
            color: theme.colors.foregroundMuted,
            paddingRight: theme.spacing.s2,
          }}>
            Task
          </div>

          {/* Week headers */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: `repeat(${totalWeeks}, 1fr)`,
            gap: 0,
          }}>
            {weekHeaders.map((w, i) => {
              const delay = i * 2
              const progress = spring({
                frame: Math.max(0, frame - delay),
                fps,
                config: { damping: 15, stiffness: 120 },
              })

              return (
                <div
                  key={i}
                  style={{
                    fontFamily: theme.typography.monoFont,
                    fontSize: theme.typography.scale.cap,
                    letterSpacing: theme.typography.letterSpacing.caps,
                    textTransform: 'uppercase',
                    color: theme.colors.foregroundMuted,
                    textAlign: 'center',
                    opacity: progress,
                  }}
                >
                  {w}
                </div>
              )
            })}
          </div>
        </div>

        {/* Task rows */}
        {tasks.map((task, ti) => {
          const delay = 10 + ti * 6
          const rowProgress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          const barDelay = delay + 5
          const barProgress = spring({
            frame: Math.max(0, frame - barDelay),
            fps,
            config: { damping: 15, stiffness: 120 },
          })

          const leftPct = (task.startWeek / totalWeeks) * 100
          const widthPct = (task.duration / totalWeeks) * 100

          return (
            <div
              key={ti}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: theme.spacing.s1,
                opacity: rowProgress,
                transform: `translateY(${interpolate(rowProgress, [0, 1], [8, 0])}px)`,
              }}
            >
              {/* Task name */}
              <div style={{
                width: 160,
                flexShrink: 0,
                fontFamily: theme.typography.sansFont,
                fontSize: theme.typography.scale.body,
                fontWeight: task.milestone ? theme.typography.weight.heavy : theme.typography.weight.regular,
                color: task.milestone ? theme.colors.accent : theme.colors.foreground,
                paddingRight: theme.spacing.s2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {task.milestone && <span style={{ marginRight: 4 }}>★</span>}
                {task.name}
              </div>

              {/* Bar area */}
              <div style={{
                flex: 1,
                height: 26,
                position: 'relative',
              }}>
                {/* Grid lines */}
                {weekHeaders.map((_, wi) => (
                  <div
                    key={wi}
                    style={{
                      position: 'absolute',
                      left: `${(wi / totalWeeks) * 100}%`,
                      top: 0,
                      bottom: 0,
                      width: 1,
                      backgroundColor: theme.colors.line,
                    }}
                  />
                ))}

                {/* Task bar */}
                <div style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  top: 0,
                  width: `${widthPct * barProgress}%`,
                  height: 26,
                  backgroundColor: task.milestone ? theme.colors.accent : theme.colors.foregroundFaint,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  <span style={{
                    fontFamily: theme.typography.monoFont,
                    fontSize: theme.typography.scale.meta,
                    color: task.milestone ? theme.colors.background : theme.colors.foregroundSecondary,
                    letterSpacing: theme.typography.letterSpacing.caps,
                    textTransform: 'uppercase',
                    opacity: barProgress,
                  }}>
                    {task.duration}w
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
