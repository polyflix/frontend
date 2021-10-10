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
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { AuthService } from '@auth/services/auth.service'
import { IRegisterForm } from '@auth/types/form.type'

export const RegisterForm = () => {
  const authService = useInjection<AuthService>(AuthService)
  const history = useHistory()

  // Some useful states for our component behavior
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isAction, setIsAction] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IRegisterForm>()

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
            {...register('firstName', {
              required: 'The first name is required',
            })}
            fullWidth
            label="First Name"
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
          />

          <TextField
            {...register('lastName', {
              required: 'The last name is required',
            })}
            fullWidth
            label="Last Name"
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
          />
        </Stack>

        <TextField
          {...register('email', {
            required: 'The email is required',
          })}
          fullWidth
          label="Email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
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

        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          label="Password confirm"
          {...register('passwordConfirm')}
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

        {error && <Alert severity="error">{error}</Alert>}

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isAction}
        >
          Register
        </LoadingButton>
      </Stack>
    </form>
  )
}
