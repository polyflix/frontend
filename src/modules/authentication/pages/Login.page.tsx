import { environment } from '@env/environment'
import { Button, Container, Link, Typography } from '@mui/material'
import { useKeycloak } from '@react-keycloak/web'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { MHidden } from '@core/components/MHidden/MHidden.component'

import { AuthLayout } from '@auth/layouts/Auth.layout'
import {
  ContentAuthStyle,
  RootAuthStyle,
  SectionAuthStyle,
} from '@auth/styles/Auth.style'

export const LoginPage = () => {
  // Get the translation from the auth namespace
  const { t } = useTranslation('auth')

  const { keycloak } = useKeycloak()

  const login = useCallback(() => {
    keycloak.login({
      redirectUri: environment.redirectUri,
    })
  }, [keycloak])

  const register = useCallback(() => {
    keycloak.register({
      redirectUri: environment.redirectUri,
    })
  }, [keycloak])

  return (
    <RootAuthStyle
      maxWidth={false}
      title={t('signIn.title')}
      disableGutters={true}
    >
      <AuthLayout>
        {t('signIn.header.links.signUp.label')}
        <Link
          underline="none"
          variant="body1"
          component={RouterLink}
          to="/auth/register"
        >
          {t('signIn.header.links.signUp.link')}
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionAuthStyle>
          <Typography variant="h3">{t('signIn.sidebar.title')}</Typography>
          <Typography sx={{ color: 'text.secondary', my: 3 }}>
            {t('signIn.sidebar.description')}
          </Typography>
          <Button sx={{ py: 1 }} fullWidth variant="outlined">
            {t('signIn.sidebar.cta')}
          </Button>
        </SectionAuthStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentAuthStyle>
          {/* <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              {t('signIn.title')}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {t('signIn.subtitle')}
            </Typography>
          </Box> */}

          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            onClick={login}
          >
            {t('signIn.confirm')}
          </Button>

          <Button
            fullWidth
            sx={{ mt: 5 }}
            size="large"
            type="submit"
            variant="text"
            onClick={register}
          >
            {t('signUp.confirm')}
          </Button>

          <MHidden width="smUp">
            <Typography variant="subtitle2" sx={{ mt: 3, textAlign: 'center' }}>
              {t('signIn.header.links.signUp.label')}
              <Link component={RouterLink} to="/auth/register">
                {t('signIn.header.links.signUp.link')}
              </Link>
            </Typography>
          </MHidden>
        </ContentAuthStyle>
      </Container>
    </RootAuthStyle>
  )
}
