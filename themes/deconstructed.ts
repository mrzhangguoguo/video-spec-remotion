import type { DesignTokens } from './_template'

const theme: DesignTokens = {
  name: 'Deconstructed',
  colors: {
    background: '#1A1A1A', surface: '#222222', elevated: '#2A2A2A',
    foreground: '#F0F0F0', foregroundSecondary: 'rgba(240,240,240,0.66)', foregroundMuted: 'rgba(240,240,240,0.42)', foregroundFaint: 'rgba(240,240,240,0.18)',
    accent: '#FF4400', accent2: 'rgba(255,68,0,0.40)', accent3: 'rgba(255,68,0,0.14)',
    line: 'rgba(240,240,240,0.08)', lineStrong: 'rgba(240,240,240,0.16)', lineStrongest: 'rgba(240,240,240,0.28)',
    flash: '#FFFFFF', green: '#44CC44', red: '#FF4444', yellow: '#FFCC00',
  },
  typography: {
    condensedFont: '"Space Grotesk", "Inter", sans-serif',
    sansFont: '"Space Grotesk", "Inter", sans-serif',
    monoFont: '"JetBrains Mono", "IBM Plex Mono", monospace',
    chineseFont: '"Noto Sans SC", "PingFang SC", sans-serif',
    serifFont: '"Instrument Serif", "Source Serif 4", serif',
    scale: { display: 96, h1: 56, h2: 32, h3: 22, h4: 17, body: 15, small: 13, cap: 11, meta: 10 },
    weight: { regular: 400, mid: 600, bold: 700, heavy: 800 },
    letterSpacing: { display: '-0.05em', tight: '-0.02em', normal: '-0.005em', caps: '0.2em', meta: '0.24em', mission: '0.35em' },
    lineHeight: { heading: 0.86, tight: 1.0, body: 1.4 },
  },
  spacing: { s1: 8, s2: 16, s3: 24, s4: 40, s5: 64, s6: 96 },
  borderRadius: { none: 0, sm: 0, md: 0, lg: 2 },
  motion: { easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)', easeIn: 'cubic-bezier(0.55, 0, 1, 0.45)', easeSoft: 'cubic-bezier(0.4, 0, 0.2, 1)', easeSpring: 'cubic-bezier(0.34, 1.36, 0.64, 1)', durationFast: 150, durationNormal: 300, durationSlow: 600, durationHero: 900 },
  decoration: { density: 'heavy', cornerCross: true, tickRow: true, hairline: true, backgroundTexture: 'hairline-grid' },
}
export default theme
