/**
 * Remotion Video Theme — Design Tokens
 *
 * 完整的设计系统 token 定义，对应原版 design.md 的 YAML 头。
 * 所有组件通过这个接口获取样式配置。
 *
 * 使用方式：
 *   1. 选一个预设主题（themes/*.ts）
 *   2. 或复制本文件到项目根目录改名为 theme.ts 自定义
 */

export interface DesignTokens {
  /** 主题名称 */
  name: string

  colors: {
    /** 主背景色（纯黑底） */
    background: string
    /** 卡片/面板表面色 */
    surface: string
    /** 抬起层/嵌套色 */
    elevated: string
    /** 主前景色（纯白） */
    foreground: string
    /** 次级文字（66% 白） */
    foregroundSecondary: string
    /** meta/caption（42% 白） */
    foregroundMuted: string
    /** 极弱/disabled（18% 白） */
    foregroundFaint: string
    /** 主强调色（整套系统唯一的用色） */
    accent: string
    /** accent 半透明 40% */
    accent2: string
    /** accent 半透明 14% */
    accent3: string
    /** hairline 边线（默认 8%） */
    line: string
    /** hairline 边线（强 16%） */
    lineStrong: string
    /** hairline 边线（最强 28%） */
    lineStrongest: string
    /** 反白闪屏色 */
    flash: string
    /** 状态色·绿（仅图表） */
    green: string
    /** 状态色·红（仅图表） */
    red: string
    /** 状态色·黄（仅图表） */
    yellow: string
  }

  typography: {
    /** 海报大字/大数字（Barlow Semi Condensed） */
    condensedFont: string
    /** 正文/标题（Space Grotesk） */
    sansFont: string
    /** 等宽（JetBrains Mono） */
    monoFont: string
    /** 中文主力（思源黑体） */
    chineseFont: string
    /** 斜体强调/引用（Instrument Serif） */
    serifFont: string

    /** 字号阶梯 — 4K 画布 1/2 等比 */
    scale: {
      display: number   // 96px · hero 大字
      h1: number        // 56px · 大数字
      h2: number        // 32px
      h3: number        // 22px
      h4: number        // 17px
      body: number      // 15px
      small: number     // 13px
      cap: number       // 11px
      meta: number      // 10px
    }

    /** 字重 — 只用 400/600/700/800，跳过 500 */
    weight: {
      regular: 400
      mid: 600
      bold: 700
      heavy: 800
    }

    /** 字距 */
    letterSpacing: {
      display: string   // -0.03em · hero/stat
      tight: string     // -0.018em
      normal: string    // -0.005em
      caps: string      // 0.18em · mono caps
      meta: string      // 0.22em
      mission: string   // 0.32em · 任务字串 SCN-03
    }

    /** 行高 */
    lineHeight: {
      heading: number   // 0.86
      tight: number     // 1.0
      body: number      // 1.6
    }
  }

  spacing: {
    /** 8px · icon/meta gap */
    s1: number
    /** 16px · 行间/卡片内 */
    s2: number
    /** 24px · 卡内段落 */
    s3: number
    /** 40px · 组件间 */
    s4: number
    /** 64px · 小节间 */
    s5: number
    /** 96px · 章节间 */
    s6: number
  }

  borderRadius: {
    /** 0px · wordmark/plate */
    none: number
    /** 2px · 默认（SpaceX 极简） */
    sm: number
    /** 4px · 柔化/tag */
    md: number
    /** 8px · 大模块（谨慎） */
    lg: number
  }

  motion: {
    /** 入场缓动（柔） */
    easeOut: string
    /** 出场缓动（果断） */
    easeIn: string
    /** 柔和缓动 */
    easeSoft: string
    /** 弹簧缓动（仅 keyword-sticker） */
    easeSpring: string

    /** 200ms · 微状态 */
    durationFast: number
    /** 400ms · hot 高亮 */
    durationNormal: number
    /** 700ms · 卡片入场 */
    durationSlow: number
    /** 1100ms · hero 入场 */
    durationHero: number
  }

