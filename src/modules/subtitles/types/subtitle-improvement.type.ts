import { User } from '../../users'
import { Subtitle } from '../../videos'
import { SubtitleImprovementMeta } from '../models/subtitle-improvement-meta.model'

export enum SubtitleImprovementStatus {
  WAITING_REVIEW = 'WAITING_REVIEW',
  REVIEWED = 'REVIEWED',
}

export interface ISubtitleImprovement {
  id?: string
  subtitle: Subtitle
  comment: string
  timestamp: number
  likes?: number
  isApproved?: boolean
  createdBy?: User
  subtitleImprovementMeta?: SubtitleImprovementMeta
  createdAt?: Date
  updatedAt?: Date
  status?: SubtitleImprovementStatus
}
