import { ContentModel } from '@types_/resources/content.type'
import { Element } from '@types_/resources/element.type'

import { Quizz } from '@quizzes/models/quizz.model'

import { Video } from '@videos/models/video.model'

import { Link } from '@links/models/link.model'

import { User } from '@types_/user.type'

import { Password } from './password.model'

export interface Collection extends ContentModel {
  description: string
  name: string
  user?: Partial<User>
  slug: string
  elements: Element<Link | Video | Quizz>[]
  passwords: Password[]
}
