import { Divider, Paper } from '@mui/material'
import { isUndefined } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'

import { useGetUserQuery } from '@users/services/user.service'
import { InformationsForm } from '@users/components/Forms/InformationsForm.component'

export const CreateUpdateUserPage = () => {
  const { t } = useTranslation('users')
  const { id } = useParams<{ id: string }>()

  const { data: user, isLoading } = useGetUserQuery(id)

  const i18nKey = isUndefined(user) ? 'create' : 'update'

  return (
    <Page
      sx={{
        pt: 0,
      }}
      isLoading={isLoading}
      title={t('form.upsert.title.create')}
    >
      <Header
        title={t(`form.upsert.title.${i18nKey}`, { user: user?.lastName })}
        description={t(`form.upsert.description.${i18nKey}`)}
      />
      <Divider sx={{ my: 3 }} />
      <Paper variant="outlined" sx={{ paddingY: 2, paddingX: 4 }}>
        <InformationsForm title={t('profile.tabs.account')} user={user!} />
      </Paper>
    </Page>
  )
}
