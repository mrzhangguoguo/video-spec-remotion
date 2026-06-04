/**
 * Decorative Components
 *
 * 对应原版 tokens.css 的 spec-sheet 装饰工具类。
 * 所有装饰组件都是纯展示，不含动画逻辑。
 */
import React from 'react'
import type { DesignTokens } from '../../themes/_template'

/* ============================================================
   四角十字针脚 — CornerCross
   对应原版 .cross / .cross--tl / .cross--tr / .cross--bl / .cross--br
   ============================================================ */

export type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export const CornerCross: React.FC<{
  position: CornerPosition
  color?: string
  size?: number
}> = ({ position, color = '#FFFFFF', size = 12 }) => {
  const posStyle: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    pointerEvents: 'none',
    ...(position.includes('top') ? { top: -size / 2 } : { bottom: -size / 2 }),
    ...(position.includes('left') ? { left: -size / 2 } : { right: -size / 2 }),
  }

  return (
    <div style={posStyle}>
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: 1,
        height: '100%',
        backgroundColor: color,
        transform: 'translateX(-0.5px)',
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        width: '100%',
        height: 1,
        backgroundColor: color,
        transform: 'translateY(-0.5px)',
      }} />
    </div>
  )
}

/** 四角十字针脚组 — 一次贴四个角 */
export const CornerCrossGroup: React.FC<{
  color?: string
  size?: number
}> = ({ color, size }) => (
  <>
    <CornerCross position="top-left" color={color} size={size} />
    <CornerCross position="top-right" color={color} size={size} />
    <CornerCross position="bottom-left" color={color} size={size} />
    <CornerCross position="bottom-right" color={color} size={size} />
  </>
)

/* ============================================================
   刻度尺 — TickRule
   对应原版 .tick-rule
   ============================================================ */

export const TickRule: React.FC<{
  theme: DesignTokens
  width?: number | string
}> = ({ theme, width = '100%' }) => {
  const count = 40
  return (
    <div style={{
      display: 'flex',
      gap: 4,
      alignItems: 'flex-end',
      height: 14,
      width,
    }}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            width: 1,
            backgroundColor: theme.colors.foregroundMuted,
            height: i % 5 === 0 ? 14 : 7,
            opacity: i % 5 === 0 ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  )
}

/* ============================================================
   编号前缀 — Idx
   对应原版 .idx — accent 短杠 + mono caps
   ============================================================ */

export const Idx: React.FC<{
  theme: DesignTokens
  text: string
}> = ({ theme, text }) => (
  <div style={{
    fontFamily: theme.typography.monoFont,
    fontSize: theme.typography.scale.cap,
    letterSpacing: theme.typography.letterSpacing.mission,
    color: theme.colors.foregroundMuted,
    textTransform: 'uppercase',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
  }}>
    <span style={{
      display: 'inline-block',
      width: 22,
      height: 1,
      backgroundColor: theme.colors.accent,
    }} />
    {text}
  </div>
)

/* ============================================================
   章节小标 — Eyebrow
   对应原版 .eyebrow — accent 圆点引导
   ============================================================ */

export const Eyebrow: React.FC<{
  theme: DesignTokens
  text: string
}> = ({ theme, text }) => (
  <div style={{
    fontFamily: theme.typography.monoFont,
    fontSize: theme.typography.scale.cap,
    letterSpacing: theme.typography.letterSpacing.mission,
    textTransform: 'uppercase',
    color: theme.colors.accent,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  }}>
    <span style={{ fontSize: 8 }}>●</span>
    {text}
  </div>
)

/* ============================================================
   居中分隔标签 — RuleLabel
   对应原版 .rule-label — 文字两侧 hairline 延伸
   ============================================================ */

export const RuleLabel: React.FC<{
  theme: DesignTokens
  text: string
}> = ({ theme, text }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontFamily: theme.typography.monoFont,
    fontSize: theme.typography.scale.cap,
    letterSpacing: theme.typography.letterSpacing.caps,
    color: theme.colors.foregroundMuted,
  }}>
    <div style={{ flex: 1, height: 1, backgroundColor: theme.colors.line }} />
    {text}
    <div style={{ flex: 1, height: 1, backgroundColor: theme.colors.line }} />
  </div>
)

/* ============================================================
   spec-sheet 信息行 — SpecRow
   对应原版 .spec-row — 仿 SpaceX 发射页
   ============================================================ */

