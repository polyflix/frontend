import { Alert, List, ListItem, Skeleton, Stack } from '@mui/material'
import { usePlayerContext } from '@vime/react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Block } from '@polyflix/vtt-parser'

import { AutoScrollBox } from '@core/components/AutoScrollBox/AutoScrollBox.component'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useSubtitlesContext } from '@videos/hooks/useSubtitlesContext.hook'
import { Video } from '@videos/models/video.model'

import { SubtitleSentence } from './SubtitlesPanel.style'

type SubtitleTextProps = {
  block: Block
  playerRef: React.RefObject<HTMLVmPlayerElement>
}

// const SubtitleTextOld = ({ block, playerRef }: SubtitleTextProps) => {
//   const [currentTime, setCurrentTime] = usePlayerContext(
//     playerRef,
//     'currentTime',
//     0
//   )
//   const blockRef = useRef<HTMLDivElement>(null)

//   const executeScroll = (): void =>
//     blockRef?.current?.scrollIntoView({ block: 'center' })

//   const isCurrent =
//     block.startTime / 1000 <= currentTime && block.endTime / 1000 > currentTime

//   if (isCurrent) {
//     executeScroll()
//   }
//   return (
//     <ListItemTextStyle
//       ref={blockRef}
//       current={isCurrent.toString()}
//       onClick={() => setCurrentTime(block.startTime / 1000)}
//       primary={block.text}
//       // secondary={msToHMS(block.startTime)}
//     />
//   )
// }

const SubtitleText = ({ block, playerRef }: SubtitleTextProps) => {
  const [currentTime, setCurrentTime] = usePlayerContext(
    playerRef,
    'currentTime',
    0
  )
  const blockRef = useRef<HTMLDivElement>(null)

  console.log(block.text)
  const executeScroll = (): void =>
    blockRef?.current?.scrollIntoView({ block: 'center' })

  const isCurrent =
    block.startTime / 1000 <= currentTime && block.endTime / 1000 > currentTime

  if (isCurrent) {
    executeScroll()
  }
  return (
    <SubtitleSentence
      ref={blockRef}
      current={isCurrent.toString()}
      onClick={() => setCurrentTime(block.startTime / 1000)}
      // value={block.text}
      // secondary={msToHMS(block.startTime)}
    >
      {block.text}
    </SubtitleSentence>
  )
}

type SubtitlePanelProps = {
  video: Video
  playerRef: React.RefObject<HTMLVmPlayerElement>
}

export const SubtitlePanel = ({ playerRef }: SubtitlePanelProps) => {
  const { currentSubtitle, state: subtitleState } = useSubtitlesContext()
  const { t } = useTranslation('videos')

  const ghosts = buildSkeletons(5)

  const content = () => {
    switch (subtitleState) {
      case 'loading':
        return (
          <>
            {ghosts.map((_, index: number) => (
              <SubtitleSentence key={index}>
                <Stack
                  spacing={2}
                  direction="row"
                  sx={{ width: '100%', height: 22, marginLeft: 2 }}
                  alignItems="center"
                >
                  <Skeleton animation="wave" width="58px" height={15} />
                  <Skeleton
                    animation="wave"
                    width={`${Math.random() * 20 + 40}%`}
                    height={15}
                  />
                </Stack>
              </SubtitleSentence>
            ))}
          </>
        )
      case 'error':
        return (
          <ListItem>
            <Alert severity="error" sx={{ width: '100%' }}>
              {t('slug.sidebar.tabs.subtitles.alertMessages.error')}
            </Alert>
          </ListItem>
        )
      case 'success':
        return (currentSubtitle?.vttFile.getBlocks() || []).map(
          (block: Block, i: number) => (
            <SubtitleText key={i} block={block} playerRef={playerRef} />
          )
        )
      default:
        return (
          <ListItem>
            <Alert severity="info" sx={{ width: '100%' }}>
              {t('slug.sidebar.tabs.subtitles.alertMessages.info')}
            </Alert>
          </ListItem>
        )
    }
  }

  return (
    <AutoScrollBox>
      <List sx={{ padding: '1em' }} dense={true}>
        {content()}
      </List>
    </AutoScrollBox>
  )
}
