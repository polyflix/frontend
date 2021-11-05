import { WatchMetadata } from '@stats/models/userMeta.model'
import { SubtitleLanguages } from '@subtitles/types/subtitle.type'

import { ContentModel } from '@core/models/content.model'
import { PresignedURL } from '@core/models/presigned-url.model'

import { PlayerVideoSource } from '@videos/types/video.type'

import { User } from '@users/models/user.model'

import { Attachment } from './attachment.model'

export interface Video extends ContentModel {
  source: string
  description: string
  title: string
  publisherId: string
  publishedBy?: User
  views: number
  likes: number
  slug: string
  thumbnail: string
  videoPutPsu?: PresignedURL
  thumbnailPutPsu?: PresignedURL
  attachments: Attachment[]
  sourceType: PlayerVideoSource
  availableLanguages: SubtitleLanguages[]
  userMeta?: WatchMetadata | undefined
  //   tags: Tag[]
}
