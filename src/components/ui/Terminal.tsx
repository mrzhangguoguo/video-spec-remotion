import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface TerminalLine {
  /** 行内容 */
  text: string
  /** 类型：命令 / 输出 / meta */
  type?: 'command' | 'output' | 'meta'
}

interface TerminalProps {
  theme: DesignTokens
  /** 终端行内容 */
  lines: TerminalLine[]
  /** 打字速度（每字符帧数，默认 60ms @ 30fps = ~2 帧） */
  charFrames?: number
  /** 开始帧 */
  startFrame?: number
  /** 尾部 stat tokens / latency / cost 等 meta 信息 */
  tailMeta?: string
}

/**
 * broll-ui.terminal — 终端模拟器
 *
 * mono font ~30px, surface bg + hairline border,
 * cursor 10x18 solid block 1s blink accent,
 * typing 60ms/char, tail tokens/latency/cost in fg 42%
 */
export const Terminal: React.FC<TerminalProps> = ({
  theme,
  lines,
  charFrames = 2,
  startFrame = 0,
  tailMeta,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = Math.max(0, frame - startFrame)

  // 入场动画
  const entryProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 20, stiffness: 100 },
  })

  // 计算每行可见字符数
  const renderedLines: { text: string; type: string; visibleChars: number }[] = []
  let frameAccum = 0
  for (const line of lines) {
    const lineStart = frameAccum
    const typeDuration = line.text.length * charFrames
    frameAccum += typeDuration

    const elapsed = localFrame - lineStart
    const visibleChars = Math.max(
      0,
      Math.min(line.text.length, Math.floor(elapsed / charFrames)),
    )

    renderedLines.push({
      text: line.text,
      type: line.type || 'output',
      visibleChars,
    })
  }

  // 光标闪烁（1s = fps 帧）
  const cursorVisible = Math.floor(localFrame / fps) % 2 === 0

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.line}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.s3,
        fontFamily: theme.typography.monoFont,
        fontSize: 30,
        lineHeight: theme.typography.lineHeight.body,
        color: theme.colors.foreground,
        opacity: entryProgress,
        transform: `translateY(${interpolate(entryProgress, [0, 1], [8, 0])}px)`,
        overflow: 'hidden',
      }}
    >
      {renderedLines.map((line, i) => {
        const displayText = line.text.slice(0, line.visibleChars)
        const isCurrentLine = i === renderedLines.length - 1
        const showCursor = isCurrentLine && cursorVisible && line.visibleChars < line.text.length

        return (
          <div
            key={i}
            style={{
              color: line.type === 'meta'
                ? theme.colors.foregroundMuted
                : line.type === 'command'
                  ? theme.colors.accent
                  : theme.colors.foregroundSecondary,
              fontStyle: line.type === 'meta' ? 'italic' : 'normal',
            }}
          >
            {line.type === 'command' && (
              <span style={{ color: theme.colors.accent, marginRight: 8 }}>$</span>
            )}
            {displayText}
            {showCursor && (
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 18,
                  backgroundColor: theme.colors.accent,
                  marginLeft: 1,
                  verticalAlign: 'text-bottom',
                }}
              />
            )}
          </div>
        )
      })}

      {/* 尾部 meta 行 */}
      {tailMeta && (
        <div
          style={{
            marginTop: theme.spacing.s1,
            color: theme.colors.foregroundMuted,
            fontSize: theme.typography.scale.small,
          }}
        >
          {tailMeta}
        </div>
      )}
    </div>
  )
}
