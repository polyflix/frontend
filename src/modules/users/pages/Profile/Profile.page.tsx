import Typography from '@mui/material/Typography'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import { Page } from '@core/components/Page/Page.component'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { ProfileBanner } from '@users/components/Banner/Banner.component'

export const ProfilePage: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { t } = useTranslation('users')

  const { user } = useAuth()

  return (
    <Page
      title={t('profile.title.view') + user?.firstName}
      maxWidth={'xl'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography sx={{ mb: 2 }} align="left" variant="h3">
        {t('profile.title.view') + user?.firstName}
      </Typography>
      <ProfileBanner user={user!}></ProfileBanner>
      {children}
    </Page>
  )
}
