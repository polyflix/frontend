import { BaseModel } from '@core/models/base.model'

export interface Link extends BaseModel {
  url: string
}

export type ElementType = 'video' | 'quizze' | 'link'
