import { StyledMenuItem } from '@admin/components/groups/GroupForm/GroupForm.style'
import { GroupSelectItem } from '@admin/components/groups/GroupForm/GroupSelectItem.component'
import { LoadingButton } from '@mui/lab'
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  Modal,
  Stack,
  TextField,
} from '@mui/material'
import { capitalize, isUndefined } from 'lodash'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { getCommonSubmitButtonProps } from '@core/helpers/form.helper'

import { User } from '@users/models/user.model'
import { useGetUsersQuery } from '@users/services/user.service'

import { Certification } from '@certifications/models/certification.model'
import { useAddCertificateMutation } from '@certifications/services/certification.service'
import { ICertificateForm } from '@certifications/types/form.type'

interface Props {
  certification?: Certification
  onClose: () => void
  refetch: () => void
}

export const CreateCertificateModal = ({
  certification,
  onClose,
  refetch,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const [createCertificate] = useAddCertificateMutation()
  const { t } = useTranslation('administration')

  const { data: users } = useGetUsersQuery({
    page: 0,
    pageSize: 9999,
  })

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<{ user: string }>({
    defaultValues: {
      user: '',
    },
  })

  useEffect(() => setOpen(!isUndefined(certification)), [certification])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  const displayUserById = (id: string) => {
    const user = users?.data.find((u: User) => u.id === id)
    if (!user) {
      return ''
    }
    return capitalize(`${user.firstName} ${user.lastName}`)
  }

  const onSubmit = async (data: { user: string }) => {
    const body = {
      userId: data.user,
      certificationId: certification!.id,
    }

    await createCertificate(body as ICertificateForm)

    refetch()
    handleClose()
  }

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
                  <Grid item md={6} xs={12}>
                    <Controller
                      control={control}
                      name="user"
                      rules={{ required: true }}
                      render={({ field: controllerField }) => (
                        <Autocomplete
                          {...controllerField}
                          options={users?.data.map((u) => u.id) || []}
                          getOptionLabel={(option) => displayUserById(option)}
                          onChange={(e, options) =>
                            setValue('user', options!, {
                              shouldValidate: true,
                            })
                          }
                          renderOption={(props, option) => (
                            <StyledMenuItem
                              key={option}
                              value={option}
                              sx={{ mx: 1 }}
                              {...props}
                            >
                              <GroupSelectItem
                                user={
                                  users?.data.find(
                                    (u: User) => u.id === option
                                  )!
                                }
                              />
                            </StyledMenuItem>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(errors?.user)}
                              placeholder={t(
                                'certifications.page.certificate.user'
                              )}
                              helperText={
                                Boolean(errors?.user) &&
                                t(
                                  'groups.forms.create-update.validation.required'
                                )
                              }
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack justifyContent="end" spacing={2} direction="row">
                      <Button onClick={handleClose} variant="outlined">
                        {t('certifications.form.actions.close')}
                      </Button>
                      <LoadingButton
                        {...getCommonSubmitButtonProps(isSubmitting, false)}
                      >
                        {t('certifications.form.actions.save')}
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
