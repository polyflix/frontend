import { Subtitle } from '@subtitles/models/subtitle.model'
import { Video as VideoVime, Youtube } from '@vime/react'
import React, { PropsWithChildren } from 'react'

import { Track } from '@videos/types/track.type'
import { PlayerVideoSource } from '@videos/types/video.type'

/**
 * Format tracks in order to be imported properly
 * @param videoSubtitles
 */
function getTracks(videoSubtitles: Subtitle[]) {
  let tracks: Track[] = []
  for (const subtitle of videoSubtitles) {
    tracks.push({
      kind: 'subtitles',
      label: subtitle.lang,
      srcLang: subtitle.lang,
      src: subtitle.vttUrl,
      default: tracks.length === 0, // 1st is default
    })
  }
  return tracks
}

type ProviderProps = {
  rawVideoSource: string
  videoSubtitles: Subtitle[]
  videoSourceType: PlayerVideoSource
}

/**
 * Depending on the video source we extend the proper video player
 * @param videoUrl
 * @param videoSubtitles
 * @constructor
 */
export const Provider: React.FC<PropsWithChildren<ProviderProps>> = ({
  videoSubtitles,
  videoSourceType,
  rawVideoSource: streamUrl,
}) => {
  const tracks = getTracks(videoSubtitles ?? [])

  switch (videoSourceType) {
    case PlayerVideoSource.YOUTUBE:
      return (
        <Youtube
          videoId={streamUrl}
          cookies={false}
          className="youtube"
          style={{
            height: '100%',
            display: 'flex',
            width: '100%',
          }}
        />
      )
    case PlayerVideoSource.INTERNAL:
      return (
        <VideoVime
          crossOrigin="use-credentials"
          style={{
            height: '100%',
            display: 'flex',
            width: '100%',
          }}
        >
          <source data-src={streamUrl} type="video/mp4" />
          {tracks.map((track, i) => (
            <track {...track} key={i} />
          ))}
        </VideoVime>
      )
    case PlayerVideoSource.UNKNOWN:
      return (
        <VideoVime crossOrigin="use-credentials">
          <source data-src={streamUrl} type="video/mp4" />
        </VideoVime>
      )
  }
}
