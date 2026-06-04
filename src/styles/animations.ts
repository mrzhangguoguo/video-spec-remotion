/**
 * Animation Presets
 *
 * 对应原版 tokens.css 的入场动画 keyframes。
 * 使用 Remotion 的 spring() / interpolate() 实现帧级精确控制。
 */
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion'
import type { DesignTokens } from '../../themes/_template'

/** 入场动画类型 */
export type EntranceType = 'enter-up' | 'stick-in' | 'line-in' | 'slam' | 'fade'

/**
 * 通用入场动画 hook
 * 对应原版 @keyframes enter-up / stick-in / line-in
 */
export function useEntrance(
  theme: DesignTokens,
  type: EntranceType = 'enter-up',
  delay: number = 0,
) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const f = Math.max(0, frame - delay)

  switch (type) {
    case 'enter-up': {
      // 原版: opacity 0→1, translateY 8px→0
      const progress = spring({ frame: f, fps, config: { damping: 20, stiffness: 100 } })
      return {
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [8, 0])}px)`,
      }
    }

    case 'stick-in': {
      // 原版: opacity 0→1, scale 0.92→1, rotate -1.5°→0
      const progress = spring({ frame: f, fps, config: { damping: 15, stiffness: 120 } })
      return {
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [0.92, 1])}) rotate(${interpolate(progress, [0, 1], [-1.5, 0])}deg)`,
      }
    }

    case 'line-in': {
      // 原版: scaleX 0→1
      const progress = interpolate(f, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
      return {
        transform: `scaleX(${progress})`,
        transformOrigin: 'left',
      }
    }

    case 'slam': {
      // 砸入: scale 1.15→1, 弹性强
      const progress = spring({
        frame: f,
        fps,
        config: { damping: 12, stiffness: 200, mass: 0.8 },
      })
      return {
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [1.15, 1])}) translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
      }
    }

    case 'fade': {
      // 纯淡入
      const progress = interpolate(f, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
      return {
        opacity: progress,
        transform: 'none',
      }
    }
  }
}

/**
 * Pulse 动画 — 用于强调元素的单次脉冲
 */
export function usePulse(
  triggerFrame: number,
  config?: { damping?: number; stiffness?: number },
) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const progress = spring({
    frame: Math.max(0, frame - triggerFrame),
    fps,
    config: {
      damping: config?.damping || 6,
      stiffness: config?.stiffness || 300,
      mass: 0.5,
    },
  })

  return interpolate(progress, [0, 0.5, 1], [1, 1.08, 1])
}

/**
 * 数字滚动 — 用于大数字的计数动画
 */
export function useCountUp(
  target: number,
  durationFrames: number = 30,
) {
  const frame = useCurrentFrame()
  const progress = interpolate(
    frame,
    [0, durationFrames],
    [0, target],
    { extrapolateRight: 'clamp' },
  )
  return Math.round(progress)
}

/**
 * 弹簧式滑入
 */
export function useSlideIn(
  direction: 'left' | 'right' | 'up' | 'down' = 'left',
  distance: number = 60,
  delay: number = 0,
) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const f = Math.max(0, frame - delay)

  const progress = spring({ frame: f, fps, config: { damping: 18, stiffness: 120 } })

  const offset = interpolate(progress, [0, 1], [distance, 0])
  const transforms: Record<string, string> = {
    left: `translateX(${-offset}px)`,
    right: `translateX(${offset}px)`,
    up: `translateY(${-offset}px)`,
    down: `translateY(${offset}px)`,
  }

  return {
    opacity: progress,
    transform: transforms[direction],
  }
}
