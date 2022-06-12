import { AdminCertificationForm } from '@admin/types/certification.type'
import { LoadingButton } from '@mui/lab'
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { isUndefined } from 'lodash'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
} from '@core/helpers/form.helper'
import { SnackbarService } from '@core/services/snackbar.service'

import { Certification } from '@certifications/models/certification.model'
import {
  useAddCertificationMutation,
  useUpdateCertificationMutation,
} from '@certifications/services/certification.service'
import { ICertificationForm } from '@certifications/types/form.type'

interface Props {
  certification?: Certification
  onClose: () => void
}

export const EditCertificationModal = ({ certification, onClose }: Props) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const [open, setOpen] = useState<boolean>(false)
  const [createCertifications] = useAddCertificationMutation()
  const [updateCertifications] = useUpdateCertificationMutation()
  const { t } = useTranslation('administration')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminCertificationForm>({
    defaultValues: {
      certificationID: certification?.certificationID || undefined,
      name: certification?.name || '',
    },
  })

  useEffect(() => setOpen(!isUndefined(certification)), [certification])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  const onSubmit = async (data: AdminCertificationForm) => {
    const body = {
      ...certification,
      ...data,
    }
    let error = null
    if (certification?.certificationID) {
      error = (await updateCertifications({
        id: certification!.certificationID,
        body: body as Certification,
      })) as any
    } else {
      delete body.certificationID
      error = await createCertifications(body as ICertificationForm)
    }

    if (error) {
      snackbarService.createSnackbar(error.data.message, { variant: 'error' })
    } else {
      handleClose()
    }
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
                  <Grid item xs={12}>
                    <Stack spacing={2} direction="row" alignItems="center">
                      <Stack>
                        {certification?.certificationID ? (
                          <Typography variant="h4">
                            ID: {certification?.certificationID}
                          </Typography>
                        ) : (
                          <Typography variant="h4">
                            {t('certifications.form.actions.create')}
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={Boolean(errors.name)}
                      helperText={errors.name?.message}
                      label={t('certifications.form.labels.name')}
                      {...getCommonTextFieldProps()}
                      {...register('name', {
                        required: {
                          value: true,
                          message: t(
                            'certifications.form.errors.name.required'
                          ),
                        },
                      })}
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
