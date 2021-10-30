import { useEffect, useState } from 'react'

import { useInjection } from '@polyflix/di'

import { MinioService } from '@core/services/minio.service'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { Video } from '@videos/models/video.model'
import { PlayerVideoSource } from '@videos/types/video.type'

/**
 * Type used to fetch the stream Url
 */
type StreamUrlHookType = {
  streamUrl?: string
  error?: string
  loading: boolean
}

/**
 * Inside hook in order to fetch a presigned URL for a video
 * @param {string} srcRaw -- Raw source of a video (youtube id, minio file path...)
 * @param {VideoSource} srcType -- KInd of video fetched (Youtube, internal...)
 * @param {src} src -- When youtube or unknown video, the streaming link can be formed instantly
 * @param {string} id -- Video ID
 */
export const useStreamUrl = ({
  sourceType,
  source: sourceRaw,
  id,
}: Video): StreamUrlHookType => {
  const minioService = useInjection<MinioService>(MinioService)
  const { isLoading: authLoading } = useAuth()
  const [loading, setLoading] = useState<boolean>(true)
  const [streamUrl, setStreamUrl] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()

  const source = (): string => {
    switch (sourceType) {
      case PlayerVideoSource.YOUTUBE:
        return `https://www.youtube-nocookie.com/embed/${sourceRaw}`
      default:
        return sourceRaw
    }
  }

  /*
   * Fetch a Presigned Url for a video
   */
  useEffect(() => {
    if (authLoading || streamUrl) return
    if (
      sourceType === PlayerVideoSource.YOUTUBE ||
      sourceType === PlayerVideoSource.UNKNOWN
    ) {
      setStreamUrl(source)
      setLoading(false)
      return
    }

    minioService
      .getVideoPresignedUrl(id)
      .then(({ tokenAccess }) => {
        setStreamUrl(tokenAccess)
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => setLoading(false))
  }, [authLoading, id, loading, streamUrl, minioService, sourceType, sourceRaw])
  return { streamUrl, error, loading }
}
