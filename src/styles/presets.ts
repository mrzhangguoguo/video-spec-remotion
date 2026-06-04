/**
 * Style Presets
 *
 * 对应原版 design.md 的 Components 章节。
 * 卡片、面板、badge 等常用样式的预设函数。
 */
import type { DesignTokens } from '../../themes/_template'

/* ============================================================
   卡片 / 面板
   对应原版: surface 底 + 1px hairline 边 + rounded.lg
   ============================================================ */

export function cardStyle(theme: DesignTokens): React.CSSProperties {
  return {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.line}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.s4,
    position: 'relative',
  }
}

export function elevatedCardStyle(theme: DesignTokens): React.CSSProperties {
  return {
    ...cardStyle(theme),
    backgroundColor: theme.colors.elevated,
    borderColor: theme.colors.lineStrong,
  }
}

/* ============================================================
   标签 / Badge
   ============================================================ */

export function badgeStyle(theme: DesignTokens): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.line}`,
    fontFamily: theme.typography.monoFont,
    fontSize: theme.typography.scale.cap,
    fontWeight: theme.typography.weight.mid,
    letterSpacing: theme.typography.letterSpacing.caps,
    textTransform: 'uppercase',
    color: theme.colors.foregroundSecondary,
  }
}

export function accentBadgeStyle(theme: DesignTokens): React.CSSProperties {
  return {
    ...badgeStyle(theme),
    backgroundColor: theme.colors.accent,
    color: theme.colors.background,
    borderColor: theme.colors.accent,
  }
}

/* ============================================================
   反白标签 — 用于 keyword-sticker
   对应原版: 反白(白底黑字)或卡片(surface底/1px强hairline边)
   ============================================================ */

export function invertedLabelStyle(theme: DesignTokens): React.CSSProperties {
  return {
    padding: '14px 22px',
    borderRadius: 6,
    backgroundColor: theme.colors.foreground,
    color: theme.colors.background,
    fontFamily: theme.typography.monoFont,
    fontSize: theme.typography.scale.body,
    fontWeight: theme.typography.weight.mid,
  }
}

export function surfaceLabelStyle(theme: DesignTokens): React.CSSProperties {
  return {
    padding: '14px 22px',
    borderRadius: 6,
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.lineStrong}`,
    fontFamily: theme.typography.monoFont,
    fontSize: theme.typography.scale.body,
    fontWeight: theme.typography.weight.mid,
    color: theme.colors.foreground,
  }
}

/* ============================================================
   引用块
   对应原版: Instrument Serif italic + 巨型左引号 0.18 opacity
   ============================================================ */

export function pullQuoteContainerStyle(theme: DesignTokens): React.CSSProperties {
  return {
    position: 'relative',
    padding: `${theme.spacing.s5}px ${theme.spacing.s5}px`,
  }
}

/* ============================================================
   占位框
   对应原版: 45°斜条纹底(4%白) + 1px强hairline边 + 四角bracket
   ============================================================ */

export function placeholderStyle(theme: DesignTokens): React.CSSProperties {
  return {
    position: 'relative',
    border: `1px solid ${theme.colors.lineStrong}`,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.s4,
    backgroundImage: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255,255,255,0.04) 10px,
      rgba(255,255,255,0.04) 20px
    )`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}

/* ============================================================
   图表通用
   对应原版: 轴线 1px rgba(255,255,255,.06) hairline, 数字 mono tabular-nums
   ============================================================ */

export function chartAxisStyle(theme: DesignTokens): React.CSSProperties {
  return {
    stroke: 'rgba(255,255,255,0.06)',
    strokeWidth: 1,
  }
}

export function chartLabelStyle(theme: DesignTokens): React.CSSProperties {
  return {
    fontFamily: theme.typography.monoFont,
    fontSize: theme.typography.scale.small,
    fill: theme.colors.foregroundMuted,
    fontVariantNumeric: 'tabular-nums',
  }
}

export function chartValueStyle(theme: DesignTokens): React.CSSProperties {
  return {
    fontFamily: theme.typography.monoFont,
    fontWeight: theme.typography.weight.bold,
    fontVariantNumeric: 'tabular-nums',
  }
}

/* ============================================================
   全屏场景容器
   ============================================================ */

export function sceneContainerStyle(theme: DesignTokens): React.CSSProperties {
  return {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.s5,
    backgroundColor: theme.colors.background,
    position: 'relative',
    overflow: 'hidden',
  }
}

/* ============================================================
   流程图通用
   对应原版: 节点 hairline 边框, hot 段填 accent; 箭头 1px + 7px 三角
   ============================================================ */

export function flowNodeStyle(theme: DesignTokens, hot?: boolean): React.CSSProperties {
  return {
    padding: `${theme.spacing.s2}px ${theme.spacing.s3}px`,
    borderRadius: theme.borderRadius.sm,
    border: `1px solid ${hot ? theme.colors.accent : theme.colors.line}`,
    backgroundColor: hot ? theme.colors.accent3 : theme.colors.surface,
    fontFamily: theme.typography.monoFont,
    fontSize: theme.typography.scale.body,
    color: hot ? theme.colors.accent : theme.colors.foreground,
    textAlign: 'center',
  }
}

/* ============================================================
   对比表
   对应原版: 表头左 mono caps 维度 / 右 cn 800 候选名; hairline 分隔行, 不画竖线
   ============================================================ */

export function tableHeaderStyle(theme: DesignTokens): React.CSSProperties {
  return {
    fontFamily: theme.typography.monoFont,
    fontSize: theme.typography.scale.cap,
    letterSpacing: theme.typography.letterSpacing.caps,
    textTransform: 'uppercase',
    color: theme.colors.foregroundMuted,
    padding: `${theme.spacing.s2}px ${theme.spacing.s3}px`,
    borderBottom: `1px solid ${theme.colors.line}`,
  }
}

export function tableCellStyle(theme: DesignTokens): React.CSSProperties {
  return {
    padding: `${theme.spacing.s2}px ${theme.spacing.s3}px`,
    borderBottom: `1px solid ${theme.colors.line}`,
    fontSize: theme.typography.scale.body,
  }
}
