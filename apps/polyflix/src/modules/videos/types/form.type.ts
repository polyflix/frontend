import { Visibility } from '@types_/resources/content.type'

import { Attachment } from '@attachments/models/attachment.model'

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
