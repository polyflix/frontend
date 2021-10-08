import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAuth } from '../../../authentication'
import { FilledButton, OutlineButton, Paragraph, Title } from '../../../ui'
import { usePlayQuizz } from '../../hooks/usePlayQuizz.hook'
import { PlayComponentProps } from '../../types/play-quizz.type'
import { asPercentage, getColor } from '../../util/quizz.util'

export const QuizzEnd = ({ quizz }: PlayComponentProps) => {
  const { user } = useAuth()
  const { t } = useTranslation('play-quizz')
  const { attempt } = usePlayQuizz()

  const getMessage = (scorePercentage: number) => {
    if (scorePercentage >= 75) {
      return t('results.title.excellent')
    } else if (scorePercentage >= 25 && scorePercentage < 75) {
      return t('results.title.good')
    }
    return t('results.title.disappointing')
  }

  const score = attempt?.score || 0
  const scorePercentage = asPercentage(score, quizz.questions.length)
  const color = getColor(scorePercentage)

  return (
    <div className="bg-darkgray w-8/12 mx-auto p-8 rounded-md">
      <div className="flex flex-col items-center justify-center">
        <CircularProgressbar
          className="w-36 fill-current"
          value={score}
          maxValue={quizz.questions.length}
          text={`${score}/${quizz.questions.length}`}
          styles={buildStyles({
            trailColor: '#949495',
            pathColor: color,
            textColor: color,
          })}
        />
        <Title className="my-8">{getMessage(scorePercentage)}</Title>
        <Paragraph className="text-center mb-8">
          {t('results.description')}
        </Paragraph>
        <div className="flex items-center">
          <Link to={`/profile/quizzes/${user?.id}/history`}>
            <OutlineButton as="button">
              {t('results.actions.view-history')}
            </OutlineButton>
          </Link>
          <div className="mx-4"></div>
          <Link to="/quizzes">
            <FilledButton as="button">
              {t('results.actions.back-to-list')}
            </FilledButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
