import { Block } from '@polyflix/vtt-parser'
import React from 'react'

import { WithClassname } from '../../common'
import { Subtitle, Video } from '../../videos'
import { SubtitleFetchingState } from '../pages/collaborative-subtitle-editing.page'
import { SubtitleBlockForm } from './subtitle-block-from.component'
import { SubtitleImprovementList } from './subtitle-improvement-list.component'

type SubtitleBlockContentProps = WithClassname & {
  subtitles: SubtitleFetchingState
  block: Block
  video: Video
}
export const SubtitleBlockContent: React.FC<SubtitleBlockContentProps> = ({
  block,
  subtitles,
  video,
}) => {
  return (
    <>
      <SubtitleBlockForm subtitles={subtitles} block={block} />
      <SubtitleImprovementList
        block={block}
        video={video}
        subtitle={subtitles.subtitle as Subtitle}
      />
    </>
  )
}
