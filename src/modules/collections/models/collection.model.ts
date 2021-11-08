import { ContentModel } from '@core/models/content.model'
import { Element } from '@core/models/element.model'

import { Quizz } from '@quizzes/models/quizz.model'

import { Video } from '@videos/models/video.model'

import { Link } from '@links/models/link.model'

import { User } from '@users/models/user.model'

import { Password } from './password.model'

export interface Collection extends ContentModel {
  description: string
  name: string
  user?: Partial<User>
  slug: string
  elements: Element<Link | Video | Quizz>[]
  passwords: Password[]
}
