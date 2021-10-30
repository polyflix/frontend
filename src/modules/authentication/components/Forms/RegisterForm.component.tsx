import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { Regex } from '@core/constants/regex.constant'
import { buildPasswordValidation } from '@core/helpers/form.helper'

import { AuthService } from '@auth/services/auth.service'
import { IRegisterForm } from '@auth/types/form.type'

export const RegisterForm = () => {
  const authService = useInjection<AuthService>(AuthService)
  const history = useHistory()
  const { t } = useTranslation('auth')

  // Some useful states for our component behavior
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isAction, setIsAction] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<IRegisterForm>()

  const password = useRef({})
  password.current = watch('password', '')

  const onRegister = async (data: IRegisterForm) => {
    setError(undefined)
    setIsAction(true)
    try {
      await authService.register(data)
      history.replace('/')
    } catch (err: any) {
      setError(err)
    } finally {
      setIsAction(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onRegister)}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label={t('fields.firstName.label')}
            {...register('firstName', {
              required: {
                value: true,
                message: t('fields.firstName.required'),
              },
            })}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
          />

          <TextField
            fullWidth
            label={t('fields.lastName.label')}
            {...register('lastName', {
              required: {
                value: true,
                message: t('fields.lastName.required'),
              },
            })}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
          />
        </Stack>

        <TextField
          fullWidth
          label={t('fields.email.label')}
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
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />

        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          label={t('fields.password.label.new')}
          {...register('password', buildPasswordValidation())}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />

        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          label={t('fields.password.label.confirm')}
          {...register('passwordConfirm', {
            ...buildPasswordValidation(),
            validate: (value) =>
              value === password.current ||
              (t('fields.password.noMatch') as string),
          })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={Boolean(errors.passwordConfirm)}
          helperText={errors.passwordConfirm?.message}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isAction}
        >
          {t('signUp.confirm')}
        </LoadingButton>
      </Stack>
    </form>
  )
}
