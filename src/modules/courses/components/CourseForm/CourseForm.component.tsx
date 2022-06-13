import { LoadingButton } from '@mui/lab'
import {
  Box,
  Divider,
  Fade,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import { isUndefined } from 'lodash'
import React, { useCallback, useState } from 'react'
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

import { CollectionCard } from '@collections/components/CollectionCard/CollectionCard.component'
import { Collection } from '@collections/models/collection.model'

import { LinkCollectionSpotlight } from '@courses/components/LinkCollectionSpotlight/LinkCollectionSpotlight.component'
import { Course } from '@courses/models/course.model'
import {
  useAddCourseMutation,
  useUpdateCourseMutation,
} from '@courses/services/course.service'
import { ICourseForm } from '@courses/types/form.type'

interface Props {
  course?: Course
}

export const CourseForm: React.FC<Props> = ({ course }) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const { t } = useTranslation('courses')
  const history = useHistory()

  // Collection selection modal
  const [openCollectionModal, setOpenCollectionModal] = useState(false)
  const [storedCollections, setStoredCollections] = useState<Collection[]>(
    course?.modules ?? []
  )
  const appendStoredCollections = useCallback(
    (collection: Collection) => {
      if (storedCollections.find((item) => item.id === collection.id)) return

      setStoredCollections([...storedCollections, collection])
    },
    [storedCollections]
  )

  const [createCourseMutator] = useAddCourseMutation()
  const [updateCourseMutator] = useUpdateCourseMutation()

  // Define whether this form is currently an update of an item
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
      content: course?.content,
      description: course?.description,
      name: course?.name,
      visibility: course?.visibility || Visibility.PUBLIC,
      draft: Boolean(course?.draft),
      // We use an object, else useFieldArray will create an array with each letter an entry
      // Trust me you don't want this
      // @ts-ignore
      modules: course?.modules?.map((i) => ({ id: i.id })) ?? [],
    },
  })

  // Collections linked to this form
  const {
    fields: selectedCollectionFields,
    append: appendSelectedCollectionFields,
    remove: removeSelectedCollectionFields,
  } = useFieldArray({
    control,
    name: 'modules',
    keyName: 'uniqueId',
  })

  const onSubmit = async (courseData: ICourseForm) => {
    const submitMethod = () => {
      courseData.modules = courseData.modules!.map((i) => i.id)
      if (isUpdate && course)
        return updateCourseMutator({ slug: course.slug, body: courseData })

      return createCourseMutator(courseData)
    }

    await submitMethod()
      .unwrap()
      .then((result: Course) => {
        if (isUpdate)
          snackbarService.notify(CrudAction.UPDATE, Endpoint.Courses)
        else snackbarService.notify(CrudAction.CREATE, Endpoint.Courses)

        history.push(`/courses/${result.slug}`)
      })
      .catch((err: any) => {
        snackbarService.createSnackbar(err.data.statusText, {
          variant: 'error',
        })
      })
  }

  /**
   * Callback when user selects a collection in a subcomponent of spotlight
   * @param selectedCollection
   */
  const onSelectCollection = (selectedCollection: Collection) => {
    setOpenCollectionModal(false)
    // If collection is already selected, we want to skip it so we don't add it twice
    if (
      selectedCollectionFields.find(
        (collection) => collection.id === selectedCollection.id
      )
    )
      return
    appendSelectedCollectionFields({ id: selectedCollection.id })
    appendStoredCollections(selectedCollection)
  }
  /**
   * Remove i array of selected collection, we remove a collection based on its index
   * @param removeIndex
   */
  const onRemoveCollection = (removeIndex: number) => {
    if (!selectedCollectionFields[removeIndex]) return

    removeSelectedCollectionFields(removeIndex)
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
        {selectedCollectionFields.map((item, index) => {
          const foundCollection = storedCollections.find(
            (i) => i.id === item.id
          )

          if (!foundCollection) {
            console.error(
              'Could not render a selected collection, failed to find the stored one'
            )
            return null
          }
          return (
            <Stack direction="row" key={item.uniqueId}>
              <Box
                sx={{
                  width: '80%',
                }}
              >
                <CollectionCard collection={foundCollection} />
              </Box>

              <Paper
                variant="outlined"
                sx={{
                  p: 4,
                  mx: 2,
                  cursor: 'pointer',
                  borderColor: (theme) => theme.palette.bg,
                  background: (theme) => theme.palette.bg,
                  '&:hover': {
                    borderColor: (theme) => theme.palette.grey[700],
                  },
                }}
                onClick={() => onRemoveCollection(index)}
              >
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  textAlign="center"
                >
                  <Icon size={30} name="ant-design:delete-filled" />
                  <Typography sx={{ mx: 1 }} variant="body1">
                    {t('form.upsert.deleteChoice')}
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          )
        })}

        <Paper
          variant="outlined"
          sx={{
            p: 4,
            cursor: 'pointer',
            background: (theme) => theme.palette.bg,
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
          <Modal
            open={openCollectionModal}
            onClose={() => setOpenCollectionModal(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
            aria-labelledby="Collection specific modal"
            aria-describedby="Link a collection into your course"
          >
            <Fade in={openCollectionModal}>
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: 0, md: '50%' },
                  left: { xs: 0, md: '50%' },
                  transform: {
                    xs: 'translate(0,0)',
                    md: 'translate(-50%, -50%)',
                  },
                  width: { xs: '100%', md: 700 },
                  bgcolor: 'background.paper',
                  borderRadius: { xs: 0, md: 2 },
                  boxShadow: 10,
                  p: 4,
                }}
              >
                <LinkCollectionSpotlight
                  onSelectCollection={onSelectCollection}
                />
              </Box>
            </Fade>
          </Modal>
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
