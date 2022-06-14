import { LoadingButton } from '@mui/lab'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { Icon } from '@core/components/Icon/Icon.component'
import { SnackbarService } from '@core/services/snackbar.service'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { usePlayQuizz } from '@quizzes/hooks/usePlayQuizz.hook'
import { useSubmitAttemptMutation } from '@quizzes/services/attempt.service'
import { PlayComponentProps, Step } from '@quizzes/types/play.type'

// This component should be displayed to the user when the quizz step is Recap
export const Recap = ({ quizz }: PlayComponentProps) => {
  const { t } = useTranslation('quizzes', { keyPrefix: 'play' })

  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const { answers, setQuestion, setStep, setAttempt } = usePlayQuizz()

  const { user } = useAuth()

  // get the mutation
  const [submit, { isLoading }] = useSubmitAttemptMutation()

  /**
   * Called when the user validate the attempt
   */
  const handleSubmit = async () => {
    try {
      const attempt = await submit({
        id: quizz.id,
        answers,
        user: user!!,
      }).unwrap()
      setStep(Step.End)
      setAttempt(attempt)
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 4 }} variant="outlined">
        <Typography variant="h4">{t('recap.title')}</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
          {t('recap.description')}
        </Typography>
      </Paper>

      {(quizz.data.questions || []).map((question, idx) => {
        return (
          <Paper sx={{ p: 4 }} variant="outlined" key={idx}>
            <Typography variant="h6">
              {idx + 1}. {question.label}
            </Typography>
            <Stack sx={{ mt: 2 }} spacing={1}>
              {(question.alternatives || []).map(({ label, id }, altIdx) => {
                const isSelected = (answers[question.id] || []).includes(id)
                return (
                  <Stack
                    sx={{ color: 'primary.main' }}
                    direction="row"
                    alignItems="center"
                    key={altIdx}
                  >
                    {isSelected && (
                      <Icon size={18} name="fluent:target-arrow-16-filled" />
                    )}
                    <Typography
                      sx={{
                        ml: 1,
                        color: isSelected ? 'text.primary' : 'action.disabled',
                      }}
                    >
                      {label}{' '}
                      {isSelected && (
                        <Typography
                          sx={{
                            ml: 1,
                            fontSize: '0.8rem',
                            display: 'inline-block',
                            color: 'action.disabled',
                          }}
                        >
                          {t('recap.selected')}
                        </Typography>
                      )}
                    </Typography>
                  </Stack>
                )
              })}
            </Stack>

            <Button
              sx={{ mt: 2 }}
              size="small"
              variant="outlined"
              onClick={() => {
                setQuestion(idx)
                setStep(Step.Questions)
              }}
            >
              {t('recap.updateAnswers')}
            </Button>
          </Paper>
        )
      })}

      <Paper variant="outlined" sx={{ p: 4 }}>
        <Typography>{t('recap.validationMessage')}</Typography>
        <LoadingButton
          sx={{ mt: 2 }}
          loading={isLoading}
          variant="contained"
          onClick={handleSubmit}
        >
          {t('recap.validate')}
        </LoadingButton>
      </Paper>
    </Stack>
  )
}
