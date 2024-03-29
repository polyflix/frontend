import { Link, Paper, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useParams } from 'react-router-dom'

import { Page } from '@core/components/Page/Page.component'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { End } from '@quizzes/components/Play/End.component'
import { Onboard } from '@quizzes/components/Play/Onboard.component'
import { Questions } from '@quizzes/components/Play/Questions.component'
import { Recap } from '@quizzes/components/Play/Recap.component'
import { usePlayQuizz } from '@quizzes/hooks/usePlayQuizz.hook'
import { useGetAttemptsQuery } from '@services/resources/attempt.service'
import { useGetQuizzQuery } from '@services/resources/quizz.service'
import { QuizzAttemptFilters, QuizzFilters } from '@quizzes/types/filters.type'
import { PlayComponentProps, Step } from '@types_/resources/quizz.type'

export const PlayQuizzPage = () => {
  const { t } = useTranslation('quizzes', { keyPrefix: 'play' })
  const { id } = useParams<{ id: string }>()
  const { step } = usePlayQuizz()
  const { user } = useAuth()

  // We have to memoize our filters
  // to avoid multiple requests on error
  // This behavior will be fixed in the 1.7 of RTK.
  // see : https://github.com/reduxjs/redux-toolkit/issues/1526
  const quizzfilters = useMemo<QuizzFilters>(
    () => ({
      draft: false,
    }),
    []
  )
  // Same as above
  const attemptsFilters = useMemo<QuizzAttemptFilters>(
    () => ({
      userId: user!.id,
    }),
    []
  )

  const {
    data,
    isLoading,
    error: quizzError,
  } = useGetQuizzQuery({
    id,
    filters: quizzfilters,
  })

  const {
    data: userAttempts,
    isLoading: isAttemptsLoading,
    error: attemptsError,
  } = useGetAttemptsQuery({ id, filters: attemptsFilters })

  // handle errors
  const error: any = quizzError || attemptsError

  // Is the user has remaining attempts for this quizz ?
  const hasRemainingAttempts =
    (data?.data.allowedRetries || 1) - (userAttempts?.total || 0) > 0
  const commonProps: PlayComponentProps = { quizz: data! }
  return (
    <Page
      error={error}
      title={data?.name}
      isLoading={isLoading || isAttemptsLoading}
    >
      {hasRemainingAttempts || step === Step.End ? (
        <>
          {step === Step.Onboard && <Onboard {...commonProps} />}
          {step === Step.Questions && <Questions {...commonProps} />}
          {step === Step.Recap && <Recap {...commonProps} />}
          {step === Step.End && <End {...commonProps} />}
        </>
      ) : (
        <>
          <Paper variant="outlined" sx={{ p: 4 }}>
            <Stack alignItems="center" justifyContent="center" spacing={2}>
              <Typography variant="h4">{t('noAttempts.title')}</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {t('noAttempts.description')}
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
              >
                <Link
                  component={RouterLink}
                  to="/quizzes/explore"
                  underline="hover"
                >
                  {t('results.actions.back-to-list')}
                </Link>
              </Stack>
            </Stack>
          </Paper>
        </>
      )}
    </Page>
  )
}
