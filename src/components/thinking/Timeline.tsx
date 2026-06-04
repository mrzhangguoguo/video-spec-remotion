import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion'
import type { DesignTokens } from '../../themes/_template'

interface TimelineEvent {
  /** 年份/日期 */
  year: string
  /** 标题 */
  title: string
  /** 描述（可选） */
  desc?: string
  /** 是否关键节点 */
  highlighted?: boolean
}

interface TimelineProps {
  /** 时间线事件 */
  events: TimelineEvent[]
  /** 主题 tokens */
  theme: DesignTokens
  /** 布局方向 */
  direction?: 'horizontal' | 'vertical'
}

/**
 * broll-thinking.timeline-row — 时间线
 *
 * 水平时间轴 + 事件卡片上下交错。
 * 节点从左到右逐个点亮。
 */
export const Timeline: React.FC<TimelineProps> = ({
  events,
  theme,
  direction = 'horizontal',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

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
      <div style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        alignItems: direction === 'horizontal' ? 'center' : 'flex-start',
        gap: 0,
        position: 'relative',
        width: '100%',
      }}>
        {/* 连接线 */}
        <div style={{
          position: 'absolute',
          ...(direction === 'horizontal'
            ? { top: '50%', left: 0, right: 0, height: 2, transform: 'translateY(-50%)' }
            : { left: 12, top: 0, bottom: 0, width: 2 }),
          backgroundColor: theme.colors.muted,
        }} />

        {/* 进度线 */}
        <div style={{
          position: 'absolute',
          ...(direction === 'horizontal'
            ? { top: '50%', left: 0, height: 2, transform: 'translateY(-50%)' }
            : { left: 12, top: 0, width: 2 }),
          backgroundColor: theme.colors.accent,
          ...(direction === 'horizontal'
            ? { width: `${interpolate(frame, [0, events.length * 12], [0, 100], { extrapolateRight: 'clamp' })}%` }
            : { height: `${interpolate(frame, [0, events.length * 12], [0, 100], { extrapolateRight: 'clamp' })}%` }),
        }} />

        {events.map((event, i) => {
          const delay = i * 12

          // 节点点亮
          const nodeScale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 8, stiffness: 200 },
          })

          const opacity = interpolate(
            frame,
            [delay, delay + 8],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          )

          // 卡片弹出
          const cardY = spring({
            frame: Math.max(0, frame - delay - 5),
            fps,
            config: { damping: 15, stiffness: 120 },
          })
          const cardOffset = interpolate(cardY, [0, 1], [i % 2 === 0 ? -30 : 30, 0])

          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: direction === 'horizontal' ? 'column' : 'row',
                alignItems: 'center',
                position: 'relative',
                opacity,
              }}
            >
              {/* 节点 */}
              <div style={{
                width: event.highlighted ? 20 : 14,
                height: event.highlighted ? 20 : 14,
                borderRadius: '50%',
                backgroundColor: event.highlighted ? theme.colors.accent : theme.colors.muted,
                border: `3px solid ${theme.colors.background}`,
                transform: `scale(${nodeScale})`,
                zIndex: 2,
                flexShrink: 0,
              }} />

              {/* 卡片 */}
              <div style={{
                ...(direction === 'horizontal'
                  ? { [i % 2 === 0 ? 'bottom' : 'top']: '50%', marginTop: i % 2 === 0 ? undefined : 16, marginBottom: i % 2 === 0 ? 16 : undefined }
                  : { marginLeft: 20 }),
                transform: direction === 'horizontal' ? `translateY(${cardOffset}px)` : undefined,
                textAlign: direction === 'horizontal' ? 'center' : 'left',
                padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
              }}>
                <div style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: theme.typography.baseSize * 0.875,
                  color: event.highlighted ? theme.colors.accent : theme.colors.secondary,
                  fontWeight: event.highlighted ? 700 : 400,
                }}>
                  {event.year}
                </div>
                <div style={{
                  fontFamily: theme.typography.headingFont,
                  fontWeight: theme.typography.headingWeight,
                  fontSize: theme.typography.baseSize * 1.125,
                  color: theme.colors.foreground,
                  marginTop: theme.spacing.unit / 2,
                }}>
                  {event.title}
                </div>
                {event.desc && (
                  <div style={{
                    fontFamily: theme.typography.bodyFont,
                    fontSize: theme.typography.baseSize * 0.875,
                    color: theme.colors.secondary,
                    marginTop: theme.spacing.unit / 2,
                    maxWidth: 160,
                  }}>
                    {event.desc}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
