import { ContentModel } from '@types_/resources/content.type'

import { Collection } from '@collections/models/collection.model'

import { User } from '@types_/user.type'

export interface Course extends ContentModel {
  name: string
  slug: string
  description: string
  content: string
  user?: Partial<User> & Pick<User, 'firstName'> & Pick<User, 'lastName'>
  modules?: Collection[]
}
