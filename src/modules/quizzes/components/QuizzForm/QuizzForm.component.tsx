import {
  CheckCircleIcon as CheckCircleIconOutline,
  PlusIcon,
  XIcon,
} from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { useInjection } from '@polyflix/di'
import { motion } from 'framer-motion'
import { range } from 'lodash'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../../../authentication'
import { cn } from '../../../common'
import { StatusSelector } from '../../../common/components/StatusSelector/StatusSelector.component'
import { VisibilitySelector } from '../../../common/components/VisibilitySelector/VisibilitySelector.component'
import {
  Alert,
  Checkbox,
  fadeInDown,
  FilledButton,
  Input,
  Paragraph,
  Title,
  Typography,
} from '../../../ui'
import { Question } from '../../models/question.model'
import { IQuizz, Quizz } from '../../models/quizz.model'
import { QuizzService } from '../../services/quizz.service'
import { ScoreMethodSelector } from '../ScoreMethodSelector/ScoreMethodSelector.component'

type Props = {
  isUpdate: boolean
  quizz?: Quizz
}

export type IQuizzForm = Partial<IQuizz>

const AddQuestionCard = ({ onClick }: { onClick?: () => void }) => {
  const { t } = useTranslation('resources')
  return (
    <motion.div
      onClick={onClick}
      className="col-span-2 hover:text-nx-red cursor-pointer transition-all flex-col flex items-center justify-center border-dashed border-2 rounded-md border-lightgray p-6 text-lightgray"
    >
      <PlusIcon className="w-12 transition-all" />
      <Typography overrideDefaultClasses className="transition-all" as="h6">
        {t('quizzes.form.questions.add')}
      </Typography>
    </motion.div>
  )
}

