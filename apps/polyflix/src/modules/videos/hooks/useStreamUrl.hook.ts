import { useEffect, useState } from 'react'

import { useInjection } from '@polyflix/di'

import { MinioService } from '@services/minio.service'

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
  slug,
}: Video): StreamUrlHookType => {
  const minioService = useInjection<MinioService>(MinioService)
  const { isLoading: authLoading } = useAuth()
  const [loading, setLoading] = useState<boolean>(true)
  const [streamUrl, setStreamUrl] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()

  const getPresignedUrl = async (s: string) => {
    try {
      const { tokenAccess } = await minioService.getVideoPresignedUrl(s)
      setStreamUrl(tokenAccess)
    } catch (e: any) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fetch a Presigned Url for a video
   */
  useEffect(() => {
    if (authLoading || streamUrl) return

    if (
      sourceType === PlayerVideoSource.YOUTUBE ||
      sourceType === PlayerVideoSource.UNKNOWN
    ) {
      setStreamUrl(sourceRaw)
      setLoading(false)
      return
    }

    getPresignedUrl(slug)
  }, [authLoading])
  return { streamUrl, error, loading }
}
