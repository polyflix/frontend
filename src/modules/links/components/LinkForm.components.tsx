import { LoadingButton } from '@mui/lab'
import { Stack, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { Endpoint } from '@core/constants/endpoint.constant'
import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
} from '@core/helpers/form.helper'
import { Visibility } from '@core/models/content.model'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'

import { Link } from '@links/models/link.model'
import {
  useAddLinkMutation,
  useUpdateLinkMutation,
} from '@links/services/link.service'
import { ILinkForm } from '@links/types/form.type'

interface Props {
  link?: Link
  isUpdate: boolean
}

export const LinkForm = ({ link, isUpdate }: Props) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const { t } = useTranslation('links')

  const history = useHistory()

  // Get our mutations
  const [createLink] = useAddLinkMutation()
  const [updateLink] = useUpdateLinkMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILinkForm>({
    defaultValues: {
      visibility: link?.visibility || Visibility.PUBLIC,
      name: link?.name,
      description: link?.description,
      url: link?.url,
      draft: link?.draft || false,
    },
  })

  // Called on form submission
  const onSubmit = async (data: ILinkForm) => {
    const linkData: ILinkForm = {
      ...data,
    }

    try {
      await (isUpdate
        ? updateLink({ id: link!.id || '', body: linkData })
        : createLink(linkData)
      ).unwrap()

      // Display the success snackbar
      snackbarService.notify(
        isUpdate ? CrudAction.UPDATE : CrudAction.CREATE,
        Endpoint.Links
      )

      history.push('/users/profile')
    } catch (e: any) {
      snackbarService.createSnackbar(e.data.statusText, { variant: 'error' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography sx={{ mb: 3 }} variant="h4">
        {t('forms.create-update.title.metadata')}
      </Typography>
      <Stack spacing={4}>
        <Stack direction="row" spacing={2}>
          <TextField
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            label={t('forms.create-update.placeholder.name')}
            {...getCommonTextFieldProps()}
            {...register('name', {
              required: {
                value: true,
                message: t('forms.create-update.validation.name.required'),
              },
            })}
          />
          <TextField
            error={Boolean(errors.url)}
            helperText={errors.url?.message}
            label={t('forms.create-update.placeholder.url')}
            {...getCommonTextFieldProps()}
            {...register('url', {
              required: {
                value: true,
                message: t('forms.create-update.validation.url.required'),
              },
            })}
          />
        </Stack>
        <Stack>
          <TextField
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
            multiline
            label={t('forms.create-update.placeholder.description')}
            {...getCommonTextFieldProps()}
            {...register('description', {
              required: {
                value: true,
                message: t(
                  'forms.create-update.validation.description.required'
                ),
              },
            })}
          />
        </Stack>

        <LoadingButton {...getCommonSubmitButtonProps(isSubmitting)}>
          {t(
            `forms.create-update.placeholder.submit.${
              isUpdate ? 'update' : 'create'
            }`
          )}
        </LoadingButton>
      </Stack>
    </form>
  )
}
