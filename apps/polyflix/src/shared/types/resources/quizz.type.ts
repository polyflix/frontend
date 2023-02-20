import { ContentModel } from '@types_/resources/content.type'
import { BaseModel } from '@types_/resources/base.type'
import { User } from '@types_/user.type'

export interface Quizz extends ContentModel {
  allowedRetries: number
  keepHighestScore: boolean
  questions?: Question[]
  attempts?: Attempt[]
  questions_count?: number
}

export interface Attempt extends BaseModel {
  score: number
  answers: QuizzAnswers
  user?: Partial<User>
}

export interface Question extends BaseModel {
  index: number
  label: string
  alternatives?: Alternative[]
}

export interface Alternative extends BaseModel {
  isCorrect: boolean
  label: string
}

export interface QuizzAnswers {
  [questionId: string]: string[]
}

export enum Step {
  Onboard,
  Questions,
  Recap,
  End,
}
