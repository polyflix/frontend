import LoadingButton from '@mui/lab/LoadingButton'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { Regex } from '@constants/regex.constant'

import { User } from '@users/models/user.model'
import { UseroldService } from '@users/services/userold.service'

interface Props {
  user: User
  title: string
}

/**
 * User deletion component form
 * @param user
 * @param title
 * @constructor
 */
export const AdvancedForm = ({ user, title }: Props) => {
  const userService = useInjection<UseroldService>(UseroldService)

  const { t } = useTranslation('auth')

  const [isAction, setIsAction] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string
  }>()

  /**
   * The method called when the form is submitted.
   */
  const onSubmit = async () => {
    setIsAction(true)
    try {
      await userService.delete(user)
    } finally {
      setIsAction(false)
    }
  }

  return (
    <Paper elevation={0}>
      <Typography sx={{ mb: 2 }} align="left" variant={'h3'}>
        {title}
      </Typography>
      <Typography sx={{ mb: 2 }} variant={'body1'}>
        {t('profile.hints.delete', { ns: 'users' })}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
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
                validate: (value) =>
                  value === user.email || t<string>('fields.email.noMatch'),
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
              {t('profile.actions.delete', { ns: 'users' })}
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}
