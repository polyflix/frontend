import { Container } from '@mui/material'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { AuthLayout } from '@auth/layouts/Auth.layout'
import { ContentAuthStyle, RootAuthStyle } from '@auth/styles/Auth.style'

import { withQueryParams } from '../../core/hoc/withQueryParams.hoc'
import { RequestPasswordResetForm } from '../components/Forms/RequestPasswordResetForm.component'
import {
  ResetPasswordForm,
  ResetPasswordFormProps,
} from '../components/Forms/ResetPasswordForm.component'

const ResetPasswordPage: React.FC<ResetPasswordFormProps> = (props) => {
  const { email, token } = props
  const { t } = useTranslation('auth')
  return (
    <RootAuthStyle
      maxWidth={false}
      disableGutters={true}
      title={t('resetPassword.request.title')}
    >
      <AuthLayout />
      <Container>
        <ContentAuthStyle>
          {!email || !token ? (
            <RequestPasswordResetForm />
          ) : (
            <ResetPasswordForm {...props} />
          )}
        </ContentAuthStyle>
      </Container>
    </RootAuthStyle>
  )
}

const ResetPasswordPageWithSearch =
  withQueryParams<ResetPasswordFormProps>(ResetPasswordPage)

export { ResetPasswordPageWithSearch as ResetPasswordPage }
