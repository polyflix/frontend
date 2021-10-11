import { LoadingButton } from '@mui/lab'
import { Alert, Button, Stack, TextField } from '@mui/material'
import { isUndefined } from 'lodash'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { Regex } from '@core/constants/regex.constant'

import { AuthService } from '@auth/services/auth.service'
import { IResetPasswordForm } from '@auth/types/form.type'

interface Props {
  onSuccess?: () => void
}

/**
 * This is the form used to reset the user password.
 * @returns
 */
export const ResetPasswordForm = ({ onSuccess }: Props) => {
  const authService = useInjection<AuthService>(AuthService)
  const { t } = useTranslation('auth')

  const history = useHistory()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IResetPasswordForm>()

  // Some useful states for our component behavior
  // IsAction is used to control the disable of buttons to avoid multiple calls
  const [isAction, setIsAction] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  /**
   * Try to send the reset email.
   * @param data
   */
  const onPasswordReset = async (data: IResetPasswordForm) => {
    setError(undefined)
    setIsAction(true)

    try {
      await authService.sendResetEmail(data)
      // If we have a callback, call it
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      setError(err)
    } finally {
      setIsAction(false)
    }
  }

  const onBack = () => history.replace('/auth/login')

  return (
    <form onSubmit={handleSubmit(onPasswordReset)}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          fullWidth
          variant="outlined"
          error={!isUndefined(errors.email)}
          helperText={errors.email?.message}
          label="Email"
          {...register('email', {
            required: {
              value: true,
              message: t('errors.email.required'),
            },
            pattern: {
              value: Regex.Email,
              message: t('errors.email.invalid'),
            },
          })}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isAction}
        >
          {t('resetPassword.confirm')}
        </LoadingButton>

        <Button
          onClick={onBack}
          sx={{ marginTop: '10px' }}
          fullWidth
          size="large"
        >
          {t('resetPassword.back')}
        </Button>
      </Stack>
    </form>
  )
}
