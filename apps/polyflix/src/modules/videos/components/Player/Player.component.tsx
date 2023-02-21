import { Box } from '@mui/material'
import zIndex from '@mui/material/styles/zIndex'
import {
  SYNC_RATE_LIMITER_MAX,
  SYNC_RATE_LIMITER_MIN,
} from '@stats/constants/stats.constant'
import { useSubtitles } from '@subtitles/hooks/useSubtitles.hook'
import {
  Captions,
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

import { useInterval } from '@core/hooks/useInterval.hook'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { useStreamUrl } from '@videos/hooks/useStreamUrl.hook'
import { useSubtitlesContext } from '@videos/hooks/useSubtitlesContext.hook'
import { Video } from '@videos/models/video.model'
import { useUpdateWatchtimeMutation } from '@shared/services/resources/videos/video.service'

import { ErrorCard } from '../ErrorCard/ErrorCard.component'
import { Provider } from '../PlayerProvider/Provider.component'

type Props = {
  video: Video
  /**
   * Reference used for the player & sync of subtitles
   */
  playerRef: React.RefObject<HTMLVmPlayerElement>
}

const PLAYER_VOLUME_DOWN_STEP = 10
const PLAYER_VOLUME_UP_STEP = 10
const PLAYER_MOVE_FORWARD_STEP = 13
const PLAYER_MOVE_BACKWARD_STEP = 10

export const Player: React.FC<Props> = ({ playerRef, video }) => {
  const { token } = useAuth()
  const hostRef = useRef<HTMLDivElement>(null)

  const [updateWatchtime] = useUpdateWatchtimeMutation()

  const {
    streamUrl,
    error: streamUrlError,
    loading: videoLoading,
  } = useStreamUrl(video)

  const { setSubtitles, setState } = useSubtitlesContext()
  const { subtitles, state: subtitleState } = useSubtitles(video)

  // last time the interval was executed
  const [lastSync, setLastSync] = useState<number | undefined>()

  // time from player to last sync
  const [lastPlayerTime, setLastPlayerTime] = useState<number | undefined>()
  useEffect(() => {
    setSubtitles(subtitles)
    setState(subtitleState)
  }, [setState, setSubtitles, subtitles, subtitleState])

  const [mediaError, setMediaError] = useState<string>()

  const {
    sourceType: videoSourceType,
    thumbnail: videoThumbnail,
    slug: videoSlug,
    // userMeta,
    watchtime,
  } = video
  const loading = videoLoading

  const onTriggerWatchtimeEvent = () => {
    if (
      !playerRef?.current ||
      !token ||
      [0, -1].indexOf(playerRef.current.duration) > -1
    )
      return

    if (lastSync && Date.now() - lastSync < SYNC_RATE_LIMITER_MIN) {
      return
    }

    const currentTimeInMillis: number = +(
      playerRef.current.currentTime * 1000
    ).toFixed(0)

    if (
      lastPlayerTime &&
      currentTimeInMillis - lastPlayerTime < SYNC_RATE_LIMITER_MIN
    ) {
      return
    }

    if (currentTimeInMillis < 5000) return

    setLastSync(Date.now())

    if (lastPlayerTime) {
      if (currentTimeInMillis > lastPlayerTime!) {
        setLastPlayerTime(currentTimeInMillis)
      }
    } else {
      setLastPlayerTime(currentTimeInMillis)
    }

    updateWatchtime({
      videoId: videoSlug,
      watchedSeconds: +playerRef.current?.currentTime?.toFixed(2),
      watchedPercent: +(
        playerRef.current?.currentTime / playerRef.current?.duration
      ).toFixed(2),
    })
  }

  useInterval(onTriggerWatchtimeEvent, SYNC_RATE_LIMITER_MAX)

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
    if (playerRef?.current && watchtime?.watchedSeconds)
      playerRef.current.currentTime = watchtime.watchedSeconds
  }

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
        <div
          style={{
            margin: 'auto',
            position: 'absolute',
            zIndex: zIndex.modal,
            width: '100%',
            height: '100%',
          }}
        >
          <ErrorCard />
        </div>
      )}
      <PlayerVime
        playsinline
        ref={playerRef}
        onVmSeeked={onTriggerWatchtimeEvent.bind(this)}
        onVmPlaybackStarted={onPlaybackStart}
        onVmPlaybackEnded={onTriggerWatchtimeEvent.bind(this)}
        currentPoster={videoThumbnail}
        onVmError={(e) => {
          if (e.detail instanceof MediaError) {
            setMediaError(`${e.detail.message} - Code ${e.detail.code}`)
          }
        }}
      >
        {subtitles && subtitleState !== 'loading' && (
          <Provider
            rawVideoSource={streamUrl ?? ''}
            videoSourceType={videoSourceType}
            videoSubtitles={subtitles}
          />
        )}
        <Ui>
          <DblClickFullscreen />
          <Captions />
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
