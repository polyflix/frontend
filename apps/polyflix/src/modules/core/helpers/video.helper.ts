import { Video } from '@videos/models/video.model'

export const videoSlugLink = (video: Video): string => `/videos/${video?.slug}`

export const getShortDescription = (video: Video): string => {
  const description = video?.description
  if (!description) return ''
  return description.length > 100
    ? `${description.substring(0, 100)}...`
    : description
}
