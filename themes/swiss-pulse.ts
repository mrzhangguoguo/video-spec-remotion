import type { DesignTokens } from './_template'

/**
 * Swiss Pulse — 精确、克制、瑞士排版
 * 适合：SaaS、数据、开发者工具、指标看板
 */
const theme: DesignTokens = {
  name: 'Swiss Pulse',
  colors: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    elevated: '#F5F5F5',
    foreground: '#1A1A1A',
    foregroundSecondary: 'rgba(26,26,26,0.66)',
    foregroundMuted: 'rgba(26,26,26,0.42)',
    foregroundFaint: 'rgba(26,26,26,0.18)',
    accent: '#0055FF',
    accent2: 'rgba(0,85,255,0.40)',
    accent3: 'rgba(0,85,255,0.14)',
    line: 'rgba(26,26,26,0.08)',
    lineStrong: 'rgba(26,26,26,0.16)',
    lineStrongest: 'rgba(26,26,26,0.28)',
    flash: '#000000',
    green: '#00AA55',
    red: '#DD2222',
    yellow: '#FFAA00',
  },
  typography: {
    condensedFont: '"Helvetica Neue", "Arial", sans-serif',
    sansFont: '"Helvetica Neue", "Arial", sans-serif',
    monoFont: '"IBM Plex Mono", "Menlo", monospace',
    chineseFont: '"Noto Sans SC", "PingFang SC", sans-serif',
    serifFont: '"Georgia", "Times New Roman", serif',
    scale: { display: 96, h1: 56, h2: 32, h3: 22, h4: 17, body: 16, small: 13, cap: 11, meta: 10 },
    weight: { regular: 400, mid: 500, bold: 700, heavy: 800 },
    letterSpacing: { display: '-0.03em', tight: '-0.01em', normal: '0', caps: '0.12em', meta: '0.16em', mission: '0.24em' },
    lineHeight: { heading: 1.0, tight: 1.2, body: 1.5 },
  },
  spacing: { s1: 8, s2: 16, s3: 24, s4: 40, s5: 64, s6: 96 },
  borderRadius: { none: 0, sm: 2, md: 4, lg: 8 },
  motion: { easeOut: 'cubic-bezier(0.25, 0.1, 0.25, 1)', easeIn: 'cubic-bezier(0.55, 0, 1, 0.45)', easeSoft: 'cubic-bezier(0.4, 0, 0.2, 1)', easeSpring: 'cubic-bezier(0.34, 1.36, 0.64, 1)', durationFast: 180, durationNormal: 350, durationSlow: 700, durationHero: 1000 },
  decoration: { density: 'minimal', cornerCross: false, tickRow: false, hairline: true, backgroundTexture: 'none' },
}
export default theme
