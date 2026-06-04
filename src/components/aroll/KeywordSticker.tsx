import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion'
import type { DesignTokens } from '../../themes/_template'

interface StickerItem {
  /** 关键词文字 */
  text: string
  /** X 位置（百分比 0-100） */
  x: number
  /** Y 位置（百分比 0-100） */
  y: number
  /** 出现的帧 */
  showAt: number
  /** 是否为强调（accent 色反色） */
  emphasized?: boolean
  /** 引线指向的坐标（可选） */
  lineTo?: { x: number; y: number }
}

interface KeywordStickerProps {
  /** 贴纸列表 */
  stickers: StickerItem[]
  /** 主题 tokens */
  theme: DesignTokens
  /** 每个贴纸的停留帧数 */
  duration?: number
}

/**
 * aroll.keyword-sticker — 关键词贴纸
 *
 * 讲者抛出新名词时，在画面里"贴"上关键词做视觉锚点。
 * 支持引线指向画面具体位置（Johnny Harris / Veritasium 式）。
 */
export const KeywordSticker: React.FC<KeywordStickerProps> = ({
  stickers,
  theme,
  duration = 90,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
    }}>
      {stickers.map((sticker, i) => {
        const isShowing = frame >= sticker.showAt && frame < sticker.showAt + duration
        if (!isShowing) return null

        const localFrame = frame - sticker.showAt

        // Pop-in 入场
        const scale = spring({
          frame: localFrame,
          fps,
          config: { damping: 10, stiffness: 300, mass: 0.6 },
        })

        const opacity = interpolate(
          localFrame,
          [0, 6, duration - 10, duration],
          [0, 1, 1, 0],
          { extrapolateRight: 'clamp' }
        )

        // 引线动画
        const lineProgress = sticker.lineTo
          ? interpolate(localFrame, [5, 20], [0, 1], { extrapolateRight: 'clamp' })
          : 0

        return (
          <React.Fragment key={i}>
            {/* 引线 */}
            {sticker.lineTo && lineProgress > 0 && (
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              >
                <line
                  x1={`${sticker.x}%`}
                  y1={`${sticker.y}%`}
                  x2={`${sticker.x + (sticker.lineTo.x - sticker.x) * lineProgress}%`}
                  y2={`${sticker.y + (sticker.lineTo.y - sticker.y) * lineProgress}%`}
                  stroke={theme.colors.accent}
                  strokeWidth={1}
                  strokeDasharray="4 2"
                  opacity={opacity}
                />
              </svg>
            )}

            {/* 标签 */}
            <div
              style={{
                position: 'absolute',
                left: `${sticker.x}%`,
                top: `${sticker.y}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
                fontFamily: theme.typography.monoFont,
                fontSize: theme.typography.baseSize * 0.875,
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: theme.borderRadius.sm,
                backgroundColor: sticker.emphasized
                  ? theme.colors.accent
                  : `${theme.colors.background}DD`,
                color: sticker.emphasized
                  ? theme.colors.background
                  : theme.colors.foreground,
                border: `1px solid ${sticker.emphasized ? theme.colors.accent : theme.colors.muted}`,
                whiteSpace: 'nowrap',
              }}
            >
              {sticker.text}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}
