import { Box } from '@mui/system'

import { Attempt } from '@quizzes/models/attempt.model'
import { Quizz } from '@quizzes/models/quizz.model'

import { QuizzAttemptCard } from '../QuizzAttemptCard/QuizzAttemptCard.component'

interface Props {
  attempts?: Attempt[]
  quizz?: Quizz
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
