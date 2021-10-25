import { BaseModel } from '@core/models/base.model'

export interface Attachment extends BaseModel {
  label: string
  url: string
}
