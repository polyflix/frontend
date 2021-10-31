import { LoadingButton } from '@mui/lab'
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { isUndefined } from 'lodash'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { Regex } from '@core/constants/regex.constant'
import { SnackbarService } from '@core/services/snackbar.service'

import { AuthService } from '@auth/services/auth.service'
import { IRequestResetPasswordForm } from '@auth/types/form.type'

/**
 * This is the form used to reset the user password.
 * @returns
 */
export const RequestPasswordResetForm = () => {
  const authService = useInjection<AuthService>(AuthService)
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const { t } = useTranslation('auth')

  const history = useHistory()

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IRequestResetPasswordForm>()
  const [error, setError] = useState<string>()

  /**
   * Try to send the reset email.
   * @param data
   */
  const onPasswordReset = async (data: IRequestResetPasswordForm) => {
    setError(undefined)

    try {
      await authService.sendResetEmail(data)
      snackbarService.createSnackbar(t('resetPassword.request.sent'), {
        variant: 'success',
      })
      history.push('/auth/login')
    } catch (err: any) {
      setError(err)
    } finally {
      reset()
    }
  }

  const onBack = () => history.replace('/auth/login')

  return (
    <>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          {t('resetPassword.request.title')}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {t('resetPassword.request.subtitle')}
        </Typography>
      </Box>
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
                message: t('fields.email.required'),
              },
              pattern: {
                value: Regex.Email,
                message: t('fields.email.invalid'),
              },
            })}
            disabled={isSubmitting}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('resetPassword.request.confirm')}
          </LoadingButton>

          <Button
            onClick={onBack}
            sx={{ marginTop: '10px' }}
            fullWidth
            size="large"
          >
            {t('resetPassword.request.footer')}
          </Button>
        </Stack>
      </form>
    </>
  )
}
