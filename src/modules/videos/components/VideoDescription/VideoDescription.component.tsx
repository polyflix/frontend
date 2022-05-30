import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import {
  Skeleton,
  Typography,
  Stack,
  Paper,
  Grid,
  Divider,
  Link,
  Tooltip,
  Box,
  Button,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { MarkdownBox } from '@core/components/MarkdownBox/MarkdownBox.component'
import { stringToLongDate, stringToShortDate } from '@core/helpers/date.helper'

import { Video } from '@videos/models/video.model'
import { useLikeVideoMutation } from '@videos/services/video.service'

import { UserAvatar } from '@users/components/UserAvatar/UserAvatar.component'

import { VideoDescriptionMenu } from './VideoDescriptionMenu/VideoDescriptionMenu.component'

type VideoDetailsProps = {
  video?: Video
}

export const VideoDetails = ({ video }: VideoDetailsProps) => {
  const { t } = useTranslation('videos')
  const [isLiked, setIsLiked] = useState<boolean | undefined>(undefined)
  const [likeDisabled, setLikeDisabled] = useState<boolean>(false)
  const [likeVideo] = useLikeVideoMutation()

  let [likeNumber, setLikeNumber] = useState<number>(video?.likes || 0)
  const like = async () => {
    if (video) {
      setLikeDisabled(true)
      await likeVideo(video.slug)
      if (!isLiked) {
        setLikeNumber(likeNumber + 1)
      } else {
        setLikeNumber(likeNumber - 1)
      }
      setIsLiked(!isLiked)
      setLikeDisabled(false)
    }
  }

  if (video && isLiked === undefined) {
    setIsLiked(video?.isLiked)
  }

  return (
    <Paper variant="outlined" sx={{ padding: 2, position: 'relative' }}>
      <Grid container>
        <Grid item xs={12}>
          {video ? (
            <Stack spacing={1}>
              <Stack
                direction={{
                  xs: 'column',
                  md: 'row',
                }}
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Stack spacing={0}>
                  <Typography variant="h4">{video?.title}</Typography>
                  <Tooltip
                    title={
                      (video?.createdAt &&
                        stringToLongDate(video?.createdAt)) ||
                      ''
                    }
                  >
                    <Typography variant="caption">
                      {(video?.createdAt &&
                        stringToShortDate(video?.createdAt)) ||
                        ''}
                    </Typography>
                  </Tooltip>
                </Stack>
                <Stack
                  spacing={2}
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Tooltip
                    title={t<string>('slug.details.tooltips.likes', {
                      count: likeNumber,
                    })}
                  >
                    <Button
                      startIcon={<Icon name="eva:heart-fill" />}
                      color="primary"
                      onClick={() => like()}
                      disabled={likeDisabled}
                      variant={isLiked ? 'outlined' : 'text'}
                      size="medium"
                    >
                      {likeNumber}
                    </Button>
                  </Tooltip>
                  <Tooltip
                    title={t<string>('slug.details.tooltips.views', {
                      count: video?.views,
                    })}
                  >
                    <Box
                      component="span"
                      sx={{
                        p: 2,
                        color: 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <VisibilityOutlinedIcon
                        sx={{
                          mr: 0.8,
                        }}
                      />
                      {video?.views}
                    </Box>
                  </Tooltip>
                  <Box
                    component="span"
                    sx={{
                      p: 1,
                      color: 'secondary.main',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <VideoDescriptionMenu video={video} />
                  </Box>
                </Stack>
              </Stack>
              <Divider variant="middle" />
              <Tooltip title={t<string>('slug.details.tooltips.seeProfile')}>
                <Link
                  underline="none"
                  variant="caption"
                  color="inherit"
                  component={RouterLink}
                  sx={{ width: 'max-content' }}
                  to="#"
                >
                  <Stack spacing={1} direction="row" alignItems="center">
                    <UserAvatar user={video.publishedBy!} />
                    <Typography variant="caption">
                      {video.publishedBy?.displayName}
                    </Typography>
                  </Stack>
                </Link>
              </Tooltip>
            </Stack>
          ) : (
            <Skeleton variant="text" width="90%" height={35} />
          )}
        </Grid>
        <Grid item xs={12}>
          {video ? (
            <MarkdownBox body={video?.description} />
          ) : (
            <>
              <Skeleton variant="text" width="75%" />
              <Skeleton variant="text" width="65%" />
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="65%" />
            </>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}
