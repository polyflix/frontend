import { ContentModel } from '@core/models/content.model'

import { Course } from '@courses/models/course.model'

import { User } from '@users/models/user.model'

export interface Cursus extends ContentModel {
  title: string
  slug: string
  description: string
  user?: Partial<User>
  courses?: Course[]
}
