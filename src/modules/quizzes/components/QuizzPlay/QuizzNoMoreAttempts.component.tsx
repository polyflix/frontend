import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAuth } from '../../../authentication'
import { Pagination } from '../../../common/types/crud.type'
import { FilledButton, OutlineButton, Paragraph, Title } from '../../../ui'
import { Attempt } from '../../models/attempt.model'
import { PlayComponentProps } from '../../types/play-quizz.type'

export const QuizzNoMoreAttempts = ({}: PlayComponentProps & {
  attempts: Pagination<Attempt>
}) => {
  const { user } = useAuth()
  const { t } = useTranslation('play-quizz')
  return (
    <div className="bg-darkgray w-8/12 mx-auto p-8 rounded-md text-center">
      <Title>{t('noAttempts.title')}</Title>
      <Paragraph className="my-8">{t('noAttempts.description')}</Paragraph>
      <div className="flex items-center justify-center">
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
  )
}
