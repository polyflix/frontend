import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { Page } from '@core/components/Page/Page.component'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { ProfileBanner } from '@users/components/Banner/Banner.component'
import { getUsernameToDisplay } from '@users/helpers/displayUsername.helper'

export const ProfilePage: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { t } = useTranslation('users')

  const { user } = useAuth()

  return (
    <Page
      title={t('profile.title.view') + getUsernameToDisplay(user!)}
      maxWidth={'xl'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Grid
        container
        width="100%"
        margin="auto"
        alignContent="center"
        alignItems="center"
        direction="row"
        spacing={2}
        justifyContent="space-between"
      >
        <Typography sx={{ mb: 2 }} align="left" variant="h3">
          {t('profile.title.view') + getUsernameToDisplay(user!)}
        </Typography>
        <Button
          variant="outlined"
          component={RouterLink}
          to="/users/profile/settings"
          startIcon={<Icon name="ci:settings" />}
        >
          {t('profile.actions.edit')}
        </Button>
      </Grid>
      <ProfileBanner user={user!} />
      {children}
    </Page>
  )
}
