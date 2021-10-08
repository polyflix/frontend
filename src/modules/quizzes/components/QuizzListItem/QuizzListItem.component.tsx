import { CollectionIcon } from '@heroicons/react/outline'
import { useInjection } from '@polyflix/di'
import React, { useState } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAuth } from '../../../authentication'
import { Paragraph, Typography } from '../../../ui'
import { CrudButton } from '../../../ui/components/Buttons/CrudButton/CrudButton.component'
import { Quizz } from '../../models/quizz.model'
import { QuizzService } from '../../services/quizz.service'
import { asPercentage, getColor } from '../../util/quizz.util'
import { QuizzAttemptListItem } from '../Attempts/QuizzAttemptListItem.component'
import { DeleteQuizzModal } from '../DeleteQuizz/DeleteQuizz.component'

type Props = {
  quizz: Quizz
  displayLastUpdate?: boolean
  displayCrudButtons?: boolean
  displayAttempts?: boolean
  displayPublisher?: boolean
  displayRemainingAttempts?: boolean
  displayNumberOfQuestions?: boolean
  displayScoreMethod?: boolean
  displayTags?: boolean
  displayScore?: boolean
  onDelete?: () => void
}

export const QuizzListItem: React.FC<Props> = ({
  quizz,
  onDelete,
  displayLastUpdate = true,
  displayCrudButtons = false,
  displayAttempts = false,
  displayRemainingAttempts = true,
  displayPublisher = false,
  displayNumberOfQuestions = false,
  displayScore = true,
  displayTags = false,
}: Props) => {
  const { user } = useAuth()
  const quizzService = useInjection<QuizzService>(QuizzService)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { t } = useTranslation('resources')
  const { score, remainingAttempts } = quizz
  const color = getColor(asPercentage(score!, quizz.questions.length))

  const noMoreAttempts = remainingAttempts <= 0

  const deleteQuizz = async () => {
    await quizzService.deleteQuizz(quizz.id)
    setIsOpen(false)
    if (onDelete) {
      onDelete()
    }
  }

  const getCard = () => {
    const content = (
      <div
        className="w-full text-nx-white group-hover:opacity-70 hover:opacity-important transition-all relative flex items-center bg-darkgray rounded-md p-8"
        key={quizz.id}
      >
        <div className="w-full">
          {displayTags && quizz.isNew() && (
            <div className="absolute left-4 -top-2 bg-green-600 px-3 py-2 border border-green-700 uppercase rounded-md shadow-md font-bold text-xs mb-4 w-min">
              {t('quizzes.card.new')}
            </div>
          )}
          <h2 className="font-bold tracking-wider w-full text-lg">
            {quizz.name}
          </h2>

          {displayPublisher && (
            <div className="mt-4">
              <Typography as="span" overrideDefaultClasses className="text-sm">
                {t('quizzes.card.user')}{' '}
                <Typography as="span" bold>
                  {quizz.isCreator(user!)
                    ? t('quizzes.card.me')
                    : quizz.publisher?.displayName}
                </Typography>
              </Typography>
            </div>
          )}

          {displayRemainingAttempts && (
            <Paragraph className="text-sm mt-4" overrideDefaultClasses>
              {noMoreAttempts
                ? t('quizzes.card.remainingAttempts.no-more')
                : t('quizzes.card.remainingAttempts.basic', {
                    remainingAttempts,
                  })}
            </Paragraph>
          )}

          {displayScore && (
            <Paragraph className="text-sm mt-4" overrideDefaultClasses>
              {quizz.keepHighestScore
                ? t('quizzes.card.scoreMethod.max')
                : t('quizzes.card.scoreMethod.mean')}
            </Paragraph>
          )}

          {displayLastUpdate && (
            <Typography as="p" className="text-sm mt-4" overrideDefaultClasses>
              {t('quizzes.card.date.updatedAt')}{' '}
              {quizz.updatedAt.format(t('quizzes.card.date.format'))}
            </Typography>
          )}

          <div className="col-span-12">
            {displayCrudButtons && (
              <div className="flex items-center mt-4">
                <CrudButton
                  link={`/quizzes/${quizz.id}/results`}
                  textOverride={'View results'}
                  type="info"
                  font="sm"
                  customIcon={CollectionIcon}
                />
                <div className="mr-3"></div>
                <CrudButton
                  font="sm"
                  type="edit"
                  link={`/quizzes/${quizz.id}/update`}
                />
                <div className="mr-3"></div>
                <CrudButton
                  type="delete"
                  font="sm"
                  onClick={() => setIsOpen(true)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <>
            {displayNumberOfQuestions && (
              <div className="flex flex-col items-center">
                <h1 className="text-2xl mb-3 font-bold">
                  {quizz.questions.length}
                </h1>
                <span className="uppercase text-sm tracking-wider">
                  Questions
                </span>
              </div>
            )}
            {displayScore && (
              <CircularProgressbar
                className="w-20 fill-current"
                value={score!}
                maxValue={quizz.questions.length}
                text={`${score}/${quizz.questions.length}`}
                styles={buildStyles({
                  trailColor: '#949495',
                  pathColor: color,
                  textColor: color,
                })}
              />
            )}
          </>
        </div>

        <DeleteQuizzModal
          onDelete={deleteQuizz}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    )
    if (!noMoreAttempts) {
      return <Link to={`/quizzes/${quizz.id}/play`}>{content}</Link>
    }

    return content
  }

  if (displayAttempts) {
    return (
      <div className="grid grid-cols-12 gap-6">
        <div className="md:col-span-5 col-span-12">{getCard()}</div>
        <div className="md:col-span-7 col-span-12">
          {quizz.attempts.map((attempt, idx) => {
            const isLast = idx === quizz.attempts.length - 1
            return (
              <QuizzAttemptListItem
                attempt={attempt}
                isLast={isLast}
                quizz={quizz}
                key={attempt.id}
              />
            )
          })}
        </div>
      </div>
    )
  }

  return getCard()
}
