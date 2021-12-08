import { Box } from '@mui/system'

import { NoData } from '@core/components/NoData/NoData.component'
import { Element } from '@core/models/element.model'
import { buildSkeletons } from '@core/utils/gui.utils'

import { Attempt } from '@quizzes/models/attempt.model'
import { Quizz } from '@quizzes/models/quizz.model'

import { QuizzAttemptCard } from '../QuizzAttemptCard/QuizzAttemptCard.component'
import { QuizzCardSkeleton } from '../QuizzCardSkeleton/QuizzCardSkeleton.component'

interface Props {
  attempts?: Attempt[]
  quizz?: Element<Quizz>
  isQuizzFetching: boolean
  isAttemptsFetching: boolean
}

export const QuizzAttemptsList = ({
  attempts = [],
  quizz,
  isQuizzFetching,
  isAttemptsFetching,
}: Props) => {
  const skeletons = buildSkeletons(3)

  return (
    <Box sx={{ mt: 3 }}>
      {!isQuizzFetching && !isAttemptsFetching ? (
        attempts.length > 0 ? (
          attempts.map((attempt) => {
            return (
              <QuizzAttemptCard
                key={attempt?.id}
                attempt={attempt}
                quizz={quizz!}
              />
            )
          })
        ) : (
          <NoData creatable={false} />
        )
      ) : (
        skeletons.map((_, i: number) => (
          <Box sx={{ mb: 2 }} key={i}>
            <QuizzCardSkeleton />
          </Box>
        ))
      )}
    </Box>
  )
}
