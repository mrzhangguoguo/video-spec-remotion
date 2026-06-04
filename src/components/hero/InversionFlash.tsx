import React from 'react'
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface InversionFlashProps {
  /** 闪烁次数（1-2，对应 spec: max 2 per video） */
  flashes?: number
  /** 每次闪烁持续帧数（6-12，对应 200-400ms @30fps） */
  durationFrames?: number
  /** 起始帧 */
  startFrame?: number
  theme: DesignTokens
}

/**
 * broll-hero.inversion-flash — 反色闪屏
 *
 * 黑 ↔ 白 steps(1) 瞬切。
 * 6-12 帧（200-400ms @30fps）。
 * 每视频最多 2 次，不连续。
 */
export const InversionFlash: React.FC<InversionFlashProps> = ({
  flashes = 1,
  durationFrames = 8,
  startFrame = 0,
  theme,
}) => {
  const frame = useCurrentFrame()

  // 限制最大 2 次
  const safeFlashes = Math.min(flashes, 2)
  // 每次闪烁的间隔（至少间隔 durationFrames 帧，确保不连续）
  const gapFrames = durationFrames + 4

  // 计算当前帧处于哪个阶段
  let isWhite = false
  for (let i = 0; i < safeFlashes; i++) {
    const flashStart = startFrame + i * gapFrames
    const flashEnd = flashStart + durationFrames
    if (frame >= flashStart && frame < flashEnd) {
      isWhite = true
      break
    }
  }

  // steps(1) 瞬切效果 — 无渐变
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: isWhite ? theme.colors.flash : theme.colors.background,
      // steps(1) 瞬切 — 无 transition
    }} />
  )
}
