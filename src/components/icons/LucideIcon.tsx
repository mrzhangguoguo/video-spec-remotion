import React from 'react'
import * as LucideIcons from 'lucide-react'
import type { DesignTokens } from '../../../themes/_template'

interface LucideIconProps {
  theme: DesignTokens
  /** Lucide 图标名称（如 'ArrowRight', 'Zap'） */
  name: string
  /** 图标大小（px，默认 24） */
  size?: number
  /** 描边宽度（默认 1.5 匹配 hairline） */
  strokeWidth?: number
  /** 是否强调色（accent vs fg 66%） */
  emphasized?: boolean
  /** 自定义颜色 */
  color?: string
}

/**
 * icons.lucide-set — Lucide 图标包装器
 *
 * Wrapper around lucide-react icons with theme-aware styling.
 * Default stroke 1.5px (matches hairline), color fg 66%, accent when emphasized.
 * Accept icon name string, look up from lucide-react.
 */
export const LucideIcon: React.FC<LucideIconProps> = ({
  theme,
  name,
  size = 24,
  strokeWidth = 1.5,
  emphasized = false,
  color,
}) => {
  const iconColor = color
    || (emphasized ? theme.colors.accent : theme.colors.foregroundSecondary)

  // Look up icon by name from lucide-react
  const icons = LucideIcons as Record<string, React.FC<{
    size?: number
    strokeWidth?: number
    color?: string
  }>>

  const IconComponent = icons[name]

  if (!IconComponent) {
    // Fallback: render a placeholder square
    return (
      <div
        style={{
          width: size,
          height: size,
          border: `1px solid ${theme.colors.line}`,
          borderRadius: theme.borderRadius.sm,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: theme.typography.monoFont,
          fontSize: theme.typography.scale.meta,
          color: theme.colors.foregroundMuted,
        }}
      >
        ?
      </div>
    )
  }

  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      color={iconColor}
    />
  )
}
