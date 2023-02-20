import { IGroupForm } from '@admin/types/form.type'
import { LoadingButton } from '@mui/lab'
import { CircularProgress, Grid, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
} from '@core/helpers/form.helper'
import { SnackbarService } from '@services/snackbar.service'
import { CrudAction } from '@types_/http.type'

import { Certification } from '@certifications/models/certification.model'
import {
  useAddCertificationMutation,
  useUpdateCertificationMutation,
} from '@certifications/services/certification.service'
import { ICertificationForm } from '@certifications/types/form.type'

interface Props {
  certification?: Certification
  i18nKey?: string
  isUpdate: boolean
}

export const CertificationForm = ({ certification, isUpdate }: Props) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const [createCertifications] = useAddCertificationMutation()
  const [updateCertifications] = useUpdateCertificationMutation()

  const { t } = useTranslation('administration')

  const history = useHistory()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ICertificationForm>({
    defaultValues: {
      name: certification?.name || '',
    },
  })

  const onSubmit = async (data: IGroupForm) => {
    try {
      await (isUpdate
        ? updateCertifications({ id: certification!.id || '', body: data })
        : createCertifications(data)
      ).unwrap()

      snackbarService.notify(
        isUpdate ? CrudAction.UPDATE : CrudAction.CREATE,
        Endpoint.Certifications
      )

      history.push('/admin/certifications')
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }
  const isUserLoading = false
  const isUserFetching = false
  return (
    <>
      {isUserLoading || isUserFetching ? (
        <CircularProgress sx={{ mx: 'auto', display: 'block' }} />
      ) : (
        <Stack direction="column" spacing={2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                    label={t('certifications.form.labels.name')}
                    {...getCommonTextFieldProps()}
                    {...register('name', {
                      required: {
                        value: true,
                        message: `${t(
                          'certifications.form.errors.name.required'
                        )}.`,
                      },
                    })}
                  />
                </Grid>
              </Grid>
              <LoadingButton {...getCommonSubmitButtonProps(isSubmitting)}>
                {t(`certifications.form.actions.save`)}
              </LoadingButton>
            </Stack>
          </form>
        </Stack>
      )}
    </>
  )
}
