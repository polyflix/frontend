import { Visibility } from '@core/models/content.model'

import { Question } from '@quizzes/models/question.model'

export interface IQuizzForm {
  name: string
  draft: boolean
  visibility: Visibility
  allowedRetries: number
  keepHighestScore: boolean
  questions: Question[]
}
