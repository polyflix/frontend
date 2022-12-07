import { Element } from '@core/models/element.model'

import { Quizz } from '@quizzes/models/quizz.model'

// The different steps of our play quizz system
export enum Step {
  Onboard,
  Questions,
  Recap,
  End,
}

export interface QuizzAnswers {
  [questionId: string]: string[]
}

export interface PlayComponentProps {
  quizz: Element<Quizz>
}
