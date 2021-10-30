import { Subtitle } from '@subtitles/models/subtitle.model'
import { useCallback, useState, useEffect } from 'react'

import { useInjection } from '@polyflix/di'
import { VttFile } from '@polyflix/vtt-parser'

import { MinioService } from '@core/services/minio.service'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { Video } from '@videos/models/video.model'
import { PlayerVideoSource } from '@videos/types/video.type'

type UseSubtitlesProps = {
  subtitles?: Subtitle[]
  loading: boolean
}

export const useSubtitles = ({
  availableLanguages,
  id,
  sourceType,
}: Video): UseSubtitlesProps => {
  const minioService = useInjection<MinioService>(MinioService)
  const { isLoading: authLoading } = useAuth()
  const [loading, setLoading] = useState<boolean>(true)
  const [subtitles, setSubtitles] = useState<Subtitle[] | undefined>()

  const fetchSubtitles = useCallback(async () => {
    const fetchedSubtitles: Subtitle[] = []
    for (let i = 0; i < availableLanguages.length; i++) {
      const lang = availableLanguages[i]
      try {
        const { tokenAccess } = await minioService.getSubtitlePresignedUrl(
          id,
          lang
        )
        fetchedSubtitles.push({
          lang,
          vttUrl: tokenAccess,
          vttFile: await VttFile.fromUrl(tokenAccess),
        })
      } catch (e) {
        console.error('Failed to fetch subtitle ', lang)
        console.error(e)
      }
    }
    setLoading(false)
    setSubtitles(fetchedSubtitles)
  }, [minioService, availableLanguages, id])

  useEffect(() => {
    if (authLoading || subtitles) return
    if (
      sourceType !== PlayerVideoSource.INTERNAL ||
      availableLanguages.length === 0
    ) {
      setSubtitles([])
      setLoading(false)
      return
    }

    // Add .finally to avoid warning about unprocessed promise
    fetchSubtitles().finally()
  }, [
    authLoading,
    fetchSubtitles,
    subtitles,
    availableLanguages.length,
    sourceType,
  ])

  return {
    loading,
    subtitles,
  }
}
