import type { DesignTokens } from './_template'

/**
 * Shadow Cut — 暗黑、电影感
 * 适合：安全产品、戏剧性揭示、严肃叙事
 */
const theme: DesignTokens = {
  name: 'Shadow Cut',

  colors: {
    background: '#0A0A0A',
    surface: '#141414',
    elevated: '#1E1E1E',
    foreground: '#E8E8E8',
    foregroundSecondary: 'rgba(232,232,232,0.66)',
    foregroundMuted: 'rgba(232,232,232,0.42)',
    foregroundFaint: 'rgba(232,232,232,0.18)',
    accent: '#CC2222',
    accent2: 'rgba(204,34,34,0.40)',
    accent3: 'rgba(204,34,34,0.14)',
    line: 'rgba(232,232,232,0.08)',
    lineStrong: 'rgba(232,232,232,0.16)',
    lineStrongest: 'rgba(232,232,232,0.28)',
    flash: '#FFFFFF',
    green: '#4ADE80',
    red: '#F87171',
    yellow: '#FBBF24',
  },

  typography: {
    condensedFont: '"Barlow Semi Condensed", "Oswald", "Space Grotesk", sans-serif',
    sansFont: '"Inter", "Space Grotesk", "PingFang SC", sans-serif',
    monoFont: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
    chineseFont: '"Noto Sans SC", "PingFang SC", "HarmonyOS Sans SC", sans-serif',
    serifFont: '"Instrument Serif", "Source Serif 4", "Noto Serif SC", serif',
    scale: { display: 96, h1: 56, h2: 32, h3: 22, h4: 17, body: 15, small: 13, cap: 11, meta: 10 },
    weight: { regular: 400, mid: 600, bold: 700, heavy: 800 },
    letterSpacing: { display: '-0.04em', tight: '-0.018em', normal: '-0.005em', caps: '0.18em', meta: '0.22em', mission: '0.32em' },
    lineHeight: { heading: 0.86, tight: 1.0, body: 1.5 },
  },

  spacing: { s1: 8, s2: 16, s3: 24, s4: 40, s5: 64, s6: 96 },
  borderRadius: { none: 0, sm: 2, md: 4, lg: 8 },

  motion: {
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
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
}

export default theme
