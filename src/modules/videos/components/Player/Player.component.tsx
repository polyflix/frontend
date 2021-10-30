import { Box } from '@mui/material'
import { useSubtitles } from '@subtitles/hooks/useSubtitles.hook'
import {
  ClickToPlay,
  DblClickFullscreen,
  DefaultControls,
  DefaultSettings,
  LoadingScreen,
  Player as PlayerVime,
  Poster,
  Ui,
} from '@vime/react'
import React, { useEffect, useRef, useState } from 'react'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { useStreamUrl } from '@videos/hooks/useStreamUrl.hook'
import { Video } from '@videos/models/video.model'

import { ErrorCard } from '../ErrorCard/ErrorCard.component'
import { Provider } from '../PlayerProvider/Provider.component'

type Props = {
  video: Video
  /**
   * Reference used for the player & sync of subtitles
   */
  playerRef: React.RefObject<HTMLVmPlayerElement>
  /**
   * ??
   */
  onVideoEnd: () => void
}

const PLAYER_VOLUME_DOWN_STEP = 10
const PLAYER_VOLUME_UP_STEP = 10
const PLAYER_MOVE_FORWARD_STEP = 13
const PLAYER_MOVE_BACKWARD_STEP = 10

export const Player: React.FC<Props> = ({ playerRef, onVideoEnd, video }) => {
  const { token } = useAuth()
  const hostRef = useRef<HTMLDivElement>(null)

  // TODO const statsService = useInjection<WatchtimeSyncService>(WatchtimeSyncService)
  const {
    streamUrl,
    error: streamUrlError,
    loading: videoLoading,
  } = useStreamUrl(video)
  const { subtitles, loading: subtitlesLoading } = useSubtitles(video)
  const [mediaError, setMediaError] = useState<string>()

  const {
    sourceType: videoSourceType,
    thumbnail: videoThumbnail,
    id: videoId,
    userMeta,
  } = video
  const loading = videoLoading || subtitlesLoading

  const onTriggerWatchtimeEvent = () => {
    if (
      !playerRef?.current ||
      !token ||
      [0, -1].indexOf(playerRef.current.duration) > -1
    )
      return

    // TODO
    // statsService.updateSync({
    //   videoId: videoId,
    //   watchedSeconds: playerRef.current.currentTime,
    //   watchedPercent:
    //     playerRef.current.currentTime / playerRef.current.duration,
    // })
  }

  const keyboardListener = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!playerRef?.current) return
    const player = playerRef?.current

    // Play / Pause the video
    if (event.key === 'k' || event.key === ' ') {
      if (player?.paused) {
        player?.play()
      } else {
        player?.pause()
      }
    }

    // Mute the video
    if (event.key === 'm') {
      player.muted = !player?.muted
    }

    // enter / exit fullscreen
    if (event.key === 'f') {
      if (player?.isFullscreenActive) {
        player?.exitFullscreen()
      } else {
        player?.enterFullscreen()
      }
    }

    // Volume up
    if (event.key === 'ArrowUp') {
      let vol = player?.volume
      let nextVol = vol + PLAYER_VOLUME_UP_STEP
      if (nextVol > 100) nextVol = 100
      player.volume = nextVol
    }

    // Volume down
    if (event.key === 'ArrowDown') {
      let vol = player?.volume
      let nextVol = vol - PLAYER_VOLUME_DOWN_STEP
      if (nextVol < 0) nextVol = 0
      player.volume = nextVol
    }

    // Move forward
    if (event.key === 'ArrowLeft') {
      let time = player.currentTime
      let nextTime = time - PLAYER_MOVE_BACKWARD_STEP
      if (nextTime < 0) nextTime = 0
      player.currentTime = nextTime
    }

    // Move backwark
    if (event.key === 'ArrowRight') {
      let time = player.currentTime
      let nextTime = time + PLAYER_MOVE_FORWARD_STEP
      if (nextTime > player.duration) nextTime = player.duration
      player.currentTime = nextTime
    }

    // toggle captions
    if (event.key === 'c') {
      if (player.isTextTrackVisible) {
        player.setTextTrackVisibility(false)
      } else {
        player.setTextTrackVisibility(true)
      }
    }

    // toggle captions
    if (event.key === 'p') {
      if (player.isPiPActive) {
        player.exitPiP()
      } else {
        player.enterPiP()
      }
    }
  }

  const onPlaybackStart = () => {
    if (playerRef?.current && userMeta?.watchedSeconds)
      playerRef.current.currentTime = userMeta.watchedSeconds
  }

  useEffect(onTriggerWatchtimeEvent, [
    playerRef,
    // statsService,
    token,
    videoId,
    onTriggerWatchtimeEvent,
  ])
  useEffect(() => {
    // statsService.startTimer(onTriggerWatchtimeEvent)
    return () => {
      onTriggerWatchtimeEvent()
      // statsService.stopTimer()
    }
    // We disable eslint on the next line, else it would prompt a warning on
    // on the fact that onTriggerWatchTimeEvent is not in dependency array.
    // But we know tat it is a constant that won't move at all
    // eslint-disable-next-line
    // }, [statsService])
  }, [])

  return (
    <Box
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
      }}
      ref={hostRef}
      onKeyDown={keyboardListener}
      tabIndex={0}
    >
      {(mediaError || streamUrlError) && (
        <div>
          <ErrorCard />
        </div>
      )}
      <PlayerVime
        playsinline
        ref={playerRef}
        onVmSeeked={onTriggerWatchtimeEvent}
        onVmPlaybackStarted={onPlaybackStart}
        onVmPlaybackEnded={onVideoEnd}
        currentPoster={videoThumbnail}
        onVmError={(e) => {
          if (e.detail instanceof MediaError) {
            setMediaError(`${e.detail.message} - Code ${e.detail.code}`)
          }
        }}
      >
        {!subtitlesLoading && subtitles && (
          <Provider
            rawVideoSource={streamUrl ?? ''}
            videoSourceType={videoSourceType}
            videoSubtitles={subtitles}
          />
        )}
        <Ui>
          <DblClickFullscreen />
          {/* Remove captions as they were creating double subtitles, so not needed */}
          {/*<Captions />*/}
          <LoadingScreen hideDots={streamUrlError !== null} />
          <div>
            <Poster />
          </div>
          {streamUrl && !loading && <DefaultControls />}
          {streamUrl && !loading && <DefaultSettings />}
          {streamUrl && !loading && <ClickToPlay />}
        </Ui>
      </PlayerVime>
    </Box>
  )
}
