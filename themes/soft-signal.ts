import type { DesignTokens } from './_template'

const theme: DesignTokens = {
  name: 'Soft Signal',
  colors: {
    background: '#FFF8F0', surface: '#FFFFFF', elevated: '#FFF5EA',
    foreground: '#3D3028', foregroundSecondary: 'rgba(61,48,40,0.66)', foregroundMuted: 'rgba(61,48,40,0.42)', foregroundFaint: 'rgba(61,48,40,0.18)',
    accent: '#E8734A', accent2: 'rgba(232,115,74,0.40)', accent3: 'rgba(232,115,74,0.14)',
    line: 'rgba(61,48,40,0.08)', lineStrong: 'rgba(61,48,40,0.16)', lineStrongest: 'rgba(61,48,40,0.28)',
    flash: '#3D3028', green: '#6BAA6B', red: '#CC6B6B', yellow: '#C4A646',
  },
  typography: {
    condensedFont: '"Lora", "Georgia", serif',
    sansFont: '"Source Sans 3", "Helvetica Neue", sans-serif',
    monoFont: '"IBM Plex Mono", "Menlo", monospace',
    chineseFont: '"Noto Serif SC", "PingFang SC", serif',
    serifFont: '"Lora", "Georgia", serif',
    scale: { display: 96, h1: 56, h2: 32, h3: 22, h4: 17, body: 17, small: 14, cap: 11, meta: 10 },
    weight: { regular: 400, mid: 600, bold: 700, heavy: 800 },
    letterSpacing: { display: '-0.01em', tight: '-0.005em', normal: '0', caps: '0.14em', meta: '0.18em', mission: '0.24em' },
    lineHeight: { heading: 1.0, tight: 1.2, body: 1.65 },
  },
  spacing: { s1: 8, s2: 16, s3: 24, s4: 40, s5: 56, s6: 80 },
  borderRadius: { none: 0, sm: 4, md: 8, lg: 16 },
  motion: { easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)', easeIn: 'cubic-bezier(0.55, 0, 1, 0.45)', easeSoft: 'cubic-bezier(0.4, 0, 0.2, 1)', easeSpring: 'cubic-bezier(0.34, 1.36, 0.64, 1)', durationFast: 250, durationNormal: 500, durationSlow: 1000, durationHero: 1200 },
  decoration: { density: 'minimal', cornerCross: false, tickRow: false, hairline: false, backgroundTexture: 'none' },
}
export default theme
