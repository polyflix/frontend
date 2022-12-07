import { AdminUserForm } from '@admin/models/user.model'
import { LoadingButton } from '@mui/lab'
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Chip,
  Fade,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { capitalize, isUndefined } from 'lodash'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
} from '@core/helpers/form.helper'
import { SnackbarService } from '@core/services/snackbar.service'
import { Role } from '@core/types/roles.type'

import { User } from '@users/models/user.model'
import { useUpdateUserMutation } from '@users/services/user.service'

interface Props {
  user?: User
  onClose: () => void
}

export const EditUserModal = ({ user, onClose }: Props) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const [open, setOpen] = useState<boolean>(false)
  const [updateUser] = useUpdateUserMutation()
  const { t } = useTranslation('administration')
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    control,
  } = useForm<AdminUserForm>({
    defaultValues: {
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
      avatar: user?.avatar,
      roles: user?.roles,
    },
  })

  useEffect(() => setOpen(!isUndefined(user)), [user])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  const onSubmit = async (data: AdminUserForm) => {
    const body = { ...user, ...data, roles: data.roles.map(capitalize) }
    const { error } = (await updateUser({
      id: user!.id,
      body: body as User,
    })) as any
    if (error) {
      snackbarService.createSnackbar(error.data.message, { variant: 'error' })
    } else {
      handleClose()
    }
  }

  const fullName = `${user?.firstName} ${user?.lastName}`

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            maxWidth: '700px',
            top: '50%',
            left: '50%',
            width: '100%',
            transform: 'translate(-50%, -50%)',
            p: { xs: 1, md: 2 },
          }}
        >
          <Box
            sx={{
              width: '100%',
              p: 2,
              borderRadius: 1,
              boxShadow: 10,
              bgcolor: 'background.paper',
            }}
          >
            <Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={2} direction="row" alignItems="center">
                      <Avatar
                        sx={{ width: 72, height: 72 }}
                        src={watch('avatar')}
                      />
                      <Stack>
                        <Typography variant="h4">{fullName}</Typography>
                        <Typography variant="caption">
                          UID : {user?.id}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      helperText={errors.lastName?.message}
                      label={t('users.page.panel.fields.email')}
                      disabled={true}
                      value={user?.email}
                      {...getCommonTextFieldProps()}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(errors.firstName)}
                      helperText={errors.firstName?.message}
                      label={t('users.form.labels.firstName')}
                      {...getCommonTextFieldProps()}
                      {...register('firstName', {
                        required: {
                          value: true,
                          message: t('users.form.errors.firstName.required'),
                        },
                      })}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(errors.lastName)}
                      helperText={errors.lastName?.message}
                      label={t('users.form.labels.lastName')}
                      {...getCommonTextFieldProps()}
                      {...register('lastName', {
                        required: {
                          value: true,
                          message: t('users.form.errors.lastName.required'),
                        },
                      })}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <TextField
                      error={Boolean(errors.username)}
                      helperText={errors.username?.message}
                      label={t('users.form.labels.username')}
                      {...getCommonTextFieldProps()}
                      {...register('username', {
                        required: {
                          value: true,
                          message: t('users.form.errors.username.required'),
                        },
                      })}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <TextField
                      error={Boolean(errors.avatar)}
                      helperText={errors.avatar?.message}
                      label="Avatar"
                      {...getCommonTextFieldProps()}
                      {...register('avatar')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      control={control}
                      name="roles"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="roles">Roles</InputLabel>
                          <Select
                            {...field}
                            input={<OutlinedInput label="Roles" />}
                            labelId="roles"
                            multiple
                            required
                            minRows={1}
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip
                                    variant="outlined"
                                    color="primary"
                                    key={value}
                                    label={value}
                                  />
                                ))}
                              </Box>
                            )}
                          >
                            {Object.values(Role).map((role) => (
                              <MenuItem key={role} value={role}>
                                {role}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack justifyContent="end" spacing={2} direction="row">
                      <Button onClick={handleClose} variant="outlined">
                        {t('users.form.actions.close')}
                      </Button>
                      <LoadingButton
                        {...getCommonSubmitButtonProps(isSubmitting, false)}
                      >
                        {t('users.form.actions.save')}
                      </LoadingButton>
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}
