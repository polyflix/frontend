import { Alert, Button, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { usePlayQuizz } from '@quizzes/hooks/usePlayQuizz.hook'
import { PlayComponentProps, Step } from '@quizzes/types/play.type'

// This component should be displayed to the user before start the quizz.
export const Onboard = ({ quizz }: PlayComponentProps) => {
  const { setStep } = usePlayQuizz()
  const { t } = useTranslation('quizzes', { keyPrefix: 'play' })

  return (
    <Paper sx={{ p: 4 }} variant="outlined">
      <Stack spacing={2}>
        <Typography variant="h4">{t('onboarding.title')}</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {t('onboarding.description.head', { quizzName: quizz.name })}
          <br />
          <br />
          {t('onboarding.description.explanations', {
            questions: quizz.questions?.length,
          })}
          <br />
          <br />
          {t('onboarding.description.score')}
          <br />
          <br />
          {t('onboarding.description.limit', { retries: quizz.allowedRetries })}
          <br />
        </Typography>
        <Alert severity="warning">{t('onboarding.warning')}</Alert>
        <Button onClick={() => setStep(Step.Questions)} variant="contained">
          Go !
        </Button>
      </Stack>
    </Paper>
  )
}
