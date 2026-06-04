import type { DesignTokens } from './_template'

const theme: DesignTokens = {
  name: 'Data Drift',
  colors: {
    background: '#0D1117', surface: '#161B22', elevated: '#21262D',
    foreground: '#C9D1D9', foregroundSecondary: 'rgba(201,209,217,0.66)', foregroundMuted: 'rgba(201,209,217,0.42)', foregroundFaint: 'rgba(201,209,217,0.18)',
    accent: '#58A6FF', accent2: 'rgba(88,166,255,0.40)', accent3: 'rgba(88,166,255,0.14)',
    line: 'rgba(201,209,217,0.08)', lineStrong: 'rgba(201,209,217,0.16)', lineStrongest: 'rgba(201,209,217,0.28)',
    flash: '#FFFFFF', green: '#3FB950', red: '#F85149', yellow: '#D29922',
  },
  typography: {
    condensedFont: '"Space Grotesk", "Inter", sans-serif',
    sansFont: '"Inter", "Space Grotesk", sans-serif',
    monoFont: '"JetBrains Mono", "IBM Plex Mono", monospace',
    chineseFont: '"Noto Sans SC", "PingFang SC", sans-serif',
    serifFont: '"Instrument Serif", "Source Serif 4", serif',
    scale: { display: 96, h1: 56, h2: 32, h3: 22, h4: 17, body: 15, small: 13, cap: 11, meta: 10 },
    weight: { regular: 400, mid: 600, bold: 700, heavy: 800 },
    letterSpacing: { display: '-0.03em', tight: '-0.018em', normal: '-0.005em', caps: '0.18em', meta: '0.22em', mission: '0.32em' },
    lineHeight: { heading: 0.86, tight: 1.0, body: 1.5 },
  },
  spacing: { s1: 8, s2: 16, s3: 24, s4: 40, s5: 64, s6: 96 },
  borderRadius: { none: 0, sm: 4, md: 8, lg: 12 },
  motion: { easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)', easeIn: 'cubic-bezier(0.55, 0, 1, 0.45)', easeSoft: 'cubic-bezier(0.4, 0, 0.2, 1)', easeSpring: 'cubic-bezier(0.34, 1.36, 0.64, 1)', durationFast: 200, durationNormal: 400, durationSlow: 800, durationHero: 1100 },
  decoration: { density: 'medium', cornerCross: true, tickRow: false, hairline: true, backgroundTexture: 'none' },
}
export default theme