  /** 装饰层配置 */
  decoration: {
    /** 装饰密度：minimal / medium / heavy */
    density: 'minimal' | 'medium' | 'heavy'
    /** 四角十字针脚 */
    cornerCross: boolean
    /** 底栏刻度尺 */
    tickRow: boolean
    /** 发丝线边框 */
    hairline: boolean
    /** 场景背景纹理：none / dot-grid / hairline-grid / scan-lines */
    backgroundTexture: 'none' | 'dot-grid' | 'hairline-grid' | 'scan-lines'
  }

  /** 组件级覆盖（可选） */
  components?: {
    hero?: {
      letterSpacing?: string
      textTransform?: 'uppercase' | 'none'
    }
    subtitle?: {
      position?: 'bottom' | 'center'
      highlightColor?: string
    }
    chart?: {
      gridColor?: string
      labelColor?: string
      barDefaultOpacity?: number
      barHighlightColor?: string
    }
  }
}

/**
 * 默认主题模板 — Spec Mono（纯黑白 · SpaceX 工程感）
 */
const theme: DesignTokens = {
  name: 'Spec Mono',

  colors: {
    background: '#000000',
    surface: '#0A0A0A',
    elevated: '#141414',
    foreground: '#FFFFFF',
    foregroundSecondary: 'rgba(255,255,255,0.66)',
    foregroundMuted: 'rgba(255,255,255,0.42)',
    foregroundFaint: 'rgba(255,255,255,0.18)',
    accent: '#FFFFFF',
    accent2: 'rgba(255,255,255,0.40)',
    accent3: 'rgba(255,255,255,0.14)',
    line: 'rgba(255,255,255,0.08)',
    lineStrong: 'rgba(255,255,255,0.16)',
    lineStrongest: 'rgba(255,255,255,0.28)',
    flash: '#FFFFFF',
    green: '#00E07A',
    red: '#FF3333',
    yellow: '#FFC700',
  },

  typography: {
    condensedFont: '"Barlow Semi Condensed", "Oswald", "Space Grotesk", sans-serif',
    sansFont: '"Space Grotesk", "Inter Tight", "PingFang SC", sans-serif',
    monoFont: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
    chineseFont: '"Noto Sans SC", "PingFang SC", "HarmonyOS Sans SC", sans-serif',
    serifFont: '"Instrument Serif", "Source Serif 4", "Noto Serif SC", serif',

    scale: {
      display: 96,
      h1: 56,
      h2: 32,
      h3: 22,
      h4: 17,
      body: 15,
      small: 13,
      cap: 11,
      meta: 10,
    },

    weight: {
      regular: 400,
      mid: 600,
      bold: 700,
      heavy: 800,
    },

    letterSpacing: {
      display: '-0.03em',
      tight: '-0.018em',
      normal: '-0.005em',
      caps: '0.18em',
      meta: '0.22em',
      mission: '0.32em',
    },

    lineHeight: {
      heading: 0.86,
      tight: 1.0,
      body: 1.6,
    },
  },

  spacing: {
    s1: 8,
    s2: 16,
    s3: 24,
    s4: 40,
    s5: 64,
    s6: 96,
  },

  borderRadius: {
    none: 0,
    sm: 2,
    md: 4,
    lg: 8,
  },

  motion: {
    easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
    easeIn: 'cubic-bezier(0.55, 0, 1, 0.45)',
    easeSoft: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeSpring: 'cubic-bezier(0.34, 1.36, 0.64, 1)',
    durationFast: 200,
    durationNormal: 400,
    durationSlow: 700,
    durationHero: 1100,
  },

  decoration: {
    density: 'medium',
    cornerCross: true,
    tickRow: true,
    hairline: true,
    backgroundTexture: 'none',
  },

  components: {
    hero: {
      letterSpacing: '-0.03em',
      textTransform: 'uppercase',
    },
    chart: {
      barDefaultOpacity: 0.18,
    },
  },
}

export default theme
