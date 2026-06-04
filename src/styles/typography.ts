/**
 * Typography System
 *
 * 对应原版 tokens.css 的排版工具类 + type ramp。
 * 提供字号、字重、字距的预设和工具函数。
 */
import type { DesignTokens } from '../../themes/_template'

/** 字号角色 — 对应原版 type ramp */
export type FontSizeRole =
  | 'display'   // 96px · hero 大字
  | 'h1'        // 56px · 大数字
  | 'h2'        // 32px
  | 'h3'        // 22px
  | 'h4'        // 17px
  | 'body'      // 15px
  | 'small'     // 13px
  | 'cap'       // 11px
  | 'meta'      // 10px

/** 字体角色 */
export type FontFamilyRole =
  | 'condensed' // 海报大字/大数字
  | 'sans'      // 正文/标题
  | 'mono'      // 等宽
  | 'chinese'   // 中文
  | 'serif'     // 斜体强调/引用

/** 字重角色 — 跳过 500 */
export type FontWeightRole =
  | 'regular'   // 400
  | 'mid'       // 600
  | 'bold'      // 700
  | 'heavy'     // 800

/** 字距角色 */
export type LetterSpacingRole =
  | 'display'   // -0.03em · hero/stat
  | 'tight'     // -0.018em
  | 'normal'    // -0.005em
  | 'caps'      // 0.18em · mono caps
  | 'meta'      // 0.22em
  | 'mission'   // 0.32em · 任务字串

/** 获取字号（px） */
export function getFontSize(theme: DesignTokens, role: FontSizeRole): number {
  return theme.typography.scale[role]
}

/** 获取字体族 */
export function getFontFamily(theme: DesignTokens, role: FontFamilyRole): string {
  const map: Record<FontFamilyRole, string> = {
    condensed: theme.typography.condensedFont,
    sans: theme.typography.sansFont,
    mono: theme.typography.monoFont,
    chinese: theme.typography.chineseFont,
    serif: theme.typography.serifFont,
  }
  return map[role]
}

/** 获取字重 */
export function getFontWeight(theme: DesignTokens, role: FontWeightRole): number {
  return theme.typography.weight[role]
}

/** 获取字距 */
export function getLetterSpacing(theme: DesignTokens, role: LetterSpacingRole): string {
  return theme.typography.letterSpacing[role]
}

/** 排版预设 — 直接给 React style 对象 */
export function textStyle(
  theme: DesignTokens,
  role: FontSizeRole,
  opts?: {
    font?: FontFamilyRole
    weight?: FontWeightRole
    spacing?: LetterSpacingRole
    lineHeight?: number
    color?: string
    transform?: 'uppercase' | 'none'
  }
): React.CSSProperties {
  return {
    fontFamily: getFontFamily(theme, opts?.font || 'sans'),
    fontSize: getFontSize(theme, role),
    fontWeight: getFontWeight(theme, opts?.weight || 'regular'),
    letterSpacing: getLetterSpacing(theme, opts?.spacing || 'normal'),
    lineHeight: opts?.lineHeight,
    color: opts?.color,
    textTransform: opts?.transform,
    fontVariantNumeric: opts?.font === 'condensed' || opts?.font === 'mono' ? 'tabular-nums' : undefined,
  }
}

/* ============================================================
   预设排版组合 — 对应原版 tokens.css 的工具类
   ============================================================ */

/** hero 大字 · Barlow Semi Condensed 800 · uppercase */
export function heroStyle(theme: DesignTokens): React.CSSProperties {
  return {
    fontFamily: theme.typography.condensedFont,
    fontSize: theme.typography.scale.display,
    fontWeight: theme.typography.weight.heavy,
    letterSpacing: theme.typography.letterSpacing.display,
    lineHeight: theme.typography.lineHeight.heading,
    textTransform: 'uppercase',
    fontVariantNumeric: 'tabular-nums',
  }
}

/** 大数字 · Barlow Semi Condensed 800 · tabular-nums */
export function statStyle(theme: DesignTokens): React.CSSProperties {
  return {
    fontFamily: theme.typography.condensedFont,
    fontSize: theme.typography.scale.h1,
    fontWeight: theme.typography.weight.heavy,
    letterSpacing: '-0.04em',
    lineHeight: 0.86,
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum" 1',
  }
}

/** 正文 · Space Grotesk 400 */
export function bodyStyle(theme: DesignTokens): React.CSSProperties {
  return {
    fontFamily: theme.typography.sansFont,
    fontSize: theme.typography.scale.body,
    fontWeight: theme.typography.weight.regular,
    letterSpacing: theme.typography.letterSpacing.normal,
    lineHeight: theme.typography.lineHeight.body,
  }
}

/** 标签 · JetBrains Mono 500 · uppercase · wide spacing */
export function labelStyle(theme: DesignTokens): React.CSSProperties {
  return {
    fontFamily: theme.typography.monoFont,
    fontSize: theme.typography.scale.cap,
    fontWeight: theme.typography.weight.mid,
    letterSpacing: theme.typography.letterSpacing.caps,
    textTransform: 'uppercase',
  }
}

/** meta · JetBrains Mono · 极小 · 全大写 */
export function metaStyle(theme: DesignTokens): React.CSSProperties {
  return {
    fontFamily: theme.typography.monoFont,
    fontSize: theme.typography.scale.meta,
    letterSpacing: theme.typography.letterSpacing.meta,
    textTransform: 'uppercase',
    color: theme.colors.foregroundMuted,
  }
}

/** 引用 · Instrument Serif italic */
export function quoteStyle(theme: DesignTokens): React.CSSProperties {
  return {
    fontFamily: theme.typography.serifFont,
    fontSize: theme.typography.scale.h1,
    fontWeight: theme.typography.weight.regular,
    fontStyle: 'italic',
    lineHeight: 1.3,
  }
}

/** 任务字串 · mono · 极宽字距 · uppercase */
export function missionStyle(theme: DesignTokens): React.CSSProperties {
  return {
    fontFamily: theme.typography.monoFont,
    letterSpacing: theme.typography.letterSpacing.mission,
    textTransform: 'uppercase',
  }
}

/** 键帽 · mono · 小号 · 带边框 */
export function kbdStyle(theme: DesignTokens): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 22,
    height: 22,
    padding: '0 6px',
    fontFamily: theme.typography.monoFont,
    fontSize: theme.typography.scale.cap,
    color: theme.colors.foregroundSecondary,
    border: `1px solid ${theme.colors.lineStrong}`,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255,255,255,0.02)',
  }
}
