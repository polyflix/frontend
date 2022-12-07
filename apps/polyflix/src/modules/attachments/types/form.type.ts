import { AttachmentType } from '@attachments/models/attachment.model'

export interface IAttachmentForm {
  title: string
  description?: string
  userId: string
  type: AttachmentType
  url?: string
  extension?: string
}
