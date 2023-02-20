import { useTranslation } from 'react-i18next'

import { Page } from '@core/components/Page/Page.component'
import { ErrorLayout } from '@layouts/Error/Error.layout'

interface Props {
  isPage?: boolean
}

export const NotFoundPage = ({ isPage }: Props) => {
  const { t } = useTranslation('errors')

  return (
    <Page title={t('404.title')}>
      <ErrorLayout code={404} isPage={isPage} />
    </Page>
  )
}
