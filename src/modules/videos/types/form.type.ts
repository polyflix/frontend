import { Visibility } from '@core/models/content.model'

export interface IVideoForm {
  hasSubtitle: boolean
  title: string
  description: string
  thumbnail: string
  draft: boolean
  visibility: Visibility
  src: string
  //   tags: tagLite[]
  //   attachments: Attachment[]
}
