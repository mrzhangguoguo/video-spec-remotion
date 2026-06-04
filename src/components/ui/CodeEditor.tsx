import React from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import { Highlight, themes } from 'prism-react-renderer'
import type { DesignTokens } from '../../../themes/_template'

interface FileTreeNode {
  name: string
  type: 'file' | 'folder'
  children?: FileTreeNode[]
}

interface CodeEditorProps {
  theme: DesignTokens
  /** 代码内容 */
  code: string
  /** 语言（默认 typescript） */
  language?: string
  /** 文件名标签 */
  filename?: string
  /** 高亮行号（从 1 开始） */
  highlightLine?: number
  /** 可选文件树 */
  fileTree?: FileTreeNode
  /** 开始帧 */
  startFrame?: number
}

/**
 * broll-ui.code-editor — 代码编辑器
 *
 * keyword=accent / string=fg 66% / comment=fg 42% italic,
 * line numbers mono fg 42% right-aligned,
 * current line left 2px accent bar, optional 32px file tree
 */
export const CodeEditor: React.FC<CodeEditorProps> = ({
  theme,
  code,
  language = 'typescript',
  filename,
  highlightLine,
  fileTree,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = Math.max(0, frame - startFrame)

  const entryProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 20, stiffness: 100 },
  })

  // 自定义 token 样式覆盖
  const tokenOverrides: Record<string, React.CSSProperties> = {
    keyword: { color: theme.colors.accent },
    string: { color: theme.colors.foregroundSecondary },
    comment: { color: theme.colors.foregroundMuted, fontStyle: 'italic' },
    'plain-text': { color: theme.colors.foreground },
  }

  const renderFileTree = (node: FileTreeNode, depth = 0): React.ReactNode => {
    return (
      <div key={node.name} style={{ paddingLeft: depth * 12 }}>
        <div
          style={{
            fontFamily: theme.typography.monoFont,
            fontSize: theme.typography.scale.small,
            color: node.type === 'folder'
              ? theme.colors.foregroundSecondary
              : theme.colors.foregroundMuted,
            padding: '2px 0',
            whiteSpace: 'nowrap',
          }}
        >
          {node.type === 'folder' ? '▸ ' : '  '}
          {node.name}
        </div>
        {node.children?.map((child) => renderFileTree(child, depth + 1))}
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.line}`,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        fontFamily: theme.typography.monoFont,
        opacity: entryProgress,
        transform: `translateY(${interpolate(entryProgress, [0, 1], [8, 0])}px)`,
      }}
    >
      {/* File tree sidebar */}
      {fileTree && (
        <div
          style={{
            width: 32 * 4,
            minWidth: 128,
            padding: theme.spacing.s2,
            borderRight: `1px solid ${theme.colors.line}`,
            backgroundColor: theme.colors.background,
            overflow: 'hidden',
          }}
        >
          {renderFileTree(fileTree)}
        </div>
      )}

      {/* Code area */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {/* Filename tab */}
        {filename && (
          <div
            style={{
              padding: `${theme.spacing.s1}px ${theme.spacing.s2}px`,
              borderBottom: `1px solid ${theme.colors.line}`,
              fontFamily: theme.typography.monoFont,
              fontSize: theme.typography.scale.small,
              color: theme.colors.foregroundSecondary,
            }}
          >
            {filename}
          </div>
        )}

        {/* Code content */}
        <Highlight theme={themes.nightOwl} code={code} language={language}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre
              style={{
                margin: 0,
                padding: theme.spacing.s2,
                overflow: 'auto',
                fontSize: theme.typography.scale.body,
                lineHeight: theme.typography.lineHeight.body,
                fontFamily: theme.typography.monoFont,
              }}
            >
              {tokens.map((line, lineIndex) => {
                const lineNum = lineIndex + 1
                const isHighlighted = lineNum === highlightLine
                const lineProps = getLineProps({ line })

                return (
                  <div
                    key={lineIndex}
                    {...lineProps}
                    style={{
                      ...lineProps.style,
                      display: 'flex',
                      backgroundColor: isHighlighted
                        ? theme.colors.accent3
                        : 'transparent',
                      borderLeft: isHighlighted
                        ? `2px solid ${theme.colors.accent}`
                        : '2px solid transparent',
                      paddingLeft: isHighlighted ? 6 : 8,
                    }}
                  >
                    {/* Line number */}
                    <span
                      style={{
                        display: 'inline-block',
                        width: 36,
                        textAlign: 'right',
                        marginRight: theme.spacing.s2,
                        color: theme.colors.foregroundMuted,
                        userSelect: 'none',
                        flexShrink: 0,
                      }}
                    >
                      {lineNum}
                    </span>

                    {/* Tokens */}
                    <span>
                      {line.map((token, tokenIndex) => {
                        const tokenProps = getTokenProps({ token })
                        const tokenContent = tokenProps.children
                        const tokenType = token.types?.[0] || 'plain-text'

                        return (
                          <span
                            key={tokenIndex}
                            {...tokenProps}
                            style={{
                              ...tokenProps.style,
                              ...(tokenOverrides[tokenType] || {}),
                            }}
                          />
                        )
                      })}
                    </span>
                  </div>
                )
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  )
}
