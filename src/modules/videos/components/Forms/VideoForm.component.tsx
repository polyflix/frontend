import { LoadingButton } from '@mui/lab'
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { Icon } from '@core/components/Icon/Icon.component'
import { MHidden } from '@core/components/MHidden/MHidden.component'
import { StatusSelector } from '@core/components/StatusSelector/StatusSelector.component'
import { UploadProgress } from '@core/components/UploadProgress/UploadProgress.component'
import { VisibilitySelector } from '@core/components/VisibilitySelector/VisibilitySelector.component'
import { Regex } from '@core/constants/regex.constant'
import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
} from '@core/helpers/form.helper'
import { Visibility } from '@core/models/content.model'

import { Video } from '@videos/models/video.model'
import { VideoService } from '@videos/services/video.service'
import { YoutubeService } from '@videos/services/youtube.service'
import { IVideoForm } from '@videos/types/form.type'
import { VideoSource } from '@videos/types/video.type'

import { FrameSelector } from '../FrameSelector/FrameSelector.component'
import { VideoDropzone } from '../VideoDropzone/VideoDropzone.component'
import { VideoPreview } from '../VideoPreview/VideoPreview.component'

interface Props {
  source?: VideoSource
  video?: Video
  i18nKey: string
  isUpdate: boolean
}

