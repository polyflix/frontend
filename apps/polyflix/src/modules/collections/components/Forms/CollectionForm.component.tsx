import { Delete } from '@mui/icons-material'
import { DatePicker, LoadingButton } from '@mui/lab'
import {
  Alert,
  Box,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { FieldArrayDragDropWrapper } from '@core/components/FieldArrayDragDropWrapper/FieldArrayDragDropWrapper.component'
import { Icon } from '@core/components/Icon/Icon.component'
import { StatusSelector } from '@core/components/StatusSelector/StatusSelector.component'
import { VisibilitySelector } from '@core/components/VisibilitySelector/VisibilitySelector.component'
import { Endpoint } from '@constants/endpoint.constant'
import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
} from '@core/helpers/form.helper'
import { Visibility } from '@types_/resources/content.type'
import { SnackbarService } from '@services/snackbar.service'
import { CrudAction } from '@types_/http.type'

import { CollectionDragDrop } from '@collections/CollectionDragElement/CollectionDragDrop.component'
import { Collection } from '@collections/models/collection.model'
import {
  useAddCollectionMutation,
  useUpdateCollectionMutation,
} from '@collections/services/collection.service'
import { ICollectionForm } from '@collections/types/form.type'

import { ElementModal } from './ElementModal/ElementModal.component'
import { LinkModal } from './LinkModal/LinkModal.component'

interface Props {
  collection?: Collection
  isUpdate: boolean
  allowRedirect?: boolean
  onSubmit?: (collectionId: string) => void
}

export const CollectionForm = ({
  collection,
  isUpdate,
  allowRedirect = true,
  onSubmit: emitOnSubmit,
}: Props) => {
  const [openLinkModal, setOpenLinkModal] = useState(false)
  const [openElementModal, setOpenElementModal] = useState(false)
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const { t } = useTranslation('collections')

  const [createCollection] = useAddCollectionMutation()
  const [updateCollection] = useUpdateCollectionMutation()

  const [collectionData, setCollectionData] = useState<Collection>()

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
      draft: Boolean(collection?.draft),
      visibility: collection?.visibility || Visibility.PUBLIC,
      elements: collection?.elements,
      passwords: collection?.passwords,
    },
  })

  const elements = useFieldArray({
    control,
    name: 'elements',
  })

  const passwords = useFieldArray({
    control,
    name: 'passwords',
  })

  const { fields } = elements

  const onSubmit = async (data: ICollectionForm) => {
    // Need to send only element id
    const mappedData = {
      ...data,
      elements: fields.map((element, index) => ({
        elementId: element.id,
        order: index,
      })),
      passwords: data.passwords.map(({ id, expiresAt, password, name }) => ({
        id,
        name,
        expiresAt,
        ...(password !== '' && { password }),
      })),
    }

    try {
      const col = await (isUpdate
        ? updateCollection({
            slug: collection!.slug,
            body: mappedData as unknown as ICollectionForm,
          })
        : createCollection(mappedData as unknown as ICollectionForm)
      ).unwrap()
      snackbarService.notify(
        isUpdate ? CrudAction.UPDATE : CrudAction.CREATE,
        Endpoint.Modules
      )
      if (col?.visibility === Visibility.PROTECTED) {
        setCollectionData(col)
        setOpenLinkModal(true)
      } else if (allowRedirect) {
        history.push('/users/profile/modules')
      }
      if (emitOnSubmit) {
        emitOnSubmit(col.id)
      }
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <LinkModal
        collection={collectionData}
        onClose={() => history.push('/users/profile/modules')}
        open={openLinkModal}
      />
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
                type="button"
                onClick={() => setOpenElementModal(true)}
                color="primary"
              >
                <Icon name="carbon:add" size={30} />
              </IconButton>
            </Tooltip>
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t('forms.create-update.fields.elements.hint')}
          </Typography>
          {fields.length > 0 ? (
            <FieldArrayDragDropWrapper
              dragDropId={'dragdrop-elements'}
              fieldArray={elements}
              Component={CollectionDragDrop}
            />
          ) : (
            <Alert severity="warning">
              {t('forms.create-update.fields.elements.errors.noData')}
            </Alert>
          )}
          <ElementModal
            open={openElementModal}
            onClose={() => setOpenElementModal(false)}
            fieldArray={elements}
          />
        </Stack>

        <Divider />

        <VisibilitySelector
          withProtected={true}
          value={watch('visibility')!}
          onChange={(value: Visibility) => {
            if (value === Visibility.PROTECTED) {
              passwords.append({
                name: dayjs().format('dd-mm-yyyy'),
                expiresAt: new Date(),
              })
            } else {
              passwords.remove()
            }
            setValue('visibility', value)
          }}
        />

        {watch('visibility') === Visibility.PROTECTED && (
          <Box>
            <Typography
              variant="h5"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {t('forms.create-update.fields.password.label')}
              <Tooltip
                title={t<string>(
                  'forms.create-update.fields.password.tooltips.addElements'
                )}
              >
                <IconButton
                  onClick={() =>
                    passwords.append({
                      name: dayjs().format('dd-mm-yyyy'),
                      expiresAt: new Date(),
                    })
                  }
                  color="primary"
                >
                  <Icon name="carbon:add" size={30} />
                </IconButton>
              </Tooltip>
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              <Trans
                i18nKey={'forms.create-update.fields.password.description'}
                ns={'collections'}
              />
            </Typography>
            <Stack sx={{ my: 3 }} spacing={3}>
              {passwords.fields.map((password, j) => {
                return (
                  <Stack key={j} direction="row" spacing={2}>
                    <TextField
                      label={t('forms.create-update.fields.password.name')}
                      {...register(`passwords.${j}.name`)}
                      {...getCommonTextFieldProps()}
                    />
                    <TextField
                      label={t('forms.create-update.fields.password.password')}
                      type="password"
                      {...register(`passwords.${j}.password`)}
                      {...getCommonTextFieldProps()}
                    />
                    <DatePicker
                      onChange={(date) =>
                        setValue(`passwords.${j}.expiresAt`, date || new Date())
                      }
                      label={t('forms.create-update.fields.password.expiresAt')}
                      value={watch(`passwords.${j}.expiresAt`)}
                      disablePast
                      renderInput={(params) => (
                        <TextField fullWidth {...params} />
                      )}
                    />
                    <IconButton
                      edge="end"
                      disabled={j === 0}
                      color="error"
                      aria-label="delete"
                      onClick={() => passwords.remove(j)}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                )
              })}
            </Stack>
          </Box>
        )}

        <Divider />

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
