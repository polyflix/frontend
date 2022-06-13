import { environment } from '@env/environment'
import { isUndefined } from 'lodash'

import { VideoCardThumbnail } from '@videos/components/VideoCard/VideoCard.style'

type VideoSearchThumbnailProps = {
  thumbnailUrl?: string
}

/**
 * Tell whether if it's an URL or not; if truthy then it's youtube, else minio
 */
const thumbnailRegex =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi

const isYoutubeUrl = (url: string) => thumbnailRegex.test(url)
const buildMinioImageUrl = (url: string) =>
  `${environment.minioUrl}/images/${url}`

export const VideoSearchThumbnail: React.FC<VideoSearchThumbnailProps> = ({
  thumbnailUrl,
}: VideoSearchThumbnailProps) => {
  if (isUndefined(thumbnailUrl) || !thumbnailRegex) {
    return <VideoCardThumbnail src="/images/dumb_thumbnail.jpg" />
  }

  const url = isYoutubeUrl(thumbnailUrl)
    ? thumbnailUrl
    : buildMinioImageUrl(thumbnailUrl)

  return (
    <VideoCardThumbnail
      loading="lazy"
      src={url}
      onError={(e: any) => {
        e.target.src = '/images/dumb_thumbnail.jpg'
        e.preventDefault()
        e.onerror = null
      }}
      alt={`Thumbnail`}
    />
  )
}