// The form used to create / update videos
export const VideoForm = ({ source, video, isUpdate }: Props) => {
  const { t } = useTranslation('videos')

  // Useful services for our component
  const videoService = useInjection<VideoService>(VideoService)
  const youtubeService = useInjection<YoutubeService>(YoutubeService)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IVideoForm>({
    defaultValues: {
      title: video?.title,
      description: video?.description,
      draft: video?.draft || true,
      visibility: video?.visibility || Visibility.PUBLIC,
      thumbnail: video?.thumbnail,
      src: video?.source.replace('-nocookie', ''),
      attachments: video?.attachments,
    },
  })

  // Make the field "attachments" an array to use with react hook form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attachments',
  })

  // Useful states for our compoennt
  // This boolean allow us to control when a video was autocompleted (YouTube for example)
  const [isAutocompleted, setIsAutocompleted] = useState<boolean>(false)
  // This should be set to true when something happens on the component
  const [isAction, setIsAction] = useState<boolean>(false)
  // This should contains our video file when the user upload a video
  const [videoFile, setVideoFile] = useState<File>()
  // This should contaisn our video thumbnail file when the user use the frame selector
  const [videoThumbnailFile, setVideoThumbnailFile] = useState<File>()

  // We should memoize the video file url if there is a file uploaded
  // to avoid multiple re-renders of the frame selector.
  const videoFileUrl = useMemo(
    () => (videoFile ? URL.createObjectURL(videoFile) : undefined),
    [videoFile]
  )

  // Useful variables
  const videoSource = watch('src')
  const thumbnail = watch('thumbnail')
  const isYoutube = source === 'YouTube'

  // Here we define a simple effect which will
  // clear the video thumbnail file if the user put a link into it's
  // thumbnail URL field.
  useEffect(() => {
    if (videoThumbnailFile) {
      setVideoThumbnailFile(undefined)
    }
  }, [thumbnail])

  // Effect called when the videoSource change for a Youtube Video.
  useEffect(() => {
    const getYoutubeMeta = async (url: string) => {
      setIsAction(true)

      const {
        description,
        thumbnail: ytbThumbnail,
        title,
      } = await youtubeService.getVideoMetadata(url)

      setValue('description', description)
      setValue('title', title)
      setValue('thumbnail', ytbThumbnail)

      setIsAutocompleted(true)
      setIsAction(false)
    }

    if (videoSource && !isUpdate) {
      getYoutubeMeta(videoSource)
    }
  }, [videoSource])

  // Function called when the user submit the form without errors
  const onSubmit = async (data: IVideoForm) => {
    setIsAction(true)
    try {
      if (isUpdate) {
        delete data.src
        delete data.thumbnail
        await videoService.update(video!.id, data)
      } else {
        await videoService.create(
          data,
          isYoutube,
          videoFile,
          videoThumbnailFile
        )
      }
    } finally {
      setIsAction(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography sx={{ mb: 3 }} variant="h4">
        {t('forms.create-update.title.metadata')}
      </Typography>
      <Stack spacing={4}>
        <Grid container spacing={2}>
          <MHidden width="smDown">
            <Grid item md={5}>
              <VideoPreview
                title={watch('title')}
                description={watch('description')}
                thumbnail={videoThumbnailFile || watch('thumbnail')}
              />
            </Grid>
          </MHidden>

          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              {isYoutube && (
                <TextField
                  error={Boolean(errors.src)}
                  helperText={errors.src?.message}
                  label={t('forms.create-update.placeholder.youtubeUrl')}
                  {...getCommonTextFieldProps()}
                  {...register('src', {
                    required: {
                      value: true,
                      message: `${t(
                        'videoManagement.inputs.videoURL.missing'
                      )}.`,
                    },
                    pattern: {
                      value: Regex.Youtube,
                      message: `${t('videoManagement.inputs.videoURL.error')}.`,
                    },
                  })}
                />
              )}

              {!isYoutube && !isUpdate && (
                <>
                  {videoFileUrl ? (
                    <FrameSelector
                      onSelect={setVideoThumbnailFile}
                      src={videoFileUrl}
                    />
                  ) : (
                    <VideoDropzone
                      disabled={Boolean(videoFile)}
                      onAcceptedFiles={([file]) => setVideoFile(file)}
                      text={t('forms.create-update.placeholder.upload')}
                      hint
                      accept="video/mp4"
                    />
                  )}
                </>
              )}

              <TextField
                disabled={isYoutube && !isAutocompleted}
                error={Boolean(errors.title)}
                helperText={errors.title?.message}
                label={
                  !isAutocompleted && t('forms.create-update.placeholder.title')
                }
                {...getCommonTextFieldProps()}
                {...register('title', {
                  required: {
                    value: true,
                    message: t('forms.create-update.validation.title.required'),
                  },
                })}
              />

              {!isUpdate && isYoutube && (
                <TextField
                  disabled={(isYoutube && !isAutocompleted) || isUpdate}
                  error={Boolean(errors.thumbnail)}
                  helperText={errors.thumbnail?.message}
                  label={
                    !isAutocompleted &&
                    t('forms.create-update.placeholder.thumbnail')
                  }
                  {...getCommonTextFieldProps()}
                  {...register('thumbnail', {
                    required: {
                      value: isYoutube,
                      message: t(
                        'forms.create-update.validation.thumbnail.required'
                      ),
                    },
                  })}
                />
              )}

              <TextField
                disabled={isYoutube && !isAutocompleted}
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
                multiline
                label={
                  !isAutocompleted &&
                  t('forms.create-update.placeholder.description')
                }
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
          </Grid>
        </Grid>

        <Divider />

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4">
            {t('forms.create-update.title.attachments')}
          </Typography>
          <IconButton onClick={() => append({})} color="primary">
            <Icon name="carbon:add" size={30} />
          </IconButton>
        </Stack>

        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {t('forms.create-update.description.attachments')}
        </Typography>

        {fields.length === 0 && (
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t('forms.create-update.placeholder.attachments.empty')}
          </Typography>
        )}

        {fields.map((item, index) => {
          return (
            <Stack direction="row" key={item.id} alignItems="center">
              <TextField
                error={Boolean(
                  Array.isArray(errors.attachments) &&
                    errors.attachments[index]?.label
                )}
                helperText={
                  Array.isArray(errors.attachments) &&
                  errors.attachments[index]?.label?.message
                }
                label={t('forms.create-update.placeholder.attachments.label')}
                {...getCommonTextFieldProps()}
                {...register(`attachments.${index}.label`, {
                  required: {
                    value: true,
                    message: t(
                      'forms.create-update.validation.attachments.label.required'
                    ),
                  },
                })}
              />

              <Box sx={{ px: 1 }} />

              <TextField
                error={Boolean(
                  Array.isArray(errors.attachments) &&
                    errors.attachments[index]?.url
                )}
                helperText={
                  Array.isArray(errors.attachments) &&
                  errors.attachments[index]?.url?.message
                }
                label={t('forms.create-update.placeholder.attachments.url')}
                {...getCommonTextFieldProps()}
                {...register(`attachments.${index}.url`, {
                  required: {
                    value: true,
                    message: t(
                      'forms.create-update.validation.attachments.url.required'
                    ),
                  },
                })}
              />

              <IconButton color="primary" onClick={() => remove(index)}>
                <Icon name="ic:round-clear" />
              </IconButton>
            </Stack>
          )
        })}

        <Divider />

        <Typography sx={{ mb: 3 }} variant="h4">
          Status
        </Typography>

        <VisibilitySelector
          value={watch('visibility')}
          onChange={(value: Visibility) => setValue('visibility', value)}
        />

        <StatusSelector
          value={watch('draft')}
          onChange={(value: boolean) => setValue('draft', value)}
        />

        <LoadingButton {...getCommonSubmitButtonProps(isAction)}>
          {t(
            `forms.create-update.placeholder.submit.${
              isUpdate ? 'update' : 'create'
            }`
          )}
        </LoadingButton>

        <UploadProgress />
      </Stack>
    </form>
  )
}