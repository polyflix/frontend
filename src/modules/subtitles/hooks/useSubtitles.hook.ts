import { Subtitle } from '@subtitles/models/subtitle.model'
import { useGetVideoSubtitlesQuery } from '@subtitles/services/subtitle.service'
import { useCallback, useEffect, useState } from 'react'

import { Block, VttFile } from '@polyflix/vtt-parser'

import { SubtitleState } from '@videos/contexts/Subtitles.context'
import { Video } from '@videos/models/video.model'
import { PlayerVideoSource } from '@videos/types/video.type'

export type SubtitleFetchingState = {
  state: 'loading' | 'error' | 'idle' | 'succeed'
  subtitle?: Subtitle
  blocks?: Block[]
}

type UseSubtitlesProps = {
  subtitles: Subtitle[] | undefined
  state: SubtitleState
}

export const useSubtitles = (video: Video): UseSubtitlesProps => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>()

  const [state, setState] = useState<SubtitleState>('loading')

  const isExternal = video.sourceType === PlayerVideoSource.YOUTUBE

  const {
    isLoading,
    isError,
    isFetching,
    data: subtitlesResponse,
    error,
    isSuccess,
  } = useGetVideoSubtitlesQuery({ slug: video.slug }, { skip: isExternal })

  const applySubtitles = useCallback(async () => {
    if (!subtitlesResponse) {
      return
    }
    let mySubtitles: Subtitle[] = []
    for (const mySubtitle of subtitlesResponse) {
      let subtitle = {
        lang: mySubtitle.language,
        vttUrl: mySubtitle.accessUrl,
        vttFile: await VttFile.fromUrl(mySubtitle.accessUrl),
      } as Subtitle
      mySubtitles.push(subtitle)
    }
    setSubtitles(mySubtitles)
    setState('success')
  }, [subtitlesResponse])

  // Handling pending request to trigger dispatch
  useEffect(() => {
    if (isExternal) {
      setSubtitles([])
      setState('idle')
      return
    }
    if (isError) {
      setSubtitles([])
      switch ((error as any).status) {
        case 404:
          setState('idle')
          break
        default:
          setState('error')
          break
      }
      return
    }
    if (isLoading || isFetching) {
      setState('loading')
      return
    }

    if (subtitlesResponse) {
      applySubtitles()
    }
  }, [isError, isSuccess])

  return {
    state,
    subtitles,
  }
}
