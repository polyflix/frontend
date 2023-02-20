import { WatchMetadata, Watchtime } from '@stats/models/userMeta.model'
import { SubtitleLanguages } from '@subtitles/types/subtitle.type'

import { Visibility } from '@types_/resources/content.type'

import { PlayerVideoSource } from '@videos/types/video.type'

import { Attachment } from '@attachments/models/attachment.model'

export interface Video {
  id: string
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

  videoPutPsu?: {
    tokenAccess: string
  }
  thumbnailPutPsu?: {
    tokenAccess: string
  }
  userMeta?: WatchMetadata | undefined
  attachments: Attachment[]
  watchtime?: Watchtime | undefined
  isLiked?: boolean
  availableLanguages: SubtitleLanguages[]
}
