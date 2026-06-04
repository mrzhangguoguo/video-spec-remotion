import type { DesignTokens } from './_template'

const theme: DesignTokens = {
  name: 'Velvet Standard',
  colors: {
    background: '#F5F0EB', surface: '#FFFFFF', elevated: '#FAF7F3',
    foreground: '#2C2420', foregroundSecondary: 'rgba(44,36,32,0.66)', foregroundMuted: 'rgba(44,36,32,0.42)', foregroundFaint: 'rgba(44,36,32,0.18)',
    accent: '#8B6914', accent2: 'rgba(139,105,20,0.40)', accent3: 'rgba(139,105,20,0.14)',
    line: 'rgba(44,36,32,0.08)', lineStrong: 'rgba(44,36,32,0.16)', lineStrongest: 'rgba(44,36,32,0.28)',
    flash: '#2C2420', green: '#5A8F5A', red: '#B85450', yellow: '#C4960C',
  },
  typography: {
    condensedFont: '"Playfair Display", "Georgia", serif',
    sansFont: '"Source Sans 3", "Helvetica Neue", sans-serif',
    monoFont: '"IBM Plex Mono", "Menlo", monospace',
    chineseFont: '"Noto Serif SC", "PingFang SC", serif',
    serifFont: '"Playfair Display", "Georgia", serif',
    scale: { display: 96, h1: 56, h2: 32, h3: 22, h4: 17, body: 17, small: 14, cap: 11, meta: 10 },
    weight: { regular: 400, mid: 600, bold: 700, heavy: 800 },
    letterSpacing: { display: '-0.02em', tight: '-0.01em', normal: '0', caps: '0.14em', meta: '0.18em', mission: '0.28em' },
    lineHeight: { heading: 1.0, tight: 1.2, body: 1.6 },
  },
  spacing: { s1: 8, s2: 16, s3: 24, s4: 40, s5: 64, s6: 96 },
  borderRadius: { none: 0, sm: 2, md: 4, lg: 8 },
  motion: { easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)', easeIn: 'cubic-bezier(0.55, 0, 1, 0.45)', easeSoft: 'cubic-bezier(0.4, 0, 0.2, 1)', easeSpring: 'cubic-bezier(0.34, 1.36, 0.64, 1)', durationFast: 250, durationNormal: 500, durationSlow: 1000, durationHero: 1200 },
  decoration: { density: 'minimal', cornerCross: false, tickRow: false, hairline: false, backgroundTexture: 'none' },
}
export default theme
