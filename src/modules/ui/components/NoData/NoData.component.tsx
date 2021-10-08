import { ExclamationIcon } from '@heroicons/react/outline'
import { useTranslation } from 'react-i18next'

import { Paragraph } from '../Typography/Paragraph/Paragraph.component'

export const NoData = () => {
  const { t } = useTranslation()
  return (
    <Paragraph className="flex flex-col items-center">
      <ExclamationIcon className="w-6 md:w-7 text-nx-red mb-2" />
      {t('shared.common.errors.noData')}
    </Paragraph>
  )
}
