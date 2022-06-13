import { LinkCourseSpotlight } from '@cursus/components/LinkCourseSpotlight/LinkCourseSpotlight.component'
import { Cursus } from '@cursus/models/cursus.model'
import {
  useAddCursusMutation,
  useUpdateCursusMutation,
} from '@cursus/services/cursus.service'
import { ICursusForm } from '@cursus/types/form.type'
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

import { CourseCard } from '@courses/components/CourseCard/CourseCard.component'
import { Course } from '@courses/models/course.model'

interface Props {
  cursus?: Cursus
}

export const CursusForm: React.FC<Props> = ({ cursus }) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const { t } = useTranslation('cursus')
  const history = useHistory()

  // Course selection modal
  const [openCourseModal, setOpenCourseModal] = useState(false)
  const [storedCourses, setStoredCourses] = useState<Course[]>(
    cursus?.courses ?? []
  )
  const appendStoredCourses = useCallback(
    (course: Course) => {
      if (storedCourses.find((item) => item.id === course.id)) return

      setStoredCourses([...storedCourses, course])
    },
    [storedCourses]
  )

  const [createCursusMutator] = useAddCursusMutation()
  const [updateCursusMutator] = useUpdateCursusMutation()

  // Define whether this form is currently an update of an item
  const isUpdate = !isUndefined(cursus)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    control,
    setValue,
  } = useForm<ICursusForm>({
    defaultValues: {
      content: cursus?.content,
      description: cursus?.description,
      title: cursus?.title,
      visibility: cursus?.visibility || Visibility.PUBLIC,
      draft: Boolean(cursus?.draft),
      // We use an object, else useFieldArray will create an array with each letter an entry
      // Trust me you don't want this
      // @ts-ignore
      courses: cursus?.courses?.map((i) => ({ id: i.id })) ?? [],
    },
  })

  // Courses linked to this form
  const {
    fields: selectedCourseFields,
    append: appendSelectedCourseFields,
    remove: removeSelectedCourseFields,
  } = useFieldArray({
    control,
    name: 'courses',
    keyName: 'uniqueId',
  })

  const onSubmit = async (cursusData: ICursusForm) => {
    const submitMethod = () => {
      cursusData.courses = cursusData.courses!.map((i) => i.id)
      if (isUpdate && cursus)
        return updateCursusMutator({ slug: cursus.slug, body: cursusData })

      return createCursusMutator(cursusData)
    }

    await submitMethod()
      .unwrap()
      .then((result: Cursus) => {
        if (isUpdate) snackbarService.notify(CrudAction.UPDATE, Endpoint.Cursus)
        else snackbarService.notify(CrudAction.CREATE, Endpoint.Cursus)

        history.push(`/cursus/${result.slug}`)
      })
      .catch((err: any) => {
        snackbarService.createSnackbar(err.data.statusText, {
          variant: 'error',
        })
      })
  }

  /**
   * Callback when user selects a course in a subcomponent of spotlight
   * @param selectedCourse
   */
  const onSelectCourse = (selectedCourse: Course) => {
    setOpenCourseModal(false)
    // If course is already selected, we want to skip it so we don't add it twice
    if (selectedCourseFields.find((course) => course.id === selectedCourse.id))
      return
    appendSelectedCourseFields({ id: selectedCourse.id })
    appendStoredCourses(selectedCourse)
  }
  /**
   * Remove i array of selected course, we remove a course based on its index
   * @param removeIndex
   */
  const onRemoveCourse = (removeIndex: number) => {
    if (!selectedCourseFields[removeIndex]) return

    removeSelectedCourseFields(removeIndex)
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
            value={cursus?.slug}
          />
        )}

        <TextField
          error={Boolean(errors.title)}
          helperText={
            errors.title?.message ??
            t('form.upsert.helper.title', {
              count: 100,
            })
          }
          label={t('form.upsert.label.title')}
          disabled={isSubmitting}
          {...getCommonTextFieldProps()}
          {...register('title', {
            required: {
              value: true,
              message: t('form.upsert.error.requiredField', {
                field: t('form.upsert.fields.title'),
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

        <Divider />

        <Typography sx={{ mb: 3 }} variant="h4">
          {t('form.upsert.title.courses')}
        </Typography>
        {selectedCourseFields.map((item, index) => {
          const foundCourse = storedCourses.find((i) => i.id === item.id)

          if (!foundCourse) {
            console.error(
              'Could not render a selected course, failed to find the stored one'
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
                <CourseCard course={foundCourse} />
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
                onClick={() => onRemoveCourse(index)}
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
            onClick={() => setOpenCourseModal(true)}
          >
            <Icon size={30} name="carbon:add-alt" />
            <Typography sx={{ mt: 1 }} variant="body1">
              {t('form.upsert.addCourse')}
            </Typography>
          </Stack>
          <Modal
            open={openCourseModal}
            onClose={() => setOpenCourseModal(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
            aria-labelledby="Course specific modal"
            aria-describedby="Link a course into your cursus"
          >
            <Fade in={openCourseModal}>
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
                <LinkCourseSpotlight onSelectCourse={onSelectCourse} />
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
