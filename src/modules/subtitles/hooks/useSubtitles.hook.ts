import { Subtitle } from '@subtitles/models/subtitle.model'
import { useState, useCallback, useEffect } from 'react'

import { useInjection } from '@polyflix/di'
import { Block, VttFile } from '@polyflix/vtt-parser'

import { MinioService } from '@core/services/minio.service'
import { SnackbarService } from '@core/services/snackbar.service'

import { useAuth } from '@auth/hooks/useAuth.hook'

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
  const minioService = useInjection<MinioService>(MinioService)
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const [state, setState] = useState<SubtitleState>('loading')
  const { isLoading: authLoading } = useAuth()
  const [subtitles, setSubtitles] = useState<Subtitle[]>()

  const fetchSubtitles = useCallback(async () => {
    const fetchedSubtitles: Subtitle[] = []
    setState('loading')

    video.availableLanguages.forEach(async (language) => {
      try {
        const { tokenAccess } = await minioService.getSubtitlePresignedUrl(
          video.id,
          language
        )
        fetchedSubtitles.push({
          lang: language,
          vttUrl: tokenAccess,
          vttFile: await VttFile.fromUrl(tokenAccess),
        })
      } catch (e) {
        setState('error')
        snackbarService.createSnackbar('Failed to fetch subtitles', {
          variant: 'error',
        })
      }
      setState('success')
      setSubtitles(fetchedSubtitles)
    })
  }, [minioService, snackbarService, video.availableLanguages, video.id])

  useEffect(() => {
    if (authLoading || subtitles) {
      return
    }
    if (
      video.sourceType !== PlayerVideoSource.INTERNAL ||
      video.availableLanguages.length === 0
    ) {
      setSubtitles([])
      setState('idle')
      return
    }

    fetchSubtitles().finally()
  }, [
    subtitles,
    video.sourceType,
    video.availableLanguages.length,
    fetchSubtitles,
    authLoading,
  ])

  return {
    state,
    subtitles,
  }
}
