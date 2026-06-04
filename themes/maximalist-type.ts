import type { DesignTokens } from './_template'

const theme: DesignTokens = {
  name: 'Maximalist Type',
  colors: {
    background: '#FFFFFF', surface: '#FFFFFF', elevated: '#F8F8F8',
    foreground: '#000000', foregroundSecondary: 'rgba(0,0,0,0.66)', foregroundMuted: 'rgba(0,0,0,0.42)', foregroundFaint: 'rgba(0,0,0,0.18)',
    accent: '#FF0066', accent2: 'rgba(255,0,102,0.40)', accent3: 'rgba(255,0,102,0.14)',
    line: 'rgba(0,0,0,0.08)', lineStrong: 'rgba(0,0,0,0.16)', lineStrongest: 'rgba(0,0,0,0.28)',
    flash: '#000000', green: '#00CC66', red: '#FF3333', yellow: '#FFAA00',
  },
  typography: {
    condensedFont: '"Space Grotesk", "Inter", sans-serif',
    sansFont: '"Space Grotesk", "Inter", sans-serif',
    monoFont: '"JetBrains Mono", "IBM Plex Mono", monospace',
    chineseFont: '"Noto Sans SC", "PingFang SC", sans-serif',
    serifFont: '"Instrument Serif", "Georgia", serif',
    scale: { display: 96, h1: 56, h2: 32, h3: 22, h4: 18, body: 16, small: 14, cap: 12, meta: 10 },
    weight: { regular: 500, mid: 700, bold: 800, heavy: 900 },
    letterSpacing: { display: '-0.06em', tight: '-0.03em', normal: '-0.01em', caps: '0.16em', meta: '0.2em', mission: '0.3em' },
    lineHeight: { heading: 0.86, tight: 1.0, body: 1.3 },
  },
  spacing: { s1: 8, s2: 16, s3: 24, s4: 32, s5: 48, s6: 64 },
  borderRadius: { none: 0, sm: 0, md: 0, lg: 0 },
  motion: { easeOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)', easeIn: 'cubic-bezier(0.55, 0, 1, 0.45)', easeSoft: 'cubic-bezier(0.4, 0, 0.2, 1)', easeSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', durationFast: 150, durationNormal: 300, durationSlow: 600, durationHero: 800 },
  decoration: { density: 'heavy', cornerCross: true, tickRow: true, hairline: false, backgroundTexture: 'none' },
}
export default theme
