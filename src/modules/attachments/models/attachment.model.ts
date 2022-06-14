export enum AttachmentStatus {
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
}

export enum AttachmentType {
  External = 'EXTERNAL',
  Internal = 'Internal',
}

export interface Attachment {
  id: string
  title: string
  description?: string
  userId: string
  status: AttachmentStatus
  type: AttachmentType
  videos: string[]
  modules: string[]
  /**
   * PSU generated to read
   */
  url: string
  /**
   * Extension de file if internal
   */
  extension?: string
}

export interface PaginatedAttachments {
  items: Attachment[]
  totalCount: number
}
