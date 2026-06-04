import React from 'react'
import { Composition, Sequence, Audio, staticFile } from 'remotion'
import {
  Analogy,
  BarChart,
  BigType,
  KeywordSticker,
  PullQuote,
  SubtitleHighlight,
  Versus,
} from '../components'
import type { DesignTokens } from '../../themes/_template'

// 主题 — 可替换为其他预设或自定义 theme.ts
import theme from '../../themes/shadow-cut'


/**
 * 把火箭做成出租车 · SpaceX 22 年
 *
 * 由 video-spec.md 自动生成 — 2026-06-04
 * 总时长: 180s · 5400 帧 @ 30fps
 * 场景数: 20
 *
 * ⚠️ 此文件由 scripts/generate-composition.ts 自动生成
 * 如需修改，请编辑 video-spec.md 后重新生成：
 *   npx tsx scripts/generate-composition.ts
 */

const FPS = 30
const WIDTH = 1920
const HEIGHT = 1080
const TOTAL_FRAMES = 5400

const VideoFromSpec: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.background,
    }}>
        {/* Scene 01 · 0s–5s · hook · 冷开场 */}
        <Sequence
          from={0}
          durationInFrames={150}
          name="scene-01"
        >
          <KeywordSticker
              theme={theme}
          />
        </Sequence>

        {/* Scene 02 · 5s–10s · hook · 回拨 22 年 */}
        <Sequence
          from={150}
          durationInFrames={150}
          name="scene-02"
        >
          <KeywordSticker
              theme={theme}
          />
        </Sequence>

        {/* Scene 03 · 10s–15s · hook · 抛出命题 */}
        <Sequence
          from={300}
          durationInFrames={150}
          name="scene-03"
        >
          <BigType
              theme={theme}
              title="\"把火箭做成出租车\"，\"出租车\"三字 accent 色"
              entrance="slam"
          />
        </Sequence>

        {/* Scene 04 · 15s–23s · 基础 · Falcon 1 第四发 */}
        <Sequence
          from={450}
          durationInFrames={240}
          name="scene-04"
        >
          <SubtitleHighlight
              theme={theme}
              text="\"2008 年 9 月 28 日，Falcon 1 第四次试飞。前三次，全炸了。公司账上的钱，也烧光了。\""
              mode="karaoke"
          />
        </Sequence>

        {/* Scene 05 · 23s–30s · 基础 · 入轨那一刻 */}
        <Sequence
          from={690}
          durationInFrames={210}
          name="scene-05"
        >
          <KeywordSticker
              theme={theme}
          />
        </Sequence>

        {/* Scene 06 · 30s–40s · 回收 · 七年与 2015 升空 */}
        <Sequence
          from={900}
          durationInFrames={300}
          name="scene-06"
        >
          <SubtitleHighlight
              theme={theme}
              text="\"接下来七年，SpaceX 在做一件所有人都觉得不可能的事——让一级火箭，飞完自己回家。2015 年 12 月 21 日，Falcon 9 把 11 颗 Orbcomm 卫星送上轨道。\""
              mode="karaoke"
          />
        </Sequence>

        {/* Scene 07 · 40s–48s · 回收 · 落回 Landing Zone 1 */}
        <Sequence
          from={1200}
          durationInFrames={240}
          name="scene-07"
        >
          <KeywordSticker
              theme={theme}
          />
        </Sequence>

        {/* Scene 08 · 48s–55s · 回收 · Musk 引用 */}
        <Sequence
          from={1440}
          durationInFrames={210}
          name="scene-08"
        >
          <PullQuote
              theme={theme}
              quote="No one has ever brought an orbital class booster back intact."
          />
        </Sequence>

        {/* Scene 09 · 55s–67s · 复用 · B1021 翻新再飞 */}
        <Sequence
          from={1650}
          durationInFrames={360}
          name="scene-09"
        >
          <SubtitleHighlight
              theme={theme}
              text="\"但回得来，只是上半场。真正的大事，发生在 2017 年 3 月 30 日。助推器 B1021——2016 年它执行过 CRS-8——这一次，它被翻新、加注、重新点火，把 SES-10 送进了轨道。\""
              mode="karaoke"
          />
        </Sequence>

        {/* Scene 10 · 67s–75s · 复用 · 同一枚火箭（强调停顿） */}
        <Sequence
          from={2010}
          durationInFrames={240}
          name="scene-10"
        >
          <BigType
              theme={theme}
              title="分两次落 \"同一枚火箭\" → \"第 2 次飞行\"，\"第 2 次\"用 accent 色"
              entrance="slam"
          />
        </Sequence>

        {/* Scene 11 · 75s–88s · 经济 · 一次性火箭与打车类比 */}
        <Sequence
          from={2250}
          durationInFrames={390}
          name="scene-11"
        >
          <Analogy
              theme={theme}
              unfamiliar="概念A"
              familiar="概念B"
          />
        </Sequence>

        {/* Scene 12 · 88s–100s · 经济 · 数据揭示 */}
        <Sequence
          from={2640}
          durationInFrames={360}
          name="scene-12"
        >
          <BarChart
              theme={theme}
              data={[{ label: '示例', value: 100 }]}
              title="经济 · 数据揭示"
          />
        </Sequence>

        {/* Scene 13 · 100s–108s · 高潮 · 不止于降落 */}
        <Sequence
          from={3000}
          durationInFrames={240}
          name="scene-13"
        >
          <SubtitleHighlight
              theme={theme}
              text="\"但 Musk 不满足于'飞完、再降下来'。他要的是——飞完，直接接住。2024 年 10 月 13 日，Starship 第五次试飞。\""
              mode="karaoke"
          />
        </Sequence>

        {/* Scene 14 · 108s–117s · 高潮 · Super Heavy 返场 */}
        <Sequence
          from={3240}
          durationInFrames={270}
          name="scene-14"
        >
          <KeywordSticker
              theme={theme}
          />
        </Sequence>

        {/* Scene 15 · 117s–124s · 高潮 · 悬停七秒（留白） */}
        <Sequence
          from={3510}
          durationInFrames={210}
          name="scene-15"
        >
          <KeywordSticker
              theme={theme}
          />
        </Sequence>

        {/* Scene 16 · 124s–130s · 高潮 · 筷子臂合拢（重击 + 静止） */}
        <Sequence
          from={3720}
          durationInFrames={180}
          name="scene-16"
        >
          <KeywordSticker
              theme={theme}
          />
        </Sequence>

        {/* Scene 17 · 130s–145s · 范式 · 为什么不要落地架 */}
        <Sequence
          from={3900}
          durationInFrames={450}
          name="scene-17"
        >
          <KeywordSticker
              theme={theme}
          />
        </Sequence>

        {/* Scene 18 · 145s–160s · 范式 · 两个范式 */}
        <Sequence
          from={4350}
          durationInFrames={450}
          name="scene-18"
        >
          <Versus
              theme={theme}
              leftTitle="方案A"
              rightTitle="方案B"
          />
        </Sequence>

        {/* Scene 19 · 160s–172s · 收尾 · 22 年时间轴 */}
        <Sequence
          from={4800}
          durationInFrames={360}
          name="scene-19"
        >
          <KeywordSticker
              theme={theme}
          />
        </Sequence>

        {/* Scene 20 · 172s–180s · 收尾 · 大字呼应 */}
        <Sequence
          from={5160}
          durationInFrames={240}
          name="scene-20"
        >
          <BigType
              theme={theme}
              title="\"把火箭做成出租车\"，这次\"出租车\"三字最大、占主导；上方时间轴 \"2002 ········· 2024\"（22 个 dot）；底部小字 #SpaceX"
              entrance="slam"
          />
        </Sequence>
    </div>
  )
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoFromSpec"
        component={VideoFromSpec}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  )
}
