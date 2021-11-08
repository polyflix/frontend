import { ContentModel } from '@core/models/content.model'
import { Element } from '@core/models/element.model'
import { Link } from '@core/types/element.type'

import { Quizz } from '@quizzes/models/quizz.model'

import { Video } from '@videos/models/video.model'

import { User } from '@users/models/user.model'

export interface Collection extends ContentModel {
  description: string
  name: string
  user?: Partial<User>
  slug: string
  elements: Element<Link | Video | Quizz>[]

  // passwords: AccessPassword[]
  // tags: Tag[]
}
