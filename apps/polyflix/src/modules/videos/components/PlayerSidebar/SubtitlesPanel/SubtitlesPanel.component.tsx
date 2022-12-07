import { Alert, List, ListItem, Skeleton, Stack } from '@mui/material'
import { usePlayerContext } from '@vime/react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Block } from '@polyflix/vtt-parser'

import { AutoScrollBox } from '@core/components/AutoScrollBox/AutoScrollBox.component'
import { buildSkeletons } from '@core/utils/gui.utils'
import { msToHMS } from '@core/utils/time.util'

import { useSubtitlesContext } from '@videos/hooks/useSubtitlesContext.hook'
import { Video } from '@videos/models/video.model'

import { ListItemTextStyle, ListItemStyle } from './SubtitlesPanel.style'

type SubtitleTextProps = {
  block: Block
  playerRef: React.RefObject<HTMLVmPlayerElement>
}

const SubtitleText = ({ block, playerRef }: SubtitleTextProps) => {
  const [currentTime, setCurrentTime] = usePlayerContext(
    playerRef,
    'currentTime',
    0
  )
  const blockRef = useRef<HTMLDivElement>(null)

  const executeScroll = (): void =>
    blockRef?.current?.scrollIntoView({ block: 'center' })

  const isCurrent =
    block.startTime / 1000 <= currentTime && block.endTime / 1000 > currentTime

  if (isCurrent) {
    executeScroll()
  }
  return (
    <ListItemTextStyle
      ref={blockRef}
      current={isCurrent.toString()}
      onClick={() => setCurrentTime(block.startTime / 1000)}
      primary={block.text}
      secondary={msToHMS(block.startTime)}
    />
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
              <ListItemStyle key={index}>
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
              </ListItemStyle>
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
            <ListItemStyle key={i}>
              <SubtitleText block={block} playerRef={playerRef} />
            </ListItemStyle>
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
      <List dense={true}>{content()}</List>
    </AutoScrollBox>
  )
}
