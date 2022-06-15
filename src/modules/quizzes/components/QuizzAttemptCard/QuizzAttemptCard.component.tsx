import { alpha, Card, Typography, useTheme } from '@mui/material'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { Element } from '@core/models/element.model'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { getFeedbackColor, percentage } from '@quizzes/helpers/score.helper'
import { Attempt } from '@quizzes/models/attempt.model'
import { Quizz } from '@quizzes/models/quizz.model'

interface Props {
  attempt: Attempt
  quizz: Element<Quizz>
}

export const QuizzAttemptCard = ({ attempt, quizz }: Props) => {
  const theme = useTheme()
  const { t } = useTranslation('quizzes')
  const { user } = useAuth()

  const color = getFeedbackColor(
    percentage(attempt.score, quizz.data.questions_count || 0),
    theme
  )
  const isMe = user?.id === attempt.user?.id

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        p: 2,
        border: `1px solid ${color}`,
        backgroundColor: alpha(color, 0.1),
      }}
    >
      <Typography variant="body1">
        {t(`history.attempt.date.text.${isMe ? 'me' : 'user'}`, {
          user: `${attempt.user?.firstName} ${attempt.user?.lastName}`,
        })}{' '}
        <strong>
          {attempt.score.toFixed(2)}/{quizz.data.questions_count || 0}
        </strong>{' '}
        {dayjs(attempt.createdAt).format(t('history.attempt.date.format'))}.
      </Typography>
    </Card>
  )
}
