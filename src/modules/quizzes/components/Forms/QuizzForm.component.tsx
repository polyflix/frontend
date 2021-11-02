import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  InputAdornment,
  Paper,
  Slider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import { useFieldArray, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { StatusSelector } from '@core/components/StatusSelector/StatusSelector.component'
import { VisibilitySelector } from '@core/components/VisibilitySelector/VisibilitySelector.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
  getMarks,
} from '@core/helpers/form.helper'
import { Visibility } from '@core/models/content.model'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'

import { Quizz } from '@quizzes/models/quizz.model'
import {
  useAddQuizzMutation,
  useUpdateQuizzMutation,
} from '@quizzes/services/quizz.service'

import { IQuizzForm } from '../../types/form.type'

interface Props {
  quizz?: Quizz
  i18nKey?: string
  isUpdate: boolean
}

export const QuizzForm = ({ quizz, isUpdate }: Props) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const { t } = useTranslation('quizzes')

  const history = useHistory()

  // Get our mutations
  const [createQuizz] = useAddQuizzMutation()
  const [updateQuizz] = useUpdateQuizzMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    control,
    setValue,
  } = useForm<IQuizzForm>({
    defaultValues: {
      visibility: quizz?.visibility || Visibility.PUBLIC,
      name: quizz?.name,
      allowedRetries: quizz?.allowedRetries || 1,
      draft: quizz?.draft,
      questions: quizz?.questions,
      keepHighestScore: quizz?.keepHighestScore || false,
    },
  })

  const { fields, append } = useFieldArray({
    control,
    name: 'questions',
  })

  /**
   * Validate if a quizz is well formed before sending it to the API.
   * @param quizz the quizz form to validate
   * @returns true if valid, false otherwise
   */
  const validate = (quizzData: IQuizzForm) => {
    return quizzData.questions.every((question, index) => {
      const isValid =
        question.alternatives!.length >= 2 &&
        question.alternatives!.some(({ isCorrect }) => isCorrect)

      if (!isValid) {
        snackbarService.createSnackbar(
          t('forms.create-update.errors.question.invalid', {
            index: index + 1,
          }),
          { variant: 'error' }
        )
      }

      return isValid
    })
  }

  // Called on form submission
  const onSubmit = async (data: IQuizzForm) => {
    const quizzData: IQuizzForm = {
      ...data,
      // Clean the empty alternatives from the data object
      questions: data.questions.map((question) => ({
        ...question,
        alternatives: question.alternatives?.filter(
          ({ label }) => label !== ''
        ),
      })),
    }

    if (!validate(quizzData)) return
    try {
      await (isUpdate
        ? updateQuizz({ id: quizz!.id || '', body: quizzData })
        : createQuizz(quizzData)
      ).unwrap()

      // Display the success snackbar
      snackbarService.notify(
        isUpdate ? CrudAction.UPDATE : CrudAction.CREATE,
        Endpoint.Quizzes
      )

      history.push('/quizzes/explore')
    } catch (e: any) {
      snackbarService.createSnackbar(e.data.statusText, { variant: 'error' })
    }
  }

  const quizzQuestions = quizz?.questions || []

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography sx={{ mb: 3 }} variant="h4">
        {t('forms.create-update.title.metadata')}
      </Typography>
      <Stack spacing={4}>
        <Stack direction="row" spacing={2}>
          <TextField
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            label={t('forms.create-update.placeholder.name')}
            {...getCommonTextFieldProps()}
            {...register('name', {
              required: {
                value: true,
                message: t('forms.create-update.validation.name.required'),
              },
            })}
          />

          {!isUpdate && (
            <ToggleButtonGroup
              size="large"
              onChange={(_, value) => {
                if (value !== null) {
                  setValue('keepHighestScore', value)
                }
              }}
              value={watch('keepHighestScore')}
              exclusive
            >
              <ToggleButton value={true}>
                {t('forms.create-update.placeholder.modes.max')}
              </ToggleButton>
              <ToggleButton value={false}>
                {t('forms.create-update.placeholder.modes.mean')}
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Stack>

        {!isUpdate && (
          <>
            <Typography sx={{ color: 'text.secondary' }}>
              {t('forms.create-update.placeholder.allowedRetries')}
            </Typography>

            <Slider
              defaultValue={watch('allowedRetries')}
              onChange={(e, value) =>
                setValue('allowedRetries', value as number)
              }
              step={1}
              marks={getMarks()}
              min={1}
              max={10}
            />
          </>
        )}

        <Divider />

        <Typography sx={{ mb: 3 }} variant="h4">
          Questions
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          <Trans
            i18nKey={`forms.create-update.description.questions.${
              isUpdate ? 'update' : 'create'
            }`}
            ns="quizzes"
            components={{
              bold: <strong />,
            }}
          />
        </Typography>

        {fields.length === 0 && (
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t('forms.create-update.placeholder.questions.empty')}
          </Typography>
        )}

        {fields.map((item, index) => {
          setValue(`questions.${index}.index`, index)
          const questionAlternatives = quizzQuestions[index]
            ? quizzQuestions[index].alternatives || []
            : []

          const questionErrors = errors.questions && errors.questions[index]
          return (
            <Paper sx={{ p: 3 }} key={index} variant="outlined">
              <Stack spacing={2}>
                <TextField
                  error={Boolean(questionErrors?.label)}
                  helperText={questionErrors?.label?.message}
                  label="Question"
                  {...getCommonTextFieldProps()}
                  {...register(`questions.${index}.label` as const, {
                    required: {
                      value: true,
                      message: t(
                        'forms.create-update.validation.question.required'
                      ),
                    },
                  })}
                />

                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {t(
                    'forms.create-update.placeholder.alternatives.description'
                  )}
                </Typography>

                {/* Display alternatives */}
                {['A', 'B', 'C', 'D'].map((alt, i) => {
                  const alternativeErrors =
                    questionErrors?.alternatives &&
                    questionErrors?.alternatives[i]

                  // A and B should be required every time
                  const isRequired = i < 2

                  // If we are in update mode, we don't want to allow the user to add alternatives
                  if (isUpdate && questionAlternatives.length - 1 < i) {
                    return null
                  }

                  return (
                    <TextField
                      key={i}
                      error={Boolean(alternativeErrors)}
                      helperText={alternativeErrors?.label?.message}
                      label={t(
                        `forms.create-update.placeholder.alternatives.option.${
                          isRequired ? 'required' : 'default'
                        }`
                      )}
                      {...getCommonTextFieldProps()}
                      {...register(
                        `questions.${index}.alternatives.${i}.label`,
                        {
                          required: {
                            value: isRequired,
                            message: t(
                              'forms.create-update.validation.alternative.required',
                              { alt }
                            ),
                          },
                        }
                      )}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip
                              title={
                                watch(
                                  `questions.${index}.alternatives.${i}.isCorrect`
                                )
                                  ? 'This answer is correct'
                                  : ''
                              }
                            >
                              <Checkbox
                                checked={watch(
                                  `questions.${index}.alternatives.${i}.isCorrect`
                                )}
                                {...register(
                                  `questions.${index}.alternatives.${i}.isCorrect`
                                )}
                              />
                            </Tooltip>
                          </InputAdornment>
                        ),
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              sx={{
                                backgroundColor: 'primary.main',
                                borderRadius: '100%',
                                color: 'white',
                                width: 25,
                                height: 25,
                              }}
                            >
                              {alt}
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )
                })}
              </Stack>
            </Paper>
          )
        })}

        {!isUpdate && (
          <Box>
            <Button onClick={() => append({})} variant="outlined">
              {t('forms.create-update.placeholder.questions.add')}
            </Button>
          </Box>
        )}

        <Divider />

        <Typography sx={{ mb: 3 }} variant="h4">
          {t('forms.create-update.title.status')}
        </Typography>

        <VisibilitySelector
          value={watch('visibility')}
          onChange={(value: Visibility) => setValue('visibility', value)}
        />

        <StatusSelector
          value={watch('draft')}
          onChange={(value: boolean) => setValue('draft', value)}
        />

        <LoadingButton {...getCommonSubmitButtonProps(isSubmitting)}>
          {t(
            `forms.create-update.placeholder.submit.${
              isUpdate ? 'update' : 'create'
            }`
          )}
        </LoadingButton>
      </Stack>
    </form>
  )
}
