import { Button, Grid, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useParams } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { Page } from '@core/components/Page/Page.component'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { getUsernameToDisplay } from '@users/helpers/displayUsername.helper'
import { useGetUserQuery } from '@users/services/user.service'

import { ProfileBanner } from '../../components/Banner/Banner.component'

type Props = {
  children?: React.ReactNode
}

export const ProfilePage: React.FC = ({ children }: Props) => {
  const { t } = useTranslation('users')
  const { id } = useParams<{ id: string }>()
  const { user: me } = useAuth()
  const userQuery = useGetUserQuery(id || me?.id!)
  const { isLoading, isFetching, data: user, refetch } = userQuery

  useEffect(refetch, [id])

  return (
    <Page
      isLoading={isLoading || isFetching}
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
        {!id && (
          <Button
            variant="outlined"
            component={RouterLink}
            to="/users/profile/settings"
            startIcon={<Icon name="ci:settings" />}
          >
            {t('profile.actions.edit')}
          </Button>
        )}
      </Grid>
      <ProfileBanner user={user!} />
      {children}
    </Page>
  )
}
