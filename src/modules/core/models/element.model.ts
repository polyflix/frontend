import { ElementType } from '@core/types/element.type'

import { User } from '@users/models/user.model'

import { BaseModel } from './base.model'
import { ContentModel } from './content.model'

export interface Element<T extends BaseModel> extends ContentModel {
  type: ElementType
  name: string
  description?: string
  user?: Partial<User>
  slug: string
  thumbnail?: string
  data: T
}
