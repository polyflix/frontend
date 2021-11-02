import { useContext } from 'react'

import {
  IPlayQuizzContext,
  PlayQuizzContext,
} from '@quizzes/contexts/Play.context'

export const usePlayQuizz = (): IPlayQuizzContext => {
  const context = useContext<IPlayQuizzContext | undefined>(PlayQuizzContext)
  if (!context) {
    throw new Error(
      'Missing provider. usePlayQuizz can only be used inside PlayQuizzProvider.'
    )
  }
  return context
}
