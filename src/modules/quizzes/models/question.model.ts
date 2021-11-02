import { BaseModel } from '@core/models/base.model'

import { Alternative } from './alternative.model'

export interface Question extends BaseModel {
  index: number
  label: string
  alternatives?: Alternative[]
}
