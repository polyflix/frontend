import { isUndefined } from 'lodash'

import { VideoCardThumbnail } from '@videos/components/VideoCard/VideoCard.style'

type VideoSearchThumbnailProps = {
  thumbnailUrl: string
}

export const VideoSearchThumbnail: React.FC<VideoSearchThumbnailProps> = ({
  thumbnailUrl,
}: VideoSearchThumbnailProps) => {
  if (isUndefined(thumbnailUrl)) {
    return <VideoCardThumbnail src="/images/dumb_thumbnail.jpg" />
  }

  return (
    <VideoCardThumbnail
      loading="lazy"
      src={thumbnailUrl}
      onError={(e: any) => {
        e.target.src = '/images/dumb_thumbnail.jpg'
        e.preventDefault()
        e.onerror = null
      }}
      alt={`Thumbnail`}
    />
  )
}
