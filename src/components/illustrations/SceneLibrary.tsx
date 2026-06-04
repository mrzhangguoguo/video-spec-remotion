import React from 'react'
import type { DesignTokens } from '../../../themes/_template'
import { SceneThinking } from './SceneThinking'
import { SceneCoCreate } from './SceneCoCreate'
import { ScenePrompt } from './ScenePrompt'
import { SceneRetrieval } from './SceneRetrieval'
import { SceneAnalytics } from './SceneAnalytics'
import { SceneLaunch } from './SceneLaunch'

/** 可选场景名称 */
export type SceneName =
  | 'thinking'
  | 'co-create'
  | 'prompt'
  | 'retrieval'
  | 'analytics'
  | 'launch'

interface SceneLibraryProps {
  theme: DesignTokens
  /** 场景名称 */
  scene: SceneName
  title?: string
  subtitle?: string
}

const SCENE_MAP: Record<SceneName, React.FC<{
  theme: DesignTokens
  title?: string
  subtitle?: string
}>> = {
  'thinking': SceneThinking,
  'co-create': SceneCoCreate,
  'prompt': ScenePrompt,
  'retrieval': SceneRetrieval,
  'analytics': SceneAnalytics,
  'launch': SceneLaunch,
}

/**
 * illustrations.scene-library — Meta component
 *
 * Picks from the 6 scenes above by name.
 */
export const SceneLibrary: React.FC<SceneLibraryProps> = ({
  theme,
  scene,
  title,
  subtitle,
}) => {
  const SceneComponent = SCENE_MAP[scene]

  if (!SceneComponent) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: theme.typography.monoFont,
          fontSize: theme.typography.scale.small,
          color: theme.colors.foregroundMuted,
        }}
      >
        Unknown scene: {scene}
      </div>
    )
  }

  return <SceneComponent theme={theme} title={title} subtitle={subtitle} />
}
