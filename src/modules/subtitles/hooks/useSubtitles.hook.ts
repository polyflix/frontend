import { Subtitle } from '@subtitles/models/subtitle.model'
import {
  useGetVideoSubtitleQuery,
  useGetVideoSubtitlesQuery,
} from '@subtitles/services/subtitle.service'
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
    subtitlesResponse.subtitles.forEach(async (sub) => {
      console.log(2, sub.language)
      const { isLoading: loadSub, data: subTitleByLang } =
        useGetVideoSubtitleQuery(
          { slug: video.slug, language: sub.language },
          { skip: isExternal }
        )
      console.log(2.5, loadSub)
      console.debug(3, subTitleByLang)
      mySubtitles.push({
        lang: subTitleByLang!.language,
        vttUrl: subTitleByLang!.accessUrl,
        vttFile: await VttFile.fromUrl(subTitleByLang!.accessUrl),
      } as Subtitle)
    })
    console.log(1)
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
