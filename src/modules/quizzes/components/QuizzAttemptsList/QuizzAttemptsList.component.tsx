import { Box } from '@mui/system'

import { Attempt } from '@quizzes/models/attempt.model'
import { Quizz } from '@quizzes/models/quizz.model'

import { QuizzAttemptCard } from '../QuizzAttemptCard/QuizzAttemptCard.component'

type Props = {
  attempts?: Attempt[]
  quizz?: Quizz
}

export const QuizzAttemptsList = ({ attempts, quizz }: Props) => {
  const data = attempts || []
  return (
    <Box sx={{ mt: 3 }}>
      {data.map((attempt) => {
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
