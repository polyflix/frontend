import { Container, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { LoginForm } from '@auth/components/Forms/LoginForm.component'

export const LoginPage = () => {
  // Get the translation from the auth namespace
  const { t } = useTranslation('auth')

  return (
    <Container>
      <Typography variant="h5" fontWeight="bold">
        {t('signIn.title')}
      </Typography>
      <Typography variant="subtitle1">{t('signIn.subtitle')}</Typography>
      <LoginForm />
    </Container>
  )
}
