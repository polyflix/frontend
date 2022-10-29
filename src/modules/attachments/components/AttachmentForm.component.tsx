import { LoadingButton } from '@mui/lab'
import { Grid, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { Endpoint } from '@core/constants/endpoint.constant'
import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
} from '@core/helpers/form.helper'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'

import { useAuth } from '@auth/hooks/useAuth.hook'

import {
  Attachment,
  AttachmentType,
} from '@attachments/models/attachment.model'
import {
  useCreateAttachmentMutation,
  useUpdateAttachmentMutation,
} from '@attachments/services/attachment.service'
import { IAttachmentForm } from '@attachments/types/form.type'

type AttachmentFormProps = {
  attachment?: Attachment
  closeOnSubmit: () => void
}

export const AttachmentForm = ({
  attachment,
  closeOnSubmit,
}: AttachmentFormProps) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const { user } = useAuth()

  // Get our mutations
  const [createAttachment] = useCreateAttachmentMutation()
  const [updateAttachent] = useUpdateAttachmentMutation()

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<IAttachmentForm>({
    defaultValues: {
      title: attachment?.title,
      url: attachment?.url,
      description: attachment?.description,
      extension: attachment?.extension,
      type: attachment?.type,
    },
  })

  // Called on form submission
  const onSubmit = async (data: IAttachmentForm) => {
    const attachmentData: IAttachmentForm = {
      ...data,
      userId: user?.id || '',
      type: AttachmentType.External,
    }

    try {
      await (attachment
        ? updateAttachent({ id: attachment.id, body: attachmentData })
        : createAttachment(attachmentData)
      ).unwrap()

      // Display the success snackbar
      snackbarService.notify(
        attachment ? CrudAction.UPDATE : CrudAction.CREATE,
        Endpoint.Attachments
      )
      clearErrors()
      closeOnSubmit()
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }

  const { t } = useTranslation('attachments')

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="AttachmentForm">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
            label={t('forms.create-update.placeholder.title')}
            {...getCommonTextFieldProps()}
            {...register('title', {
              required: {
                value: true,
                message: t('forms.create-update.validation.title.required'),
              },
            })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            error={Boolean(errors.url)}
            helperText={errors.url?.message}
            inputProps={{ pattern: '^https?://.*$' }}
            label={t('forms.create-update.placeholder.url')}
            {...getCommonTextFieldProps()}
            {...register('url', {
              required: {
                value: true,
                message: t('forms.create-update.validation.url.required'),
              },
              pattern: {
                value:
                  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i,
                message: t('forms.create-update.validation.url.pattern'),
              },
            })}
          />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            {...getCommonSubmitButtonProps(isSubmitting)}
            form="AttachmentForm"
          >
            {t(
              `forms.create-update.placeholder.submit.${
                attachment ? 'update' : 'create'
              }`
            )}
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  )
}
