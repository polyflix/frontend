import { ContentModel } from '@core/models/content.model'
import { PresignedURL } from '@core/models/presigned-url.model'

import { Attachment } from './attachment.model'

export interface Video extends ContentModel {
  source: string
  description: string
  title: string
  publisherId: string
  views: number
  likes: number
  slug: string
  thumbnail: string
  videoPutPsu?: PresignedURL
  thumbnailPutPsu?: PresignedURL
  attachments: Attachment[]
  //   sourceType: VideoSource
  //   publishedBy: IPublisher | null
  //   userMeta: IWatchMetadata | undefined
  //   availableLanguages: SubtitleLanguages[]
  //   tags: Tag[]
}
