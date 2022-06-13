import { Video } from '@videos/models/video.model'

export const videoSlugLink = (video: Video): string => `/videos/${video?.slug}`
