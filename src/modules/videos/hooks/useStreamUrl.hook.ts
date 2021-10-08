import { useInjection } from '@polyflix/di'
import { useEffect, useState } from 'react'

import { useAuth } from '../../authentication'
import { MinioService } from '../../upload/services/minio.service'
import { Video } from '../models'
import { VideoSource } from '../types'

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
  srcRaw,
  srcType,
  src,
  id,
}: Video): StreamUrlHookType => {
  const minioService = useInjection<MinioService>(MinioService)
  const { isLoading: authLoading } = useAuth()
  const [loading, setLoading] = useState<boolean>(true)
  const [streamUrl, setStreamUrl] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()

  /*
   * Fetch a Presigned Url for a video
   */
  useEffect(() => {
    if (authLoading || streamUrl) return
    if (srcType === VideoSource.YOUTUBE || srcType === VideoSource.UNKNOWN) {
      setStreamUrl(src)
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
  }, [authLoading, id, loading, streamUrl, minioService, srcType, src, srcRaw])
  return { streamUrl, error, loading }
}
