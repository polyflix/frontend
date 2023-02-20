import { ContentModel } from '@types_/resources/content.type'
import { Element } from '@types_/resources/element.type'
import { Link } from '@types_/element.type'

import { Quizz } from '@quizzes/models/quizz.model'

import { Video } from '@videos/models/video.model'

import { Password } from '@collections/models/password.model'

import { User } from '@types_/user.type'

export interface ICollectionForm extends ContentModel {
  description: string
  name: string
  user?: Partial<User>
  slug: string
  elements: Element<Link | Video | Quizz>[]
  passwords: Password[]
}
