import { Delete } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
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
import { PlayerVideoSource } from '@videos/types/video.type'

import { AttachmentAvatar } from '@attachments/components/AttachmentAvatar.component'
import { AttachmentSelectorModal } from '@attachments/components/AttachmentSelectorModal.component'
import { useGetVideoAttachmentsQuery } from '@attachments/services/attachment.service'

import { FrameSelector } from '../FrameSelector/FrameSelector.component'
import { VideoPreview } from '../VideoPreview/VideoPreview.component'

const urlRegex = /(https?:\/\/[^\s]+)/gi
interface Props {
  source?: PlayerVideoSource
  video?: Video
  i18nKey: string
  isUpdate: boolean
}

// The form used to create / update videos
export const VideoForm = ({ source, video, isUpdate }: Props) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const minioService = useInjection<MinioService>(MinioService)
  const [isInProgress, setIsInProgress] = useState<boolean>(false)
  const [isModalAttachmentOpen, setIsModalAttachmentOpen] = useState(false)

  const { t } = useTranslation('videos')

  // Useful services for our component
  // const videoService = useInjection<VideoService>(VideoService)
  const youtubeService = useInjection<YoutubeService>(YoutubeService)

  // Get our mutations
  const [createVideo] = useAddVideoMutation()
  const [updateVideo] = useUpdateVideoMutation()

  const history = useHistory()

  const formatDescription = (description: string) => {
    let descriptionTemp = description
    const links = description.match(urlRegex) || []

    links.forEach((link) => {
      descriptionTemp = descriptionTemp?.replace(link, `[${link}](${link})\n`)
    })

    return descriptionTemp
  }

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
      description:
        video?.description && !isUpdate
          ? formatDescription(video.description)
          : video?.description,
      draft: Boolean(video?.draft),
      visibility: video?.visibility || Visibility.PUBLIC,
      thumbnail: video?.thumbnail,
      source: video?.source.replace('-nocookie', ''),
      attachments: [],
    },
  })

  const attachments = useFieldArray({
    control,
    name: 'attachments',
    /* Since useFieldArray overrides the `id` field, we need to set a different key here */
    keyName: 'uniqueId',
  })

  const { data: existingAttachments, refetch: refetchAttachments } =
    useGetVideoAttachmentsQuery(video?.id || '', {
      skip: !video,
    })

  useEffect(() => {
    /* Since the attachments are not invalidated after a video update, we need to refetch them here */
    if (existingAttachments) refetchAttachments()
  }, [])

  useEffect(() => {
    /* On update mode, if the video has already attachments, we set the field with these values  */
    if (existingAttachments?.items) {
      attachments.replace(existingAttachments.items)
    }
  }, [existingAttachments])

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
  const isYoutube = source === PlayerVideoSource.YOUTUBE

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

      setValue('description', formatDescription(description))
      setValue('title', title)
      setValue('thumbnail', ytbThumbnail)

      setIsAutocompleted(true)
    }

    if (videoSource && !isUpdate) {
      getYoutubeMeta(videoSource)
    }
  }, [videoSource, isUpdate, youtubeService])

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

    /** Need to send only attachments ids */
    const mappedData = {
      ...data,
      attachments: attachments.fields.map((a) => a.id),
    }

    try {
      // handle response and get video and thumbnail psu url to upload them
      const { videoPutPsu, thumbnailPutPsu } = await (isUpdate
        ? updateVideo({
            slug: video!.slug,
            body: mappedData as unknown as IVideoForm,
          })
        : createVideo(mappedData as unknown as IVideoForm)
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
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
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

        <Stack spacing={1}>
          <Typography
            variant="h5"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {t('forms.create-update.attachments.label')}
            <Tooltip title={t<string>('forms.create-update.attachments.add')}>
              <IconButton
                type="button"
                onClick={() => setIsModalAttachmentOpen(true)}
                color="primary"
              >
                <Icon name="carbon:add" size={30} />
              </IconButton>
            </Tooltip>
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t('forms.create-update.attachments.description')}
          </Typography>
          {attachments.fields.length > 0 ? (
            <List>
              {attachments.fields.map((attachment, i) => {
                return (
                  <ListItem
                    key={i}
                    sx={{ bgcolor: 'background.paper', borderRadius: 1, mb: 1 }}
                    secondaryAction={
                      <Tooltip
                        title={t<string>(
                          'forms.create-update.attachments.remove'
                        )}
                      >
                        <IconButton
                          edge="end"
                          color="error"
                          aria-label="delete"
                          onClick={() => attachments.remove(i)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <AttachmentAvatar
                      url={attachment.url}
                      copyToClipboard={false}
                    />
                    <Link
                      href={attachment.url}
                      target="_blank"
                      rel="noopener"
                      color="inherit"
                      underline="hover"
                    >
                      <ListItemText primary={attachment.title} />
                    </Link>
                  </ListItem>
                )
              })}
            </List>
          ) : (
            <Alert severity="warning">
              {t('forms.create-update.attachments.empty')}
            </Alert>
          )}
          {isModalAttachmentOpen && (
            <AttachmentSelectorModal
              attachments={attachments}
              videoId={video?.id}
              isOpen={isModalAttachmentOpen}
              onClose={() => setIsModalAttachmentOpen(false)}
            />
          )}
        </Stack>

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
