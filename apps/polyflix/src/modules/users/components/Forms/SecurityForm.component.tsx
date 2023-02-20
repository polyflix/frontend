import { Visibility, VisibilityOff } from '@mui/icons-material'
import LoadingButton from '@mui/lab/LoadingButton'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { User } from '@types_/user.type'

import { UseroldService } from '@users/services/userold.service'
import { IUserPasswordForm } from '@users/types/users.type'

interface Props {
  user: User
  title: string
}

export const SecurityForm = ({ user, title }: Props) => {
  const userService = useInjection<UseroldService>(UseroldService)

  const { t } = useTranslation('auth')

  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IUserPasswordForm>()

  const password = useRef({})
  password.current = watch('password', '')

  const [isAction, setIsAction] = useState<boolean>(false)

  /**
   * The method called when the form is submitted.
   * @param data
   */
  const onSubmit = async (data: IUserPasswordForm) => {
    setIsAction(true)
    try {
      let u: IUserPasswordForm & User = { ...data, ...user }
      await userService.updateUser(u)
    } finally {
      setIsAction(false)
    }
  }

  return (
    <Paper elevation={0}>
      <Typography sx={{ mb: 2 }} align="left" variant={'h3'}>
        {title}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type={showCurrentPassword ? 'text' : 'password'}
              label={t('fields.password.label.current')}
              {...register('currentPassword', {
                required: {
                  value: true,
                  message: t('fields.password.required'),
                },
              })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                autoComplete: 'current-password',
              }}
              error={Boolean(errors.currentPassword)}
              helperText={errors.currentPassword?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type={showNewPassword ? 'text' : 'password'}
              label={t('fields.password.label.new')}
              {...register('password', {
                required: {
                  value: true,
                  message: t('fields.password.required'),
                },
              })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                autoComplete: 'new-password',
              }}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="password"
              label={t('fields.password.label.confirm')}
              {...register('passwordConfirm', {
                required: {
                  value: true,
                  message: t('fields.password.required'),
                },
                validate: (value) =>
                  value === password.current ||
                  t<string>('fields.password.noMatch'),
              })}
              error={Boolean(errors.passwordConfirm)}
              helperText={errors.passwordConfirm?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isAction}
            >
              {t('profile.actions.update', { ns: 'users' })}
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}
