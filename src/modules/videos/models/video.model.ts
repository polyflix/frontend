import { WatchMetadata, Watchtime } from '@stats/models/userMeta.model'
import { SubtitleLanguages } from '@subtitles/types/subtitle.type'

import { Visibility } from '@core/models/content.model'
import { PresignedURL } from '@core/models/presigned-url.model'

import { PlayerVideoSource } from '@videos/types/video.type'

import { Attachment } from './attachment.model'

export interface Video {
  slug: string
  title: string
  description: string
  thumbnail: string
  publisher?: {
    id: string
    avatar: string
    firstName: string
    lastName: string
  }
  likes: number
  views: number
  sourceType: PlayerVideoSource
  source: string
  visibility?: Visibility
  draft?: boolean
  createdAt?: string
  updatedAt?: string

  videoPutPsu?: PresignedURL
  thumbnailPutPsu?: PresignedURL

  // TODO
  // tags?: Tag[];
  userMeta?: WatchMetadata | undefined
  attachments: Attachment[]
  watchtime?: Watchtime | undefined
  isLiked?: boolean
  availableLanguages: SubtitleLanguages[]
}
