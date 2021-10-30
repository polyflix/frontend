import {
  Skeleton,
  Typography,
  Avatar,
  Stack,
  Paper,
  Grid,
  Divider,
  Link,
  Tooltip,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { MarkdownBox } from '@core/components/MarkdownBox/MarkdownBox.component'
import { stringToDate } from '@core/helpers/date.helper'

import { Video } from '@videos/models/video.model'

import { ActionButton } from './VideoDescriptionActionButton/VideoDescriptionActionButton.component'
import { VideoDescriptionMenu } from './VideoDescriptionMenu/VideoDescriptionMenu.component'

type VideoDetailsProps = {
  video?: Video
}

export const VideoDetails = ({ video }: VideoDetailsProps) => {
  const { t } = useTranslation('videos')

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
                  <Typography variant="caption">
                    {stringToDate(video?.createdAt)}
                  </Typography>
                </Stack>
                <Stack spacing={2} direction="row">
                  <ActionButton
                    startIcon={<Icon name="eva:heart-fill" />}
                    tooltip={t('slug.details.tooltips.likes', { count: 0 })}
                    color="primary"
                  >
                    0 {/* TODO */}
                  </ActionButton>
                  <ActionButton
                    color="secondary"
                    tooltip={t('slug.details.tooltips.views', { count: 0 })}
                    startIcon={<Icon name="eva:eye-outline" />}
                  >
                    0 {/* TODO */}
                  </ActionButton>
                  <VideoDescriptionMenu />
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
                    {/* TODO user */}
                    <Avatar
                      alt={video.publishedBy?.displayName}
                      src="https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png"
                    />
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
