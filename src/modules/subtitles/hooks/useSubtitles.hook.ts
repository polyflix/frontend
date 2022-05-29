import { Subtitle } from '@subtitles/models/subtitle.model'
import { useGetVideoSubtitleQuery } from '@subtitles/services/subtitle.service'
import { useCallback, useEffect, useState } from 'react'

import { Block, VttFile } from '@polyflix/vtt-parser'

import {
  i18nLanguageToSubtitleLanguage,
  PolyflixLanguage,
} from '@core/utils/language.util'

import { SubtitleState } from '@videos/contexts/Subtitles.context'
import { Video } from '@videos/models/video.model'

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
  // const minioService = useInjection<MinioService>(MinioService)
  // const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const [state, setState] = useState<SubtitleState>('loading')
  // const { isLoading: authLoading } = useAuth()
  const [subtitles, setSubtitles] = useState<Subtitle[]>()

  // We use the current frontend language to predict the subtitle we want to fetch
  let currentLanguage = localStorage.getItem('i18nextLng')
  const language = useGetVideoSubtitleQuery({
    slug: video.slug,
    language: i18nLanguageToSubtitleLanguage(
      (currentLanguage ?? 'en') as PolyflixLanguage
    ),
  })

  const dispatchSubtitle = useCallback(async () => {
    if (!language.data) {
      return
    }

    setState('success')

    const subtitle: Subtitle = {
      lang: language.data.language,
      vttUrl: language.data.accessUrl,
      vttFile: await VttFile.fromUrl(language.data.accessUrl),
    }
    setSubtitles([subtitle])
  }, [language])

  // Handling pending request to trigger dispatch
  useEffect(() => {
    if (language.status === 'pending') {
      // wait
      return
    }

    if (language.status === 'rejected' || !language.data) {
      setState('error')
      return
    }
    dispatchSubtitle()
  }, [language])

  // const fetchSubtitles = useCallback(async () => {
  //   const fetchedSubtitles: Subtitle[] = []
  //   setState('loading')
  //
  //   video.availableLanguages.forEach(async (language) => {
  //     try {
  //       const { tokenAccess } = await minioService.getSubtitlePresignedUrl(
  //         video.id,
  //         language
  //       )
  //       fetchedSubtitles.push({
  //         lang: language,
  //         vttUrl: tokenAccess,
  //         vttFile: await VttFile.fromUrl(tokenAccess),
  //       })
  //     } catch (e) {
  //       setState('error')
  //       snackbarService.createSnackbar('Failed to fetch subtitles', {
  //         variant: 'error',
  //       })
  //     }
  //     setState('success')
  //     setSubtitles(fetchedSubtitles)
  //   })
  // }, [minioService, snackbarService, video.availableLanguages, video.id])
  //
  // useEffect(() => {
  //   if (authLoading || subtitles || language.status === "pending") {
  //     return
  //   }
  //
  //   fetchSubtitles().finally()
  // }, [
  //   subtitles,
  //   video.sourceType,
  //   video.availableLanguages.length,
  //   fetchSubtitles,
  //   authLoading,
  //   language
  // ])

  return {
    state,
    subtitles,
  }
}
