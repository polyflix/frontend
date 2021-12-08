import { Box, Link, Paper, Stack, Typography, useTheme } from '@mui/material'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { getFeedbackColor, percentage } from '@quizzes/helpers/score.helper'
import { usePlayQuizz } from '@quizzes/hooks/usePlayQuizz.hook'
import { PlayComponentProps } from '@quizzes/types/play.type'

// This component should be displayed to the user when it has successfully submitted his attempt.
export const End = ({ quizz }: PlayComponentProps) => {
  const { t } = useTranslation('quizzes', { keyPrefix: 'play' })
  const { attempt } = usePlayQuizz()
  const theme = useTheme()

  const getMessage = (scorePercentage: number) => {
    if (scorePercentage >= 75) {
      return t('results.title.excellent')
    } else if (scorePercentage >= 25 && scorePercentage < 75) {
      return t('results.title.good')
    }
    return t('results.title.disappointing')
  }

  const questions = quizz.data.questions || []
  const score = attempt?.score || 0
  const scorePercentage = percentage(score, questions.length)
  const color = getFeedbackColor(scorePercentage, theme)

  return (
    <Paper sx={{ p: 4 }} variant="outlined">
      <Stack spacing={2} justifyContent="center" alignItems="center">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ width: '140px', textAlign: 'center' }}
        >
          <CircularProgressbar
            value={score}
            maxValue={questions.length}
            text={`${score.toFixed(2)}/${questions.length}`}
            styles={buildStyles({
              trailColor: theme.palette.divider,
              pathColor: color,
              textColor: color,
            })}
          />
        </Box>
        <Typography variant="h3" className="my-8">
          {getMessage(scorePercentage)}
        </Typography>
        <Typography
          textAlign="center"
          variant="body1"
          sx={{ color: 'text.secondary' }}
        >
          {t('results.description')}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Link component={RouterLink} to="/quizzes/explore" underline="hover">
            {t('results.actions.back-to-list')}
          </Link>
        </Stack>
      </Stack>
    </Paper>
  )
}
