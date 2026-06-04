import type { DesignTokens } from './_template'

const theme: DesignTokens = {
  name: 'Folk Frequency',
  colors: {
    background: '#FFFBF5', surface: '#FFFFFF', elevated: '#FFF8F0',
    foreground: '#2D2418', foregroundSecondary: 'rgba(45,36,24,0.66)', foregroundMuted: 'rgba(45,36,24,0.42)', foregroundFaint: 'rgba(45,36,24,0.18)',
    accent: '#E85D26', accent2: 'rgba(232,93,38,0.40)', accent3: 'rgba(232,93,38,0.14)',
    line: 'rgba(45,36,24,0.08)', lineStrong: 'rgba(45,36,24,0.16)', lineStrongest: 'rgba(45,36,24,0.28)',
    flash: '#2D2418', green: '#5A9E5A', red: '#CC5A5A', yellow: '#C4A646',
  },
  typography: {
    condensedFont: '"DM Serif Display", "Georgia", serif',
    sansFont: '"DM Sans", "Helvetica Neue", sans-serif',
    monoFont: '"JetBrains Mono", "IBM Plex Mono", monospace',
    chineseFont: '"Noto Sans SC", "PingFang SC", sans-serif',
    serifFont: '"DM Serif Display", "Georgia", serif',
    scale: { display: 96, h1: 56, h2: 32, h3: 22, h4: 17, body: 17, small: 14, cap: 11, meta: 10 },
    weight: { regular: 400, mid: 600, bold: 700, heavy: 800 },
    letterSpacing: { display: '-0.02em', tight: '-0.01em', normal: '0', caps: '0.16em', meta: '0.2em', mission: '0.28em' },
    lineHeight: { heading: 1.0, tight: 1.2, body: 1.55 },
  },
  spacing: { s1: 8, s2: 16, s3: 24, s4: 40, s5: 64, s6: 96 },
  borderRadius: { none: 0, sm: 6, md: 12, lg: 20 },
  motion: { easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)', easeIn: 'cubic-bezier(0.55, 0, 1, 0.45)', easeSoft: 'cubic-bezier(0.4, 0, 0.2, 1)', easeSpring: 'cubic-bezier(0.34, 1.36, 0.64, 1)', durationFast: 250, durationNormal: 450, durationSlow: 900, durationHero: 1100 },
  decoration: { density: 'medium', cornerCross: false, tickRow: false, hairline: false, backgroundTexture: 'none' },
}
export default theme
