import { BaseModel } from '@core/models/base.model'

export interface Alternative extends BaseModel {
  isCorrect: boolean
  label: string
}
