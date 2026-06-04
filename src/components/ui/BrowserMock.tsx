import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface BrowserMockProps {
  theme: DesignTokens
  /** URL 路径（不含 https://） */
  url: string
  /** 标签页标题 */
  tabTitle?: string
  /** CTA 按钮文字 */
  ctaText?: string
  /** 页面内容区（自定义 React 节点） */
  children?: React.ReactNode
}

/**
 * broll-ui.browser — 浏览器窗口模拟
 *
 * 3 dots + tab row + URL box all hairline,
 * URL mono no https://, CTA square accent button, no favicon
 */
export const BrowserMock: React.FC<BrowserMockProps> = ({
  theme,
  url,
  tabTitle = 'New Tab',
  ctaText = 'Sign Up',
  children,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const entryProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  })

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.line}`,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        opacity: entryProgress,
        transform: `scale(${interpolate(entryProgress, [0, 1], [0.96, 1])})`,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: `${theme.spacing.s1}px ${theme.spacing.s2}px`,
          borderBottom: `1px solid ${theme.colors.line}`,
          gap: theme.spacing.s1,
        }}
      >
        {/* 3 dots */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                border: `1px solid ${theme.colors.lineStrong}`,
                backgroundColor: 'transparent',
              }}
            />
          ))}
        </div>

        {/* Tab */}
        <div
          style={{
            marginLeft: theme.spacing.s2,
            padding: '4px 14px',
            borderRadius: `${theme.borderRadius.sm}px ${theme.borderRadius.sm}px 0 0`,
            border: `1px solid ${theme.colors.line}`,
            borderBottom: 'none',
            fontFamily: theme.typography.sansFont,
            fontSize: theme.typography.scale.small,
            color: theme.colors.foregroundSecondary,
          }}
        >
          {tabTitle}
        </div>
      </div>

      {/* URL bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${theme.spacing.s1}px ${theme.spacing.s2}px`,
          borderBottom: `1px solid ${theme.colors.line}`,
        }}
      >
        <div
          style={{
            flex: 1,
            padding: '4px 12px',
            border: `1px solid ${theme.colors.line}`,
            borderRadius: theme.borderRadius.sm,
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.small,
            color: theme.colors.foregroundSecondary,
            marginRight: theme.spacing.s2,
          }}
        >
          {url}
        </div>

        {/* CTA button */}
        <div
          style={{
            padding: '6px 16px',
            backgroundColor: theme.colors.accent,
            color: theme.colors.background,
            fontFamily: theme.typography.sansFont,
            fontSize: theme.typography.scale.small,
            fontWeight: theme.typography.weight.mid,
            borderRadius: theme.borderRadius.sm,
          }}
        >
          {ctaText}
        </div>
      </div>

      {/* Content area */}
      <div
        style={{
          minHeight: 200,
          padding: theme.spacing.s3,
        }}
      >
        {children}
      </div>
    </div>
  )
}
