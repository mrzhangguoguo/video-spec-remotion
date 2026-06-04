/**
 * Background Textures
 *
 * 对应原版 tokens.css 的场景背景纹理。
 * 一个场景最多用 1 种。
 */
import React from 'react'
import type { DesignTokens } from '../../themes/_template'

export type BackgroundTexture = 'none' | 'dot-grid' | 'hairline-grid' | 'scan-lines'

/**
 * 点阵网格 — dot-grid
 * 对应原版 .bg-dotgrid
 */
const DotGrid: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => (
  <div style={{
    position: 'absolute',
    inset: 0,
    backgroundImage: `radial-gradient(rgba(255,255,255,${opacity}) 1px, transparent 1.2px)`,
    backgroundSize: '22px 22px',
    pointerEvents: 'none',
  }} />
)

/**
 * 发丝线网格 — hairline-grid
 * 对应原版 .bg-hairline-grid
 */
const HairlineGrid: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => (
  <div style={{
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(to right, rgba(255,255,255,${opacity}) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,${opacity}) 1px, transparent 1px)
    `,
    backgroundSize: '44px 44px',
    pointerEvents: 'none',
  }} />
)

/**
 * 扫描线 — scan-lines
 * 对应原版 .bg-scan
 */
const ScanLines: React.FC<{ opacity?: number }> = ({ opacity = 0.12 }) => (
  <div style={{
    position: 'absolute',
    inset: 0,
    backgroundImage: `repeating-linear-gradient(
      0deg,
      rgba(255,255,255,${opacity}) 0,
      rgba(255,255,255,${opacity}) 1px,
      transparent 1px,
      transparent 4px
    )`,
    pointerEvents: 'none',
  }} />
)

/**
 * 场景背景纹理组件
 * 根据 theme.decoration.backgroundTexture 自动选择
 */
export const SceneBackground: React.FC<{
  theme: DesignTokens
  texture?: BackgroundTexture
}> = ({ theme, texture }) => {
  const t = texture || theme.decoration.backgroundTexture

  switch (t) {
    case 'dot-grid':
      return <DotGrid />
    case 'hairline-grid':
      return <HairlineGrid />
    case 'scan-lines':
      return <ScanLines />
    default:
      return null
  }
}

/**
 * 场景 chrome — 四角针脚 + 底栏刻度 + 编号
 * 对应原版的场景装饰层组合
 */
export const SceneChrome: React.FC<{
  theme: DesignTokens
  /** 左上编号，如 "01 / 08" */
  chapter?: string
  /** 右上时间码，如 "2024.10" */
  timestamp?: string
}> = ({ theme, chapter, timestamp }) => {
  // 延迟导入避免循环依赖
  const { CornerCrossGroup } = require('./decorative')
  const { TickRule } = require('./decorative')
  const { Idx } = require('./decorative')

  return (
    <>
      {/* 四角针脚 */}
      {theme.decoration.cornerCross && (
        <CornerCrossGroup color={theme.colors.accent} size={12} />
      )}

      {/* 左上编号 */}
      {chapter && (
        <div style={{
          position: 'absolute',
          top: theme.spacing.s3,
          left: theme.spacing.s3,
        }}>
          <Idx theme={theme} text={chapter} />
        </div>
      )}

      {/* 右上时间码 */}
      {timestamp && (
        <div style={{
          position: 'absolute',
          top: theme.spacing.s3,
          right: theme.spacing.s3,
          fontFamily: theme.typography.monoFont,
          fontSize: theme.typography.scale.meta,
          letterSpacing: theme.typography.letterSpacing.meta,
          textTransform: 'uppercase',
          color: theme.colors.foregroundMuted,
        }}>
          {timestamp}
        </div>
      )}

      {/* 底栏刻度尺 */}
      {theme.decoration.tickRow && (
        <div style={{
          position: 'absolute',
          bottom: theme.spacing.s2,
          left: theme.spacing.s3,
          right: theme.spacing.s3,
        }}>
          <TickRule theme={theme} />
        </div>
      )}
    </>
  )
}
