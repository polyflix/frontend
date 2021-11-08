import { ContentModel } from '@core/models/content.model'

import { Attempt } from './attempt.model'
import { Question } from './question.model'

export interface Quizz extends ContentModel {
  allowedRetries: number
  keepHighestScore: boolean
  questions?: Question[]
  attempts?: Attempt[]
}
