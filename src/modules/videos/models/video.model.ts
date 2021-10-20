import { ContentModel } from '@core/models/content.model'

export interface Video extends ContentModel {
  source: string
  description: string
  title: string
  publisherId: string
  views: number
  likes: number
  slug: string
  thumbnail: string
  //   sourceType: VideoSource
  //   publishedBy: IPublisher | null
  //   userMeta: IWatchMetadata | undefined
  //   availableLanguages: SubtitleLanguages[]
  //   tags: Tag[]
  //   attachments: IAttachment[]
}
