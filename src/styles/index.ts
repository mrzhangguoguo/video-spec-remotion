/**
 * Design System — 统一导出
 *
 * 使用方式：
 *   import { heroStyle, cardStyle, SceneChrome, useEntrance } from '../styles'
 */

// Typography
export {
  getFontSize,
  getFontFamily,
  getFontWeight,
  getLetterSpacing,
  textStyle,
  heroStyle,
  statStyle,
  bodyStyle,
  labelStyle,
  metaStyle,
  quoteStyle,
  missionStyle,
  kbdStyle,
} from './typography'

export type { FontSizeRole, FontFamilyRole, FontWeightRole, LetterSpacingRole } from './typography'

// Decorative Components
export {
  CornerCross,
  CornerCrossGroup,
  TickRule,
  Idx,
  Eyebrow,
  RuleLabel,
  SpecRow,
  Coord,
  Bracket,
  UnderAccent,
  DotPulse,
  Hairline,
  Slash,
  TMinus,
} from './decorative'

export type { CornerPosition } from './decorative'

// Animations
export {
  useEntrance,
  usePulse,
  useCountUp,
  useSlideIn,
} from './animations'

export type { EntranceType } from './animations'

// Presets
export {
  cardStyle,
  elevatedCardStyle,
  badgeStyle,
  accentBadgeStyle,
  invertedLabelStyle,
  surfaceLabelStyle,
  pullQuoteContainerStyle,
  placeholderStyle,
  chartAxisStyle,
  chartLabelStyle,
  chartValueStyle,
  sceneContainerStyle,
  flowNodeStyle,
  tableHeaderStyle,
  tableCellStyle,
} from './presets'

// Backgrounds
export {
  SceneBackground,
  SceneChrome,
} from './backgrounds'

export type { BackgroundTexture } from './backgrounds'

// Animation Constants
export { SPRING, DISPLACEMENT, FADE_FRAMES, STAGGER, CHART, SUBTITLE } from './constants'

// Chart Shared Components
export {
  ChartAxis,
  ChartLabel,
  ChartValue,
  ChartDot,
  ChartGrid,
  AreaGradient,
  ChartContainer,
} from '../components/charts/shared'
