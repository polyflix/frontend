import { Visibility } from '@types_/resources/content.type'

import { Question } from '@types_/resources/quizz.type'

import { User } from '@types_/user.type'

export interface IQuizzForm {
  name: string
  draft: boolean
  visibility: Visibility
  allowedRetries: number
  keepHighestScore: boolean
  questions: Question[]
  user: User
}