export const SpecRow: React.FC<{
  theme: DesignTokens
  label: string
  value: string
  accent?: boolean
}> = ({ theme, label, value, accent }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    fontFamily: theme.typography.monoFont,
    fontSize: theme.typography.scale.cap,
    letterSpacing: theme.typography.letterSpacing.mission,
    color: theme.colors.foregroundMuted,
    textTransform: 'uppercase',
  }}>
    {label}
    <span style={{
      color: accent ? theme.colors.accent : theme.colors.foreground,
      fontWeight: theme.typography.weight.mid,
    }}>
      {value}
    </span>
  </div>
)

/* ============================================================
   坐标块 — Coord
   对应原版 .coord — 32°N 117°E 类装饰
   ============================================================ */

export const Coord: React.FC<{
  theme: DesignTokens
  text: string
}> = ({ theme, text }) => (
  <div style={{
    fontFamily: theme.typography.monoFont,
    fontSize: theme.typography.scale.cap,
    letterSpacing: theme.typography.letterSpacing.caps,
    color: theme.colors.foregroundMuted,
    textTransform: 'uppercase',
  }}>
    {text}
  </div>
)

/* ============================================================
   术语方括号 — Bracket
   对应原版 .bracket — [KEYWORD]
   ============================================================ */

export const Bracket: React.FC<{
  theme: DesignTokens
  text: string
}> = ({ theme, text }) => (
  <span>
    <span style={{ color: theme.colors.accent, marginRight: 6 }}>[</span>
    {text}
    <span style={{ color: theme.colors.accent, marginLeft: 6 }}>]</span>
  </span>
)

/* ============================================================
   accent 下划高亮 — UnderAccent
   对应原版 .under-accent — 文字底部 12% 实色衬底
   ============================================================ */

export const UnderAccent: React.FC<{
  theme: DesignTokens
  children: React.ReactNode
}> = ({ theme, children }) => (
  <span style={{
    backgroundImage: `linear-gradient(to bottom, transparent 88%, ${theme.colors.accent} 88%, ${theme.colors.accent} 100%)`,
    backgroundRepeat: 'no-repeat',
    padding: '0 2px',
  }}>
    {children}
  </span>
)

/* ============================================================
   呼吸点 — DotPulse
   对应原版 .dot-pulse — LIVE 状态指示
   ============================================================ */

export const DotPulse: React.FC<{
  theme: DesignTokens
}> = ({ theme }) => (
  <div style={{ position: 'relative', width: 8, height: 8 }}>
    <div style={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: theme.colors.accent,
    }} />
    {/* 脉冲环 — 用 Remotion 的 interpolate 在实际组件中控制 */}
  </div>
)

/* ============================================================
   发丝线 — Hairline
   1px 水平/垂直线
   ============================================================ */

export const Hairline: React.FC<{
  theme: DesignTokens
  direction?: 'horizontal' | 'vertical'
  strength?: 'default' | 'strong' | 'strongest'
  length?: number | string
}> = ({ theme, direction = 'horizontal', strength = 'default', length = '100%' }) => {
  const colorMap = {
    default: theme.colors.line,
    strong: theme.colors.lineStrong,
    strongest: theme.colors.lineStrongest,
  }

  return (
    <div style={{
      ...(direction === 'horizontal'
        ? { width: length, height: 1 }
        : { width: 1, height: length }),
      backgroundColor: colorMap[strength],
    }} />
  )
}

/* ============================================================
   斜杠分隔符 — Slash
   对应原版 .slash — accent 色 / 分隔符
   ============================================================ */

export const Slash: React.FC<{
  theme: DesignTokens
}> = ({ theme }) => (
  <span style={{
    color: theme.colors.accent,
    margin: '0 8px',
    fontFamily: theme.typography.monoFont,
  }}>/</span>
)

/* ============================================================
   倒计时大字 — TMinus
   对应原版 .t-minus — T-00:42 风格
   ============================================================ */

export const TMinus: React.FC<{
  theme: DesignTokens
  prefix?: string
  value: string
}> = ({ theme, prefix = 'T-', value }) => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
  }}>
    <span style={{
      fontFamily: theme.typography.monoFont,
      fontSize: theme.typography.scale.cap,
      letterSpacing: theme.typography.letterSpacing.meta,
      textTransform: 'uppercase',
      color: theme.colors.foregroundMuted,
    }}>
      {prefix}
    </span>
    <span style={{
      fontFamily: theme.typography.condensedFont,
      fontWeight: theme.typography.weight.bold,
      letterSpacing: '-0.03em',
      lineHeight: 0.9,
      fontVariantNumeric: 'tabular-nums',
      fontSize: theme.typography.scale.display * 0.5,
      color: theme.colors.accent,
    }}>
      {value}
    </span>
  </div>
)
