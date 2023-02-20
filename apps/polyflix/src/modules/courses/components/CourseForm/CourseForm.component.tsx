import { Delete } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  Avatar,
} from '@mui/material'
import { isUndefined } from 'lodash'
import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

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

import { Course } from '@types_/resources/course.type'
import {
  useAddCourseMutation,
  useUpdateCourseMutation,
} from '@courses/services/course.service'
import { ICourseForm } from '@courses/types/form.type'

import { CourseFormattachedCollectionModal } from './CourseFormattachedCollectionModal/CourseFormattachedCollectionModal.component'

interface Props {
  course?: Course
}

export const CourseForm: React.FC<Props> = ({ course }) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const { t } = useTranslation('courses')
  const history = useHistory()

  const [openCollectionModal, setOpenCollectionModal] = useState(false)

  const [createCourseMutator] = useAddCourseMutation()
  const [updateCourseMutator] = useUpdateCourseMutation()

  const isUpdate = !isUndefined(course)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    control,
    setValue,
  } = useForm<ICourseForm>({
    defaultValues: {
      name: course?.name,
      draft: Boolean(course?.draft),
      visibility: course?.visibility || Visibility.PUBLIC,
      description: course?.description,
      content: course?.content,
      modules: course?.modules ?? [],
    },
  })

  // Collections linked to this form
  const modulesFieldArray = useFieldArray({
    control,
    name: 'modules',
    keyName: 'uniqueId',
  })

  const onSubmit = async (courseData: ICourseForm) => {
    const formatedData = {
      ...courseData,
      modules: courseData?.modules?.map((m) => m.id) || [],
    } as unknown as ICourseForm

    try {
      await (isUpdate
        ? updateCourseMutator({ slug: course.slug, body: formatedData })
        : createCourseMutator(formatedData)
      ).unwrap()

      snackbarService.notify(
        isUpdate ? CrudAction.UPDATE : CrudAction.CREATE,
        Endpoint.Courses
      )
      history.push(`/courses/explore`)
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Typography sx={{ mb: 3 }} variant="h4">
          {t('form.upsert.title.metadata')}
        </Typography>

        {isUpdate && (
          <TextField
            label={t('form.upsert.label.id')}
            disabled
            value={course?.slug}
          />
        )}

        <TextField
          error={Boolean(errors.name)}
          helperText={
            errors.name?.message ??
            t('form.upsert.helper.name', {
              count: 100,
            })
          }
          label={t('form.upsert.label.name')}
          disabled={isSubmitting}
          {...getCommonTextFieldProps()}
          {...register('name', {
            required: {
              value: true,
              message: t('form.upsert.error.requiredField', {
                field: t('form.upsert.fields.name'),
              }),
            },
            maxLength: {
              value: 100,
              message: t('form.upsert.error.maxLength', {
                count: 100,
              }),
            },
            minLength: {
              value: 1,
              message: t('form.upsert.error.minLength', {
                count: 1,
              }),
            },
          })}
        />

        <TextField
          error={Boolean(errors.description)}
          helperText={
            errors.description?.message ?? t('form.upsert.helper.description')
          }
          label={t('form.upsert.label.description')}
          disabled={isSubmitting}
          {...getCommonTextFieldProps()}
          {...register('description', {
            required: {
              value: true,
              message: t('form.upsert.error.requiredField', {
                field: t('form.upsert.fields.description'),
              }),
            },
            maxLength: {
              value: 256,
              message: t('form.upsert.error.maxLength', {
                count: 256,
              }),
            },
          })}
        />

        <TextField
          error={Boolean(errors.content)}
          multiline
          minRows={5}
          maxRows={40}
          disabled={isSubmitting}
          helperText={
            errors.content?.message ?? t('form.upsert.helper.content')
          }
          label={t('form.upsert.label.content')}
          {...getCommonTextFieldProps()}
          {...register('content', {
            required: {
              value: true,
              message: t('form.upsert.error.requiredField', {
                field: t('form.upsert.fields.content'),
              }),
            },
          })}
        />

        <Divider />

        <Typography sx={{ mb: 3 }} variant="h4">
          {t('form.upsert.title.collections')}
        </Typography>
        {modulesFieldArray.fields.length > 0 ? (
          <List>
            {modulesFieldArray.fields.map((collection, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    color="error"
                    aria-label="delete"
                    onClick={() => modulesFieldArray.remove(index)}
                  >
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>{collection.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={collection.name}
                  secondary={`${collection?.user?.firstName} ${collection?.user?.lastName}`} // TODO
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Alert severity="warning">
            {t('form.upsert.error.noModuleSelected')}
          </Alert>
        )}

        <Paper
          variant="outlined"
          sx={{
            p: 4,
            cursor: 'pointer',
            bgcolor: 'background.paper',
            '&:hover': {
              borderColor: (theme) => theme.palette.grey[700],
            },
          }}
        >
          <Stack
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            onClick={() => setOpenCollectionModal(true)}
          >
            <Icon size={30} name="carbon:add-alt" />
            <Typography sx={{ mt: 1 }} variant="body1">
              {t('form.upsert.addCollection')}
            </Typography>
          </Stack>

          <CourseFormattachedCollectionModal
            open={openCollectionModal}
            onClose={() => setOpenCollectionModal(false)}
            fieldArray={modulesFieldArray}
          />
        </Paper>

        <Divider />

        <Typography sx={{ mb: 3 }} variant="h4">
          {t('form.upsert.title.status')}
        </Typography>

        <VisibilitySelector
          value={watch('visibility')}
          onChange={(value: Visibility) => setValue('visibility', value)}
        />

        <StatusSelector
          value={watch('draft')}
          onChange={(value: boolean) => setValue('draft', value)}
        />

        <LoadingButton {...getCommonSubmitButtonProps(isSubmitting)}>
          {t(`form.upsert.submit`)}
        </LoadingButton>
      </Stack>
    </form>
  )
}
