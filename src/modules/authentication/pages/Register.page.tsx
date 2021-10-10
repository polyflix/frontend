import { Box, Container, Link, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { MHidden } from '@core/components/MHidden/MHidden.component'
import { Page } from '@core/layouts/Page.layout'

import { RegisterForm } from '@auth/components/Forms/RegisterForm.component'
import { AuthLayout } from '@auth/components/Layouts/AuthLayout.component'

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}))

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}))

export const RegisterPage = () => {
  const { t } = useTranslation('auth')

  return (
    <RootStyle title={t('signUp.title')}>
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

      <Container>
        <ContentStyle>
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
              Already have an account?&nbsp;
              <Link to="/auth/login" component={RouterLink}>
                Login
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
