import { Delete } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { Icon } from '@core/components/Icon/Icon.component'
import { StatusSelector } from '@core/components/StatusSelector/StatusSelector.component'
import { VisibilitySelector } from '@core/components/VisibilitySelector/VisibilitySelector.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
} from '@core/helpers/form.helper'
import { Visibility } from '@core/models/content.model'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'

import { Collection } from '@collections/models/collection.model'
import {
  useAddCollectionMutation,
  useUpdateCollectionMutation,
} from '@collections/services/collection.service'
import { ICollectionForm } from '@collections/types/form.type'

import { ElementModal } from './ElementModal/ElementModal.component'

interface Props {
  collection?: Collection
  isUpdate: boolean
}

export const CollectionForm = ({ collection, isUpdate }: Props) => {
  const [openElementModal, setOpenElementModal] = useState(false)
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const { t } = useTranslation('collections')

  const [createCollection] = useAddCollectionMutation()
  const [updateCollection] = useUpdateCollectionMutation()

  const history = useHistory()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ICollectionForm>({
    defaultValues: {
      name: collection?.name,
      description: collection?.description,
      draft: collection?.draft || true,
      visibility: collection?.visibility || Visibility.PUBLIC,
      elements: collection?.elements,
    },
  })

  const fieldArray = useFieldArray({
    control,
    name: 'elements',
  })
  const { fields, remove } = fieldArray

  const onSubmit = async (data: ICollectionForm) => {
    // Need to send only element id
    const mappedData = {
      ...data,
      elements: fields.map((element) => element.id),
    }

    try {
      await (isUpdate
        ? updateCollection({
            slug: collection!.slug,
            body: mappedData as unknown as ICollectionForm,
          })
        : createCollection(mappedData as unknown as ICollectionForm)
      ).unwrap()

      snackbarService.notify(
        isUpdate ? CrudAction.UPDATE : CrudAction.CREATE,
        Endpoint.Collections
      )
      history.push('/users/profile/collections')
    } catch (e: any) {
      snackbarService.createSnackbar(e.data.statusText, { variant: 'error' })
    } finally {
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <TextField
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          label={t('forms.create-update.fields.name.label')}
          {...getCommonTextFieldProps()}
          {...register('name', {
            required: {
              value: true,
              message: t('forms.create-update.fields.name.errors.required'),
            },
          })}
        />
        <TextField
          error={Boolean(errors.description)}
          helperText={errors.description?.message}
          multiline
          rows={4}
          label={t('forms.create-update.fields.description.label')}
          {...getCommonTextFieldProps()}
          {...register('description', {
            required: {
              value: true,
              message: t(
                'forms.create-update.fields.description.errors.required'
              ),
            },
          })}
        />

        <Divider />

        <Stack spacing={1}>
          <Typography
            variant="h5"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {t('forms.create-update.fields.elements.label')}
            <Tooltip
              title={t<string>(
                'forms.create-update.fields.elements.tooltips.addElements'
              )}
            >
              <IconButton
                onClick={() => setOpenElementModal(true)}
                color="primary"
              >
                <Icon name="carbon:add" size={30} />
              </IconButton>
            </Tooltip>
          </Typography>
          {fields.length ? (
            fields.map((item, i: number) => (
              <List key={i}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="error"
                      aria-label="delete"
                      onClick={() => remove(i)}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={item.thumbnail} />
                  </ListItemAvatar>
                  <ListItemText primary={item.name} />
                </ListItem>
              </List>
            ))
          ) : (
            <Alert severity="warning">
              {t('forms.create-update.fields.elements.errors.noData')}
            </Alert>
          )}
          <ElementModal
            open={openElementModal}
            onClose={() => setOpenElementModal(false)}
            fieldArray={fieldArray}
          />
        </Stack>

        <Divider />

        <VisibilitySelector
          value={watch('visibility')!}
          onChange={(value: Visibility) => setValue('visibility', value)}
        />
        <StatusSelector
          value={watch('draft')!}
          onChange={(value: boolean) => setValue('draft', value)}
        />
        <LoadingButton {...getCommonSubmitButtonProps(isSubmitting)}>
          {t(
            `forms.create-update.actions.submit.${
              isUpdate ? 'update' : 'create'
            }`
          )}
        </LoadingButton>
      </Stack>
    </form>
  )
}
