import { AdminVideoForm, Draft } from '@admin/models/video.model'
import { LoadingButton } from '@mui/lab'
import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useGenerateSubtitlesMutation } from '@subtitles/services/adminSubtitle.service'
import { isUndefined } from 'lodash'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
} from '@core/helpers/form.helper'
import { videoSlugLink } from '@core/helpers/video.helper'
import { Visibility } from '@core/models/content.model'
import { SnackbarService } from '@core/services/snackbar.service'
import {
  i18nLanguageToSubtitleLanguage,
  PolyflixLanguage,
} from '@core/utils/language.util'

import { Video } from '@videos/models/video.model'
import {
  useDeleteVideoMutation,
  useUpdateAdminVideoMutation,
} from '@videos/services/video.service'
import { PlayerVideoSource } from '@videos/types/video.type'
import { polyfilxRouter } from '@core/utils/routes'

interface Props {
  video?: Video
  onClose: () => void
}

export const EditVideoModal = ({ video, onClose }: Props) => {
  const [isExternal, setIsExternal] = useState<boolean>(false)
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const currentLanguage = localStorage.getItem('i18nextLng')
  const [updateVideo] = useUpdateAdminVideoMutation()
  const [deleteVideo] = useDeleteVideoMutation()
  const { t } = useTranslation('administration')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<AdminVideoForm>({
    defaultValues: {
      title: video?.title,
      visibility: video?.visibility ?? ('protected' as Visibility),
      draft: (!video?.draft ? 'false' : 'true') as Draft,
      availableLanguages: video?.availableLanguages,
    },
  })

  const [generateSubtitles] = useGenerateSubtitlesMutation()

  const onGenerateSubtitles = async () => {
    generateSubtitles({
      slug: video?.slug ?? '',
      language: i18nLanguageToSubtitleLanguage(
        (currentLanguage ?? 'en') as PolyflixLanguage
      ),
    })
  }

  const [open, setOpen] = useState<boolean>(false)

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  const onDelete = async () => {
    if (video) {
      const slug = await deleteVideo({ slug: video.slug })
      if (!slug) {
        snackbarService.createSnackbar(
          t('video.page.panel.actions.delete.error'),
          { variant: 'error' }
        )
      } else {
        handleClose()
      }
    }
  }

  const onSubmit = async (data: AdminVideoForm) => {
    const { error } = (await updateVideo({
      slug: video!.slug,
      body: data,
    })) as any
    if (error) {
      snackbarService.createSnackbar(error.data.message, { variant: 'error' })
    } else {
      handleClose()
    }
  }

  useEffect(() => {
    setOpen(!isUndefined(video))
    if (video && video.sourceType) {
      setIsExternal(video.sourceType === PlayerVideoSource.YOUTUBE)
    }
  }, [video])

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
                        <Link
                          underline="none"
                          color="inherit"
                          to={polyfilxRouter().video.watch(video?.slug!!)}
                          component={RouterLink}
                        >
                          <Typography variant="h4">{video?.title}</Typography>
                        </Link>
                        <Typography variant="caption">
                          ID : {video?.id}
                        </Typography>
                        <Typography variant="caption">
                          slug : {video?.slug}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(errors.firstName)}
                      helperText={errors.firstName?.message}
                      label={t('video.form.labels.title')}
                      {...getCommonTextFieldProps()}
                      {...register('title', {
                        required: {
                          value: true,
                          message: t('video.form.errors.title.required'),
                        },
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      control={control}
                      name="visibility"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="visibility">Visibility</InputLabel>
                          <Select
                            {...field}
                            input={<OutlinedInput label="Visibility" />}
                            labelId="visibility"
                            required
                            minRows={1}
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                }}
                              >
                                {selected}
                              </Box>
                            )}
                          >
                            {Object.values(Visibility).map((v) => (
                              <MenuItem key={v} value={v}>
                                {v}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      control={control}
                      name="draft"
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="draft">Draft</InputLabel>
                          <Select
                            {...field}
                            input={<OutlinedInput label="draft" />}
                            labelId="draft"
                            required
                            minRows={1}
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                }}
                              >
                                {selected}
                              </Box>
                            )}
                          >
                            {Object.values(Draft).map((v) => (
                              <MenuItem key={v} value={v}>
                                {v}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack justifyContent="end" spacing={2} direction="row">
                      <LoadingButton onClick={onDelete}>
                        {t('video.form.actions.delete')}
                      </LoadingButton>
                      <Button
                        onClick={onGenerateSubtitles}
                        variant="outlined"
                        disabled={isExternal}
                      >
                        {isExternal
                          ? t('video.form.actions.cantGenerateSubtitles')
                          : t('video.form.actions.generateSubtitles')}
                      </Button>
                      <Button onClick={handleClose} variant="outlined">
                        {t('users.form.actions.close')}
                      </Button>
                      <LoadingButton
                        {...getCommonSubmitButtonProps(isSubmitting, false)}
                      >
                        {t('users.form.actions.save')}
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
