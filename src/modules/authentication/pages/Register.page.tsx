import { Box, Button, Container, Link, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { MHidden } from '@core/components/MHidden/MHidden.component'

import { RegisterForm } from '@auth/components/Forms/RegisterForm.component'
import { AuthLayout } from '@auth/layouts/Auth.layout'
import {
  ContentAuthStyle,
  RootAuthStyle,
  SectionAuthStyle,
} from '@auth/styles/Auth.style'
import { useKeycloak } from '@react-keycloak/web'

export const RegisterPage = () => {
  const { t } = useTranslation('auth')
  const { keycloak } = useKeycloak()

  keycloak.register()
  return (
    <RootAuthStyle
      maxWidth={false}
      disableGutters={true}
      title={t('signUp.title')}
    >
      <AuthLayout>
        {t('signUp.header.links.login.label')}
        <Link
          underline="none"
          variant="body1"
          component={RouterLink}
          to="/auth/login"
        >
          {t('signUp.header.links.login.link')}
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionAuthStyle>
          <Typography variant="h3">{t('signUp.sidebar.title')}</Typography>
          <Typography sx={{ color: 'text.secondary', my: 3 }}>
            {t('signUp.sidebar.description')}
          </Typography>
          <Button sx={{ py: 1 }} fullWidth variant="outlined">
            {t('signUp.sidebar.cta')}
          </Button>
        </SectionAuthStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentAuthStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              {t('signUp.title')}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {t('signUp.subtitle')}
            </Typography>
          </Box>

          <RegisterForm />

          <Typography
            variant="body2"
            align="center"
            sx={{ color: 'text.secondary', mt: 3 }}
          >
            {t('signUp.termsOfService.label')}
            <Link
              href="https://www.umontpellier.fr/mentions-legales"
              target="_blank"
              underline="always"
              sx={{ color: 'text.primary' }}
            >
              {t('signUp.termsOfService.link')}
            </Link>
            .
          </Typography>

          <MHidden width="smUp">
            <Typography variant="subtitle2" sx={{ mt: 3, textAlign: 'center' }}>
              {t('signUp.header.links.login.label')}
              <Link to="/auth/login" component={RouterLink}>
                {t('signUp.header.links.login.link')}
              </Link>
            </Typography>
          </MHidden>
        </ContentAuthStyle>
      </Container>
    </RootAuthStyle>
  )
}
