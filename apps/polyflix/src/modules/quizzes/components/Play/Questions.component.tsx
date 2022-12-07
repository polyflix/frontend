import { Button, Grid, Paper, Stack, Typography } from '@mui/material'
import { shuffle } from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { usePlayQuizz } from '@quizzes/hooks/usePlayQuizz.hook'
import { PlayComponentProps, Step } from '@quizzes/types/play.type'

import { QuestionPaginationItem } from './Play.style'

// This component should be displayed to the user when the quizz is started
export const Questions = ({ quizz }: PlayComponentProps) => {
  const { t } = useTranslation('quizzes', { keyPrefix: 'play' })
  const { questionIdx, answers, setQuestion, setAnswer, setStep } =
    usePlayQuizz()

  const buildQuestionPagination = (isAnswered: boolean) =>
    (quizz.data.questions || []).map((_0, index) => {
      const isActive = index === questionIdx
      return (
        <Grid item md={6} lg={4} xl={3} key={index}>
          <QuestionPaginationItem
            onClick={() => index !== questionIdx && setQuestion(index)}
            isActive={isActive}
            isAnswered={isAnswered}
          >
            {index + 1}
          </QuestionPaginationItem>
        </Grid>
      )
    })
  const question = quizz.data.questions![questionIdx]
  const isAnswered = (answers[question.id] || []).length > 0

  // Memoize the alternatives to avoid new shuffle when user select answers
  const alternatives = useMemo(
    () => shuffle(question.alternatives || []),
    [question]
  )

  const isFirstQuestion = questionIdx === 0
  const isLastQuestion = questionIdx === (quizz.data.questions || []).length - 1

  return (
    <Grid container spacing={2}>
      <Grid xs={12} md={2} item>
        <Paper sx={{ p: 1 }} variant="outlined">
          <Grid container spacing={1} align="center">
            {buildQuestionPagination(isAnswered)}
          </Grid>
        </Paper>
      </Grid>
      <Grid xs={12} md={10} item>
        <Stack spacing={2}>
          <Paper sx={{ p: 3 }} variant="outlined">
            <Stack spacing={2}>
              <Typography variant="h4">Question n°{questionIdx + 1}</Typography>
              <Typography>{question.label}</Typography>
              <Grid
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gap={2}
              >
                {alternatives.map((alternative) => {
                  // check if the actual alternative was selected previously
                  const isSelected = (answers[question.id] || []).includes(
                    alternative.id
                  )

                  return (
                    <Grid
                      key={alternative.id}
                      gridColumn={{ md: 'span 6', xs: 'span 12' }}
                    >
                      <Button
                        onClick={() => setAnswer(question.id, alternative.id)}
                        fullWidth
                        variant={isSelected ? 'contained' : 'outlined'}
                        sx={{ p: 3 }}
                      >
                        {alternative.label}
                      </Button>
                    </Grid>
                  )
                })}
              </Grid>
            </Stack>
          </Paper>
          <Paper sx={{ p: 3 }} variant="outlined">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button
                onClick={() => setQuestion(questionIdx - 1)}
                disabled={isFirstQuestion}
                variant="outlined"
              >
                {t('questions.previous')}
              </Button>
              <Button
                onClick={() =>
                  isLastQuestion
                    ? setStep(Step.Recap)
                    : setQuestion(questionIdx + 1)
                }
                variant="outlined"
                disabled={!isAnswered}
              >
                {isLastQuestion
                  ? t('questions.terminate')
                  : t('questions.next')}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Grid>
    </Grid>
  )
}
