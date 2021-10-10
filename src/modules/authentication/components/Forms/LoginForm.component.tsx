import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { Regex } from '@core/constants/regex.constant'

import { AuthService } from '@auth/services/auth.service'
import { ILoginForm } from '@auth/types/form.type'

/**
 * This is the Login form component.
 * It handles the user login and redirection behavior.
 * @returns
 */
export const LoginForm = () => {
  const authService = useInjection<AuthService>(AuthService)

  const { t } = useTranslation('auth')

  const history = useHistory<any>()
  const location = useLocation<any>()

  // A boolean to track if the user has activated the password visibility
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // A state to handle errors for the login.
  // We cannot use the redux state for that, because otherwise the error can be retrieved in
  // other auth components, and this behavior can provide some side effects.
  const [error, setError] = useState<string>()
  const [isAction, setIsAction] = useState<boolean>(false)

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ILoginForm>()

  // If we have a state from a potentially redirection,
  // We store it because we wants to redirect the user on the page he visited before being logged in.
  const { from } = location.state || { from: { pathname: '/' } }

  /**
   * The method called when the form is submitted. It try to login the user and after redirect it from the page visited,
   * if there is an error, it trigger the display of the error in the UI.
   * @param body
   */
  const onLogin = async (body: ILoginForm) => {
    setError(undefined)
    setIsAction(true)
    try {
      await authService.login(body)
      // redirect if the login succedeed
      history.push(from)
    } catch (err: any) {
      setError(err)
    } finally {
      setIsAction(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onLogin)}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          fullWidth
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
          variant="outlined"
          error={errors.email !== undefined}
          helperText={errors.email?.message}
          label="Email"
        />

        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          label="Password"
          {...register('password')}
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

        <Link
          component={RouterLink}
          to="/auth/forgotten-password"
          underline="hover"
        >
          {t('signIn.links.resetPassword')}
        </Link>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isAction}
        >
          {t('signIn.confirm')}
        </LoadingButton>
      </Stack>
    </form>
  )
}
