import { alpha, Card, Typography, useTheme } from '@mui/material'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { getFeedbackColor, percentage } from '@quizzes/helpers/score.helper'
import { Attempt } from '@quizzes/models/attempt.model'
import { Quizz } from '@quizzes/models/quizz.model'

interface Props {
  attempt: Attempt
  quizz: Quizz
}

export const QuizzAttemptCard = ({ attempt, quizz }: Props) => {
  const theme = useTheme()
  const { user } = useAuth()
  const { t } = useTranslation('quizzes')

  const color = getFeedbackColor(
    percentage(attempt.score, (quizz.questions || []).length),
    theme
  )

  const isMe = user?.id === attempt.user?.id

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        border: `1px solid ${color}`,
        backgroundColor: alpha(color, 0.1),
      }}
    >
      <Typography variant="body1">
        {t(`history.attempt.date.text.${isMe ? 'me' : 'user'}`, {
          user: user?.displayName,
        })}{' '}
        <strong>
          {attempt.score}/{(quizz.questions || []).length}
        </strong>{' '}
        {dayjs(attempt.createdAt).format(t('history.attempt.date.format'))}.
      </Typography>
    </Card>
  )
}
