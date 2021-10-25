import { useTranslation } from 'react-i18next'

import { Page } from '@core/components/Page/Page.component'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { Banner } from '@users/components/Banner/Banner.component'

export const ProfilePage = () => {
  const { t } = useTranslation('users')

  const { user } = useAuth()

  return (
    <Page title={t('profile.title.view') + user?.firstName}>
      <Banner user={user!}></Banner>
    </Page>
  )
}
