import { Video } from '@videos/models/video.model'

export enum ReportReason {
  NSFW_CONTENT = 'NSFW_CONTENT',
  VIOLENCE_BULLYING = 'VIOLENCE_BULLYING',
  DANGEROUS_ACT = 'DANGEROUS_ACT',
  SPAM = 'SPAM',
  CHILD_ABUSE = 'CHILD_ABUSE',
  OTHER = 'OTHER',
}

export enum ReportState {
  PENDING = 0,
  APPROVED = 1,
  REJECTED = -1,
}

export interface ReportModel {
  reason: ReportReason
  details: string
  userId?: string
  videoId?: string
  state?: ReportState
  __video__?: Video
}
