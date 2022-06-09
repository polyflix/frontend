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
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { Dropzone } from '@core/components/Dropzone/Dropzone.component'
import { Icon } from '@core/components/Icon/Icon.component'
import { MHidden } from '@core/components/MHidden/MHidden.component'
import { StatusSelector } from '@core/components/StatusSelector/StatusSelector.component'
import { UploadProgress } from '@core/components/UploadProgress/UploadProgress.component'
import { VisibilitySelector } from '@core/components/VisibilitySelector/VisibilitySelector.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import { Regex } from '@core/constants/regex.constant'
import { generateFilename } from '@core/helpers/file.helper'
import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
} from '@core/helpers/form.helper'
import { Visibility } from '@core/models/content.model'
import { MinioService } from '@core/services/minio.service'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'

import { useStreamUrl } from '@videos/hooks/useStreamUrl.hook'
import { Video } from '@videos/models/video.model'
import {
  useAddVideoMutation,
  useUpdateVideoMutation,
} from '@videos/services/video.service'
import { YoutubeService } from '@videos/services/youtube.service'
import { IVideoForm } from '@videos/types/form.type'
import { VideoSource } from '@videos/types/video.type'

import { FrameSelector } from '../FrameSelector/FrameSelector.component'
import { VideoPreview } from '../VideoPreview/VideoPreview.component'

interface Props {
  source?: VideoSource
  video?: Video
  i18nKey: string
  isUpdate: boolean
}

// The form used to create / update videos
export const VideoForm = ({ source, video, isUpdate }: Props) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const minioService = useInjection<MinioService>(MinioService)
  const [isInProgress, setIsInProgress] = useState<boolean>(false)

  const { t } = useTranslation('videos')

  // Useful services for our component
  // const videoService = useInjection<VideoService>(VideoService)
  const youtubeService = useInjection<YoutubeService>(YoutubeService)

  // Get our mutations
  const [createVideo] = useAddVideoMutation()
  const [updateVideo] = useUpdateVideoMutation()

  const history = useHistory()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<IVideoForm>({
    defaultValues: {
      title: video?.title,
      description: video?.description,
      draft: Boolean(video?.draft),
      visibility: video?.visibility || Visibility.PUBLIC,
      thumbnail: video?.thumbnail,
      source: video?.source.replace('-nocookie', ''),
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
  const videoSource = watch('source')
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
      const {
        description,
        thumbnail: ytbThumbnail,
        title,
      } = await youtubeService.getVideoMetadata(url)

      setValue('description', description)
      setValue('title', title)
      setValue('thumbnail', ytbThumbnail)

      setIsAutocompleted(true)
    }

    if (videoSource && !isUpdate) {
      getYoutubeMeta(videoSource)
    }
  }, [videoSource, isUpdate, setValue, youtubeService])

  // Function called when the user submit the form without errors
  const onSubmit = async (data: IVideoForm) => {
    // Add data process if local video provided
    if (!isYoutube) {
      // If we have a video file, generate the a filename for it
      if (videoFile) {
        data.source = generateFilename(videoFile)
      } else if (isUpdate && !videoFile) {
        // if video has not been changed on update
        delete data.source
      } else {
        return snackbarService.createSnackbar(
          t('forms.create-update.validation.video.required', {
            ns: 'videos',
          }),
          { variant: 'error' }
        )
      }

      // If we have a file for the thumbnail, generate a filename for it
      if (videoThumbnailFile) {
        data.thumbnail = generateFilename(videoThumbnailFile)
      }
    }

    try {
      // handle response and get video and thumbnail psu url to upload them
      const { videoPutPsu, thumbnailPutPsu } = await (isUpdate
        ? updateVideo({ slug: video!.slug, body: data })
        : createVideo(data)
      ).unwrap()

      if (!isYoutube) {
        const uploads = [] // list of files to push on minio

        if (videoFile && videoPutPsu) {
          uploads.push({ file: videoFile, presignedUrl: videoPutPsu })
        }

        if (videoThumbnailFile && thumbnailPutPsu) {
          uploads.push({
            file: videoThumbnailFile,
            presignedUrl: thumbnailPutPsu,
          })
        }
        setIsInProgress(true)
        await minioService.upload(uploads)
        setIsInProgress(false)
      }

      // Display the success snackbar
      snackbarService.notify(
        isUpdate ? CrudAction.UPDATE : CrudAction.CREATE,
        Endpoint.Videos
      )

      history.push('/videos/explore')
    } catch (e: any) {
      snackbarService.createSnackbar(e.data.statusText, { variant: 'error' })
    }
  }

  const { streamUrl } = isUpdate
    ? useStreamUrl(video!)
    : { streamUrl: undefined }

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
                  error={Boolean(errors.source)}
                  helperText={errors.source?.message}
                  label={t('forms.create-update.placeholder.youtubeUrl')}
                  {...getCommonTextFieldProps()}
                  {...register('source', {
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

              {!isYoutube && isUpdate && (
                <FrameSelector
                  onSelect={setVideoThumbnailFile}
                  src={streamUrl!}
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
                    <Dropzone
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
          {t('forms.create-update.title.status')}
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
          {t(
            `forms.create-update.placeholder.submit.${
              isUpdate ? 'update' : 'create'
            }`
          )}
        </LoadingButton>
        {isInProgress && <UploadProgress />}
      </Stack>
    </form>
  )
}
