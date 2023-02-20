import { User } from '@types_/user.type'

import { BaseModel } from '@types_/resources/base.type'
import { ContentModel } from '@types_/resources/content.type'

export type ElementType = 'video' | 'quizz' | 'link'

export interface Element<T extends BaseModel> extends ContentModel {
  type: ElementType
  name: string
  description?: string // TODO: remove
  user?: Partial<User>
  slug: string // TODO: remove
  thumbnail?: string // TODO: remove
  data: T
}
