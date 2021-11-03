import { useTranslation } from 'react-i18next'

import { Page } from '@core/components/Page/Page.component'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { UserForm } from '@users/components/Forms/UserForm.component'

export const EditProfilePage = () => {
  const { t } = useTranslation('users')

  const { user } = useAuth()

  return (
    <Page title={t('profile.title.edit')}>
      <UserForm user={user!}></UserForm>
    </Page>
  )
}
