/**
 * icons.icon-set — 48 Curated Icon Names
 *
 * Export the 48 curated icon names as a constant array for reference.
 * These are the icons available for use with LucideIcon.
 */

export const CURATED_ICON_NAMES = [
  // Navigation / Direction
  'ArrowRight',
  'ArrowLeft',
  'ArrowUpRight',
  'ChevronRight',
  'ChevronDown',

  // Actions
  'Play',
  'Pause',
  'SkipForward',
  'RotateCcw',
  'RefreshCw',

  // Status
  'Check',
  'X',
  'AlertCircle',
  'Info',
  'HelpCircle',

  // Communication
  'MessageSquare',
  'Send',
  'Mail',
  'Bell',
  'BellRing',

  // Data / Charts
  'BarChart3',
  'LineChart',
  'TrendingUp',
  'TrendingDown',
  'Activity',

  // Code / Dev
  'Terminal',
  'Code2',
  'FileCode',
  'GitBranch',
  'Database',

  // UI / Layout
  'Settings',
  'Search',
  'Filter',
  'Layers',
  'Grid3x3',

  // Media
  'Image',
  'Video',
  'Mic',
  'Volume2',
  'Camera',

  // Misc
  'Zap',
  'Sparkles',
  'Lightbulb',
  'Rocket',
  'Globe',

  // Social / Misc
  'Star',
  'Heart',
  'Bookmark',
  'Share2',
] as const

/** 导出类型：所有可用图标的名称 */
export type CuratedIconName = (typeof CURATED_ICON_NAMES)[number]

/** 检查一个字符串是否为合法的图标名称 */
export function isCuratedIconName(name: string): name is CuratedIconName {
  return (CURATED_ICON_NAMES as readonly string[]).includes(name)
}
