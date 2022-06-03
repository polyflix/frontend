import { ContentModel } from '@core/models/content.model'

import { Collection } from '@collections/models/collection.model'

import { User } from '@users/models/user.model'

export interface Course extends ContentModel {
  name: string
  slug: string
  description: string
  content: string
  user?: Partial<User>
  modules?: Collection[]
}
