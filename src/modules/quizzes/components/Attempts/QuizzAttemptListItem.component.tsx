import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { useTranslation } from 'react-i18next'

import { cn } from '../../../common'
import { Typography } from '../../../ui'
import { Attempt } from '../../models/attempt.model'
import { Quizz } from '../../models/quizz.model'
import { asPercentage, getColor } from '../../util/quizz.util'

type Props = {
  attempt: Attempt
  isLast: boolean
  quizz: Quizz
  isLoggedUser?: boolean
}

export const QuizzAttemptListItem = ({
  attempt,
  isLast,
  quizz,
  isLoggedUser = true,
}: Props) => {
  const { t } = useTranslation('resources')
  const color = getColor(asPercentage(attempt.score, quizz.questions.length))
  return (
    <div
      className={cn(
        !isLast && 'mb-4',
        'bg-darkgray rounded-md px-8 py-4 flex items-center'
      )}
      key={attempt.id}
    >
      <div className="w-full">
        <Typography as="span" className="text-sm md:text-base">
          {t(
            `quizzes.history.attempt.date.text.${isLoggedUser ? 'me' : 'user'}`,
            { user: attempt.user?.displayName }
          )}{' '}
          {attempt.createdAt.format(t('quizzes.history.attempt.date.format'))}
        </Typography>
      </div>
      <div className="flex-shrink-0">
        <CircularProgressbar
          className="w-16 fill-current"
          value={attempt.score}
          maxValue={quizz.questions.length}
          text={`${attempt.score}/${quizz.questions.length}`}
          styles={buildStyles({
            trailColor: '#949495',
            pathColor: color,
            textColor: color,
          })}
        />
      </div>
    </div>
  )
}
