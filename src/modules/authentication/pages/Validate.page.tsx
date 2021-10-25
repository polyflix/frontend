import {
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Typography,
} from '@mui/material'
import React, { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { MHidden } from '@core/components/MHidden/MHidden.component'
import { withQueryParams } from '@core/hoc/withQueryParams.hoc'

import { ResendEmailButton } from '@auth/components/Buttons/ResendEmailButton.component'
import { AuthLayout } from '@auth/layouts/Auth.layout'
import { AuthService } from '@auth/services/auth.service'
import {
  ContentAuthStyle,
  RootAuthStyle,
  SectionAuthStyle,
} from '@auth/styles/Auth.style'

interface ValidatePageQueryParams {
  userId: string
}

const SendEmailContent: React.FC = () => {
  const { t } = useTranslation('auth')
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h4" gutterBottom>
        {t('validate.title')}
      </Typography>
      <Typography sx={{ color: 'text.secondary', my: 3 }}>
        <Trans
          i18nKey={'validate.subtitle'}
          ns={'auth'}
          components={{
            bold: <strong />,
          }}
        />
      </Typography>
      <ResendEmailButton />
    </Box>
  )
}

const ValidateAccountContent: React.FC<ValidatePageQueryParams> = ({
  userId,
}) => {
  const { t } = useTranslation('auth')
  const authService = useInjection<AuthService>(AuthService)

  useEffect(() => {
    authService.validateAccount(userId).catch(console.error)
  }, [])
  return (
    <Box sx={{ mb: 5, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        {t('validate.validating_title')}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }} my={2}>
        <CircularProgress />
      </Box>
    </Box>
  )
}

/**
 * ValidationPage, it is not exported directly as we inject query params into it
 */
const ValidatePage: React.FC<ValidatePageQueryParams> = ({ userId }) => {
  const { t } = useTranslation('auth')
  return (
    <RootAuthStyle container={false} title={t('validate.title')}>
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
          {userId ? (
            <ValidateAccountContent userId={userId} />
          ) : (
            <SendEmailContent />
          )}

          <MHidden width="smUp">
            <Typography variant="subtitle2" sx={{ mt: 3, textAlign: 'center' }}>
              {t('signUp.header.links.signUp.label')}
              <Link component={RouterLink} to="/auth/register">
                {t('signUp.header.links.signUp.link')}
              </Link>
            </Typography>
          </MHidden>
        </ContentAuthStyle>
      </Container>
    </RootAuthStyle>
  )
}

const ValidatePageWithQueryParams =
  withQueryParams<ValidatePageQueryParams>(ValidatePage)
export { ValidatePageWithQueryParams as ValidatePage }
