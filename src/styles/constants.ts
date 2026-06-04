/**
 * Animation Constants
 *
 * 统一的 spring 配置和动画参数，确保所有组件行为一致。
 * 对应原版 tokens.css 的 motion 区块。
 */

/** spring 配置预设 */
export const SPRING = {
  /** 入场柔 — expo.out 感觉 */
  entrance: { damping: 20, stiffness: 100 },
  /** 砸入 — 更强的弹跳 */
  slam: { damping: 12, stiffness: 200, mass: 0.8 },
  /** 弹入 — keyword-sticker 专用 */
  pop: { damping: 10, stiffness: 300, mass: 0.6 },
  /** 轻弹 — 通用微动效 */
  light: { damping: 15, stiffness: 120 },
  /** 脉冲 — 强调用 */
  pulse: { damping: 6, stiffness: 300, mass: 0.5 },
  /** 柔和 — 不想太抢眼 */
  soft: { damping: 25, stiffness: 80 },
} as const

/** 入场位移距离（px） — 对应原版: 8-16px */
export const DISPLACEMENT = {
  /** 8px · 微移动 */
  small: 8,
  /** 12px · 标准 */
  medium: 12,
  /** 16px · 大移动 */
  large: 16,
  /** 20px · hero 级 */
  hero: 20,
} as const

/** 淡入帧数 — 用于 interpolate 的范围 */
export const FADE_FRAMES = {
  /** 快淡入 · 6 帧 */
  fast: 6,
  /** 标准淡入 · 10 帧 */
  normal: 10,
  /** 慢淡入 · 15 帧 */
  slow: 15,
  /** hero 级 · 20 帧 */
  hero: 20,
} as const

/** 元素延迟间隔（帧） — 用于列表/网格的交错入场 */
export const STAGGER = {
  /** 3 帧 · 紧凑 */
  tight: 3,
  /** 5 帧 · 标准 */
  normal: 5,
  /** 8 帧 · 宽松 */
  loose: 8,
  /** 12 帧 · 很松 */
  veryLoose: 12,
} as const

/** 图表动画参数 */
export const CHART = {
  /** 柱子生长帧数 */
  barGrowFrames: 20,
  /** 数据点弹入延迟 */
  dotDelay: 3,
  /** 轴线绘制帧数 */
  axisDrawFrames: 15,
  /** 数字滚动帧数 */
  countFrames: 30,
} as const

/** 字幕参数 */
export const SUBTITLE = {
  /** 每词帧数（默认 30fps 下约 260ms/词） */
  framesPerWord: 8,
  /** 底线动画帧数 */
  underlineFrames: 10,
} as const
