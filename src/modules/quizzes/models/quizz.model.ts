import { ContentModel } from '@core/models/content.model'

import { User } from '@users/models/user.model'

import { Attempt } from './attempt.model'
import { Question } from './question.model'

export interface Quizz extends ContentModel {
  allowedRetries: number
  name: string
  keepHighestScore: boolean
  questions?: Question[]
  attempts?: Attempt[]
  user?: Partial<User>
}
