import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface ChatMessage {
  role: 'user' | 'ai'
  text: string
  /** 出现帧 */
  showAt: number
}

interface ChatThreadProps {
  theme: DesignTokens
  messages: ChatMessage[]
  /** 流式光标字符（默认 ▍） */
  cursorChar?: string
}

/**
 * broll-ui.chat-thread — 聊天对话
 *
 * user bubble right-aligned accent border transparent bg,
 * AI bubble left-aligned surface fill no border,
 * max-width 70%, streaming cursor ▍
 */
export const ChatThread: React.FC<ChatThreadProps> = ({
  theme,
  messages,
  cursorChar = '▍',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.s2,
        width: '100%',
      }}
    >
      {messages.map((msg, i) => {
        const isUser = msg.role === 'user'
        const localFrame = Math.max(0, frame - msg.showAt)
        if (localFrame < 0) return null

        const progress = spring({
          frame: localFrame,
          fps,
          config: { damping: 18, stiffness: 120 },
        })

        // AI 消息流式显示
        const isStreaming = !isUser && localFrame < msg.text.length * 2
        const visibleChars = isUser
          ? msg.text.length
          : Math.min(msg.text.length, Math.floor(localFrame / 2))
        const displayText = msg.text.slice(0, visibleChars)

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [12, 0])}px)`,
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: `${theme.spacing.s2}px ${theme.spacing.s3}px`,
                borderRadius: theme.borderRadius.md,
                fontFamily: theme.typography.sansFont,
                fontSize: theme.typography.scale.body,
                lineHeight: theme.typography.lineHeight.body,
                backgroundColor: isUser ? 'transparent' : theme.colors.surface,
                border: isUser
                  ? `1px solid ${theme.colors.accent}`
                  : 'none',
                color: isUser ? theme.colors.accent : theme.colors.foreground,
                whiteSpace: 'pre-wrap',
              }}
            >
              {displayText}
              {isStreaming && (
                <span style={{ color: theme.colors.accent }}>{cursorChar}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
