import { BaseModel } from '@core/models/base.model'

export interface Password extends BaseModel {
  name: string
  expiresAt: Date
  password?: string
}
