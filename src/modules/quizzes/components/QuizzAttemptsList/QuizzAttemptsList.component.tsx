import { Box } from '@mui/system'

import { Element } from '@core/models/element.model'

import { Attempt } from '@quizzes/models/attempt.model'
import { Quizz } from '@quizzes/models/quizz.model'

import { QuizzAttemptCard } from '../QuizzAttemptCard/QuizzAttemptCard.component'

interface Props {
  attempts?: Attempt[]
  quizz?: Element<Quizz>
}

export const QuizzAttemptsList = ({ attempts = [], quizz }: Props) => {
  return (
    <Box sx={{ mt: 3 }}>
      {attempts.map((attempt) => {
        return (
          <QuizzAttemptCard
            key={attempt?.id}
            attempt={attempt}
            quizz={quizz!}
          />
        )
      })}
    </Box>
  )
}
