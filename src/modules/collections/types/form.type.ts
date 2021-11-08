import { ContentModel } from '@core/models/content.model'
import { Element } from '@core/models/element.model'
import { Link } from '@core/types/element.type'

import { Video } from '@videos/models/video.model'

import { Password } from '@collections/models/password.model'

import { User } from '@users/models/user.model'

export interface ICollectionForm extends ContentModel {
  description: string
  name: string
  user?: Partial<User>
  slug: string
  elements: Element<Link | Video>[]
  passwords: Password[]
}
