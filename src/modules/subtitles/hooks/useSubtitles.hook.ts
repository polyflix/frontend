import { Subtitle } from '@subtitles/models/subtitle.model'
import { useGetVideoSubtitleQuery } from '@subtitles/services/subtitle.service'
import { useEffect, useState } from 'react'

import { Block } from '@polyflix/vtt-parser'

import {
  i18nLanguageToSubtitleLanguage,
  PolyflixLanguage,
} from '@core/utils/language.util'

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

  let currentLanguage = localStorage.getItem('i18nextLng')

  const isExternal = video.sourceType === PlayerVideoSource.YOUTUBE

  const { isLoading, isError, isFetching, data, error, isSuccess } =
    useGetVideoSubtitleQuery(
      {
        slug: video.slug,
        language: i18nLanguageToSubtitleLanguage(
          (currentLanguage ?? 'en') as PolyflixLanguage
        ),
      },
      {
        skip: isExternal,
      }
    )

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

    if (data) {
      setSubtitles(data)
      setState('success')
    }
  }, [isError, isSuccess])

  return {
    state,
    subtitles,
  }
}
