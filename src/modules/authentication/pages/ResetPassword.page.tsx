import { Container, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { ResetPasswordForm } from '@auth/components/Forms/ResetPasswordForm.component'

export const ResetPasswordPage = () => {
  const { t } = useTranslation('auth')

  return (
    <Container>
      <Typography variant="h5" fontWeight="bold">
        {t('resetPassword.title')}
      </Typography>
      <Typography variant="subtitle1">{t('resetPassword.subtitle')}</Typography>
      <ResetPasswordForm />
    </Container>
  )
}
