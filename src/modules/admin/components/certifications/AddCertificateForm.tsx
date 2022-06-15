import { TextFields } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Button, Grid, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
} from '@core/helpers/form.helper'

import { Certification } from '@certifications/models/certification.model'
import { useAddCertificateMutation } from '@certifications/services/certification.service'
import { ICertificateForm } from '@certifications/types/form.type'

interface Props {
  certification?: Certification
}

export interface AddCertificationForm {
  certificationId?: string
  userId?: string
}

export const AddCertificateForm = ({ certification }: Props) => {
  const { t } = useTranslation('administration')
  const [addCertificate] = useAddCertificateMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddCertificationForm>({
    defaultValues: {
      certificationId: certification?.id || undefined,
      userId: 'b236b57f-5552-49bb-bf36-b35e541d2497',
    },
  })

  const onSubmit = async (data: AddCertificationForm) => {
    console.log(data)
    const body = {
      ...data,
    }
    let error = null
    const updateResult = await addCertificate(body as ICertificateForm)
    console.log('updateResult:', updateResult)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid item xs={12}>
        <TextField
          label={t('certifications.form.labels.userid')}
          {...getCommonTextFieldProps()}
          {...register('userId', {
            required: {
              value: true,
              message: t('certifications.form.errors.userid.required'),
            },
          })}
        />
      </Grid>
      <Grid item xs={12}>
        <Button {...getCommonSubmitButtonProps(isSubmitting, false)}>
          {t('certifications.form.actions.addUser')}
        </Button>
      </Grid>
    </form>
  )
}
