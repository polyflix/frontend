import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { buildPasswordValidation } from '@core/helpers/form.helper'
import { SnackbarService } from '@core/services/snackbar.service'

import { AuthService } from '@auth/services/auth.service'
import { IResetPasswordForm } from '@auth/types/form.type'

export type ResetPasswordFormProps = {
  email: string
  token: string
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  email,
  token,
}) => {
  const authService = useInjection<AuthService>(AuthService)
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const { t } = useTranslation('auth')
  const [togglePasswordView, setTogglePasswordView] = useState(false)

  const history = useHistory()

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<IResetPasswordForm>({
    defaultValues: {
      email,
      token,
    },
    reValidateMode: 'onChange',
  })
  const [error, setError] = useState<string>()

  const onSubmitForm = async (data: IResetPasswordForm) => {
    setError(undefined)
    const returnedContent = await authService.resetPassword(data)

    if (returnedContent) {
      setError(returnedContent)
    } else {
      snackbarService.createSnackbar(t('fields.password.updated'), {
        variant: 'success',
      })
      history.push('/auth/login')
    }
  }
  return (
    <>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          {t('resetPassword.resetForm.title')}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {t('resetPassword.resetForm.subtitle')}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            disabled
            style={{ display: 'none' }}
            {...register('token')}
          />
          <TextField
            fullWidth
            variant="outlined"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            label="Email"
            disabled
            {...register('email')}
          />
          <TextField
            fullWidth
            type={togglePasswordView ? 'text' : 'password'}
            label={t('fields.password.label.new')}
            {...register('password', buildPasswordValidation())}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setTogglePasswordView(!togglePasswordView)}
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              autoComplete: 'new-password',
            }}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            variant="outlined"
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            type={togglePasswordView ? 'text' : 'password'}
            label={t('fields.password.label.confirm')}
            {...register('passwordRepeat', {
              ...buildPasswordValidation(),
              validate: (value) =>
                getValues('password') === value
                  ? true
                  : `${t('fields.password.noMatch')}`,
            })}
            InputProps={{
              autoComplete: 'new-password',
            }}
            error={Boolean(errors.passwordRepeat)}
            helperText={errors.passwordRepeat?.message}
            disabled={isSubmitting}
            variant="outlined"
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('resetPassword.resetForm.confirm')}
          </LoadingButton>
        </Stack>
      </form>

      {/* FOOTER TEXT REDIRECTING TO LOG IN PAGE */}
      <Button
        onClick={() => history.push('/auth/login')}
        sx={{ marginTop: '10px' }}
        fullWidth
        size="large"
      >
        {t('resetPassword.resetForm.footer')}
      </Button>
      {/* END FOOTER TEXT */}
    </>
  )
}
