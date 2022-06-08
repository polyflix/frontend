import { Visibility } from '@core/models/content.model'

import { Attachment } from '@videos/models/attachment.model'

export interface IVideoForm {
  hasSubtitle: boolean
  title: string
  description: string
  thumbnail?: string
  draft: boolean
  visibility: Visibility
  source?: string
  attachments: Attachment[]
  // TODO
  // tags: tagLite[]
}

export interface INoteForm {
  content: string
}