export const QuizzForm = ({ quizz, isUpdate }: Props) => {
  const { t } = useTranslation('resources')
  const history = useHistory()
  const { user } = useAuth()
  const quizzService = useInjection<QuizzService>(QuizzService)

  // A boolean which should be true when any async action is in progress. (Submit form for example)
  const [isAction, setIsAction] = useState<boolean>(false)

  // A state to handle question errors & api errors
  const [error, setError] = useState<string>()

  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(
    quizz?.questions.length || 1
  )

  const { register, handleSubmit, errors, watch } = useForm<IQuizzForm>({
    defaultValues: {
      visibility: quizz?.visibility || 'public',
      name: quizz?.name,
      allowedRetries: quizz?.allowedRetries || 1,
      draft: quizz?.draft,
      questions: quizz?.questions,
      keepHighestScore: quizz?.keepHighestScore || false,
    },
  })

  const onSubmit = async (data: IQuizzForm) => {
    setError(undefined)
    setIsAction(true)

    const newQuizz: IQuizzForm = {
      ...data,
      questions: Question.clearAlternatives(data.questions || []),
    }

    try {
      // Validate questions
      if (newQuizz.questions && !newQuizz.questions.every(Question.validate)) {
        setError(t('quizzes.form.errors.questions.noCorrectAlternatives'))
      } else {
        if (isUpdate) await quizzService.updateQuizz(quizz?.id!, newQuizz)
        else await quizzService.createQuizz(newQuizz)

        history.push(`/profile/quizzes/${user?.id}`)
      }
    } catch (e: any) {
      setError(e)
    } finally {
      setIsAction(false)
    }
  }

  const questionsPlaceholders = range(0, numberOfQuestions)
  const translateKey = isUpdate ? 'update' : 'create'
  return (
    <div className="w-10/12 mx-auto">
      <Title>{isUpdate ? quizz?.name : t('quizzes.form.title')}</Title>
      <Paragraph overrideDefaultClasses className="my-4 text-sm text-nx-white">
        {t(`quizzes.form.subtitle.${translateKey}`)}
      </Paragraph>
      <form
        className="grid grid-cols-2 gap-4 py-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          name="name"
          error={errors.name}
          className="col-span-2 md:col-span-1"
          placeholder={t('quizzes.form.placeholders.name')}
          required
          hint={t('quizzes.form.hints.name')}
          ref={register({
            minLength: {
              value: 1,
              message: t('quizzes.form.errors.name.empty'),
            },
          })}
        />
        <Input
          name="allowedRetries"
          error={errors.allowedRetries}
          className="col-span-2 md:col-span-1"
          placeholder={t('quizzes.form.placeholders.allowedRetries')}
          required
          disabled={isUpdate}
          hint={t('quizzes.form.hints.allowedRetries')}
          type="number"
          ref={register({
            valueAsNumber: true,
            min: {
              value: 1,
              message: t('quizzes.form.errors.allowedRetries.min'),
            },
          })}
        />

        <div className="my-4 col-span-2">
          <Title
            overrideDefaultClasses
            className="text-xl font-bold text-nx-white"
          >
            {t('visibility.label', { ns: 'resources' })}
          </Title>
          <VisibilitySelector
            name="visibility"
            value={watch('visibility')}
            ref={register()}
            className="mt-4"
          />
        </div>

        <Title
          overrideDefaultClasses
          className="text-xl col-span-2 font-bold text-nx-white"
        >
          Questions
        </Title>
        <Paragraph
          overrideDefaultClasses
          className="col-span-2 text-sm text-nx-white"
        >
          {t('quizzes.form.questions.description')}
        </Paragraph>

        {questionsPlaceholders.map((i) => {
          const name = `questions[${i}].label`
          const index = `questions[${i}].index`

          const isFirst = i === 0
          const isLast = questionsPlaceholders.length - 1 === i

          const isErrorForLabel = errors.questions
            ? errors.questions[i]?.label
              ? true
              : false
            : false

          return (
            <motion.div
              key={i}
              className="bg-darkgray rounded-md p-5 col-span-2"
            >
              <div className="flex items-center justify-between">
                <Title overrideDefaultClasses className="text-nx-white">
                  Question n°{i + 1}
                </Title>
                {isLast && !isFirst && (
                  <XIcon
                    onClick={() => setNumberOfQuestions(numberOfQuestions - 1)}
                    className="w-6 transition-all transform hover:scale-125 cursor-pointer text-nx-red"
                  />
                )}
              </div>
              <input
                type="hidden"
                value={i}
                ref={register({ valueAsNumber: true })}
                name={index}
              />
              <input
                className={cn(
                  'my-4 appearance-none text-nx-white py-3 bg-transparent border-b w-full text-sm leading-tight focus:outline-none',
                  isErrorForLabel
                    ? 'placeholder-nx-red border-nx-red'
                    : 'placeholder-lightgray border-lightgray'
                )}
                placeholder={t('quizzes.form.placeholders.question')}
                type="text"
                name={name}
                ref={register({ required: 'The question is required.' })}
              />
              <ul className="text-nx-white text-sm">
                {['A', 'B', 'C', 'D'].map((alt: string, idx: number) => {
                  const altName = `questions[${i}].alternatives[${idx}].label`
                  const altIsCorrect = `questions[${i}].alternatives[${idx}].isCorrect`
                  const isLastAlt = idx === 3
                  // A and B should be required every time
                  const isRequired = idx < 2
                  return (
                    <li
                      key={idx}
                      className={cn(!isLastAlt && 'mb-2', 'flex items-center')}
                    >
                      <div className="flex items-center w-full justify-between">
                        <div className="flex items-center w-full">
                          <span
                            className={cn(
                              'mr-2 text-xs w-6 h-6 rounded-full flex items-center justify-center',
                              isRequired || watch(altName) !== ''
                                ? 'bg-nx-red'
                                : 'bg-lightgray'
                            )}
                          >
                            {alt}
                          </span>
                          <input
                            className="appearance-none text-nx-white py-3 bg-transparent w-full text-sm leading-tight focus:outline-none"
                            placeholder={`${t(
                              'quizzes.form.placeholders.alternative'
                            )} ${
                              isRequired
                                ? `(${t('quizzes.form.placeholders.required')})`
                                : ''
                            }`}
                            type="text"
                            name={altName}
                            ref={register({
                              validate: (value) =>
                                isRequired ? value !== '' : true,
                            })}
                          />
                        </div>
                        <Checkbox
                          name={altIsCorrect}
                          ref={register()}
                          icon={
                            watch(altIsCorrect) ? (
                              <CheckCircleIcon className="text-green-500 w-6 mr-2" />
                            ) : (
                              <CheckCircleIconOutline className="text-lightgray w-6 mr-2" />
                            )
                          }
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          )
        })}
        <AddQuestionCard
          onClick={() => setNumberOfQuestions(numberOfQuestions + 1)}
        />

        <div className="col-span-2">
          <Title
            overrideDefaultClasses
            className="text-xl font-bold text-nx-white mb-4"
          >
            Status
          </Title>
          <StatusSelector isChecked={watch('draft')} ref={register()} />
        </div>

        <div className="col-span-2">
          <Title
            overrideDefaultClasses
            className="text-xl font-bold text-nx-white mb-4"
          >
            {t('quizzes.form.keepHighestScore.label')}
          </Title>
          <ScoreMethodSelector
            isChecked={watch('keepHighestScore')}
            ref={register()}
          />
        </div>

        {error && (
          <Alert type="error" className="my-4 col-span-2">
            {error}
          </Alert>
        )}

        <FilledButton
          disabled={isAction}
          className="col-span-2"
          as="input"
          inputValue={t(`actions.${translateKey}`)}
          variants={fadeInDown}
        />
      </form>
    </div>
  )
}
