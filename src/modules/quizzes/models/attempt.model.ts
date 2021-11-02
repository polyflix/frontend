import { BaseModel } from '@core/models/base.model'

import { QuizzAnswers } from '@quizzes/types/play.type'

import { User } from '@users/models/user.model'

export interface Attempt extends BaseModel {
  score: number
  answers: QuizzAnswers
  user?: Partial<User>
}
