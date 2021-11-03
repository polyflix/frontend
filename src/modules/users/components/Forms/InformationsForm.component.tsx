import LoadingButton from '@mui/lab/LoadingButton'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { Regex } from '@core/constants/regex.constant'

import { User } from '@users/models/user.model'
import { UserService } from '@users/services/user.service'

interface Props {
  user: User
  title: string
}

export const InformationsForm = ({ user, title }: Props) => {
  const userService = useInjection<UserService>(UserService)

  const { t } = useTranslation('auth')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    defaultValues: {
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      profilePicture: user?.profilePicture,
    },
  })

  const [isAction, setIsAction] = useState<boolean>(false)

  /**
   * The method called when the form is submitted.
   * @param data
   */
  const onSubmit = async (data: User) => {
    setIsAction(true)
    try {
      let u: User = data
      u.id = user.id
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
          <Grid item xs={12} md={6}>
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
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('fields.lastName.label')}
              {...register('lastName', {
                required: {
                  value: true,
                  message: t('fields.lastName.required'),
                },
              })}
              error={Boolean(errors.lastName)}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12}>
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
