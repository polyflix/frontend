import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { Alert, FilledButton, Paragraph, Title } from '../../../ui'
import { PlayComponentProps, PlayQuizzStep } from '../../types/play-quizz.type'

export const QuizzOnboard = ({ quizz, playService }: PlayComponentProps) => {
  const { t } = useTranslation('play-quizz')

  return (
    <motion.div className="bg-darkgray w-10/12 mx-auto p-8 rounded-md">
      <Title>{t('onboarding.title')}</Title>
      <Paragraph className="my-8 text-sm leading-8" overrideDefaultClasses>
        {t('onboarding.description.head', { quizzName: quizz.name })}
        <br />
        <br />
        {t('onboarding.description.explanations', {
          questions: quizz.questions.length,
        })}
        <br />
        <br />
        {t('onboarding.description.score')}
        <br />
        <br />
        {t('onboarding.description.limit', { retries: quizz.allowedRetries })}
        <br />
      </Paragraph>
      <div className="flex justify-between">
        <Alert className="mr-2" type="warning">
          {t('onboarding.warning')}
        </Alert>
        <FilledButton
          as="button"
          className="flex-shrink-0"
          onClick={() => playService.setStep(PlayQuizzStep.Questions)}
        >
          Go !
        </FilledButton>
      </div>
    </motion.div>
  )
}
