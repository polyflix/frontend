import { Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { useAuth } from '@auth/hooks/useAuth.hook'
import { AuthService } from '@auth/services/auth.service'

/**
 * These props aren't in redux state as it is not needed for this
 * specific use case
 */
type SendRequestState = {
  /**
   * Request is currently being sent or not
   */
  isPending: boolean
  /**
   * Email has been properly sent (Not internal server error)
   */
  isSent: boolean
}
/**
 * Logic around the submit button to have a new mail
 * @constructor
 */
export const ResendEmailButton: React.FC = () => {
  const { user } = useAuth()
  const { t } = useTranslation('auth')
  const authService = useInjection<AuthService>(AuthService)
  const [requestState, setRequestState] = useState<SendRequestState>({
    isPending: false,
    isSent: false,
  })
  const sendRequest = () => {
    if (!user) return
    setRequestState({ ...requestState, isPending: true })
    authService
      .sendAgainValidationEmail(user.email)
      .then(() => {
        setRequestState({ isSent: true, isPending: false })
      })
      .catch(console.error)
  }

  if (requestState.isSent) {
    return (
      <Typography sx={{ color: 'text.secondary', my: 3 }}>
        {t('validate.confirmed')}
      </Typography>
    )
  }

  return (
    <Button
      onClick={() => sendRequest()}
      disabled={requestState.isPending}
      sx={{ py: 1 }}
      variant={'contained'}
      fullWidth
    >
      {t('validate.confirm')}
    </Button>
  )
}
