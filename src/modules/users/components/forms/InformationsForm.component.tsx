import LoadingButton from '@mui/lab/LoadingButton'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { generateFilename } from '@core/helpers/file.helper'

import { useInjection } from '@polyflix/di'

import { Regex } from '@core/constants/regex.constant'

import { User } from '@users/models/user.model'
import { UserService } from '@users/services/user.service'
import { Dropzone } from '@core/components/Dropzone/Dropzone.component'
import { MinioService } from '@core/services/minio.service'
import { SnackbarService } from '@core/services/snackbar.service'

interface Props {
  user: User
  title: string
}

export const InformationsForm = ({ user, title }: Props) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const userService = useInjection<UserService>(UserService)
  const minioService = useInjection<MinioService>(MinioService)

  const { t } = useTranslation('auth')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<User>({
    defaultValues: {
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      profilePicture: user?.profilePicture,
    },
  })

  // This should contains our profile image file when the user upload the image
  const [profilePictureFile, setProfilePictureFile] = useState<File>()

  const profilePicture = watch('profilePicture')



  // Here we define a simple effect which will
  // clear the user profile picture file if the user put a link into it's
  // picture URL field.
  useEffect(() => {
    if (profilePictureFile) {
      setProfilePictureFile(undefined)
    }
  }, [profilePicture])

  interface PresignedURL {
    tokenAccess: string
  }

  type MinioFile = { presignedUrl: PresignedURL; file: File }

  const getFile = (files: MinioFile[], field: keyof User) => {
    return files.find((file) => file.getField() === field);
  }

  /**
   * The method called when the form is submitted.
   * @param data
   */
  const onSubmit = async (data: User) => {

    try {
      let u: User = data
      u.id = user.id

        if (profilePictureFile) {
          const profilePictureMinioFile: MinioFile = {
            file: profilePictureFile,
            presignedUrl:

          }
          const uploadedFiles = await minioService.upload([profilePictureMinioFile]);
          const attributes: (keyof User)[] = ["profilePicture"];
          attributes.forEach((attr) => {
            const url = getFile(uploadedFiles, attr)?.getFileURL();
            if (url) data = { ...data, [attr]: url };
          })
        }

      await userService.updateUser(u)
    } catch (e: any) {
      snackbarService.createSnackbar(e.data.statusText, { variant: 'error' })
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
            <Dropzone
              disabled={Boolean(profilePictureFile)}
               onAcceptedFiles={([file]) => setProfilePictureFile(file)}
              text={t('fields.profilePicture.label.upload')}
              hint
              accept="image/*"
            />
          </Grid>
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
              loading={isSubmitting}
            >
              {t('profile.actions.update', { ns: 'users' })}
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}
