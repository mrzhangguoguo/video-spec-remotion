import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import type { DesignTokens } from '../../../themes/_template'

interface ApiCallProps {
  theme: DesignTokens
  /** HTTP 方法 */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  /** 请求路径 */
  path: string
  /** 延迟 ms */
  latencyMs: number
  /** 响应状态码 */
  status: number
  /** 请求头/体 key-value */
  requestHeaders?: Record<string, string>
  /** 响应体 key-value */
  responseJson?: Record<string, unknown>
  /** 出现帧 */
  startFrame?: number
}

/**
 * broll-ui.api-call — API 调用面板
 *
 * left request / center latency / right response 3-column,
 * POST=accent / 200=green / error=red,
 * keys fg 42% values white/accent, center shows real ms
 */
export const ApiCall: React.FC<ApiCallProps> = ({
  theme,
  method = 'POST',
  path,
  latencyMs,
  status,
  requestHeaders,
  responseJson,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = Math.max(0, frame - startFrame)

  const entryProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 120 },
  })

  const isError = status >= 400
  const methodColor = method === 'POST' ? theme.colors.accent : theme.colors.foregroundSecondary
  const statusColor = isError ? theme.colors.red : theme.colors.green

  // Latency 数字从 0 递增
  const latencyProgress = interpolate(
    localFrame,
    [10, 40],
    [0, latencyMs],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const renderKeyValue = (obj: Record<string, unknown>, indent = 0) => {
    return Object.entries(obj).map(([key, value]) => (
      <div key={key} style={{ paddingLeft: indent * 12 }}>
        <span style={{ color: theme.colors.foregroundMuted }}>{key}</span>
        <span style={{ color: theme.colors.foregroundMuted }}>: </span>
        <span style={{ color: theme.colors.foreground }}>
          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
        </span>
      </div>
    ))
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: theme.spacing.s2,
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.line}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.s3,
        fontFamily: theme.typography.monoFont,
        fontSize: theme.typography.scale.small,
        opacity: entryProgress,
        transform: `scale(${interpolate(entryProgress, [0, 1], [0.97, 1])})`,
      }}
    >
      {/* Left: Request */}
      <div
        style={{
          borderRight: `1px solid ${theme.colors.line}`,
          paddingRight: theme.spacing.s2,
        }}
      >
        <div
          style={{
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.cap,
            letterSpacing: theme.typography.letterSpacing.caps,
            textTransform: 'uppercase',
            color: theme.colors.foregroundMuted,
            marginBottom: theme.spacing.s1,
          }}
        >
          Request
        </div>
        <div style={{ marginBottom: 4 }}>
          <span style={{ color: methodColor, fontWeight: theme.typography.weight.mid }}>
            {method}
          </span>
          <span style={{ color: theme.colors.foreground, marginLeft: 8 }}>{path}</span>
        </div>
        {requestHeaders && renderKeyValue(requestHeaders)}
      </div>

      {/* Center: Latency */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 100,
        }}
      >
        <div
          style={{
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.cap,
            letterSpacing: theme.typography.letterSpacing.caps,
            textTransform: 'uppercase',
            color: theme.colors.foregroundMuted,
            marginBottom: theme.spacing.s1,
          }}
        >
          Latency
        </div>
        <div
          style={{
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.h3,
            fontWeight: theme.typography.weight.bold,
            fontVariantNumeric: 'tabular-nums',
            color: theme.colors.foreground,
          }}
        >
          {Math.round(latencyProgress)}
          <span
            style={{
              fontSize: theme.typography.scale.small,
              color: theme.colors.foregroundMuted,
              marginLeft: 4,
            }}
          >
            ms
          </span>
        </div>
      </div>

      {/* Right: Response */}
      <div
        style={{
          borderLeft: `1px solid ${theme.colors.line}`,
          paddingLeft: theme.spacing.s2,
        }}
      >
        <div
          style={{
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.cap,
            letterSpacing: theme.typography.letterSpacing.caps,
            textTransform: 'uppercase',
            color: theme.colors.foregroundMuted,
            marginBottom: theme.spacing.s1,
          }}
        >
          Response
        </div>
        <div style={{ marginBottom: 4, fontWeight: theme.typography.weight.mid }}>
          <span style={{ color: statusColor }}>{status}</span>
        </div>
        {responseJson && renderKeyValue(responseJson)}
      </div>
    </div>
  )
}
