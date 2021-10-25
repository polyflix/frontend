import { Box, Container, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { ResetPasswordForm } from '@auth/components/Forms/ResetPasswordForm.component'
import { AuthLayout } from '@auth/layouts/Auth.layout'
import { ContentAuthStyle, RootAuthStyle } from '@auth/styles/Auth.style'

export const ResetPasswordPage = () => {
  const { t } = useTranslation('auth')

  return (
    <RootAuthStyle container={false} title={t('resetPassword.title')}>
      <AuthLayout />
      <Container>
        <ContentAuthStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              {t('resetPassword.title')}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {t('resetPassword.subtitle')}
            </Typography>
          </Box>
          <ResetPasswordForm />
        </ContentAuthStyle>
      </Container>
    </RootAuthStyle>
  )
}
