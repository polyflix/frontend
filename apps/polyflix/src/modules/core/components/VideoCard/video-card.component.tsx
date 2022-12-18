import { Chip, Link, Paper, Skeleton, Stack, Tooltip } from '@mui/material'
import { Video } from '@videos/models/video.model'
import { AspectRatioBox } from '../AspectRatioBox/AspectRation.component'
import { Link as RouterLink } from 'react-router-dom'
import { videoSlugLink } from '@core/helpers/video.helper'
import { VideoCardThumbnailContainer } from '@videos/components/VideoSliderCard/VideoSliderCard.style'
import { ImageCover } from '../ImageCover/image-cover.component'
import { ElementSmallTag } from '../ElementSmallTag/element-small-tag.component'
import { ElementLockIcon } from '../ElementLockIcon/element-lock-icon.component'
import { NullableTypography } from '../NullableTypography/nullable-typography.component'
import { VideoCardMenu } from '../VideoCardMenu/element-option.component'
import { CardInformation } from '../CardInformation/card-information.component'
import { useTranslation } from 'react-i18next'
import { Icon } from '../Icon/Icon.component'

type VideoCardProps = {
  video?: Video | null
  showInfo?: boolean
}

export const VideoCard = ({ video, showInfo = true }: VideoCardProps) => {
  if (!video) {
    return (
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <AspectRatioBox ratio={16 / 9} sx={{ width: '100%', height: '100%' }}>
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </AspectRatioBox>
      </Paper>
    )
  }

  const isVideoPrivate = video.visibility === 'private'

  const { t } = useTranslation('videos')

  return (
    <Stack direction="column" spacing={1}>
      <Link
        component={RouterLink}
        to={videoSlugLink(video)}
        underline="none"
        color="inherit"
        sx={{
          overflow: 'hidden',
          position: 'relative',
          minWidth: '100px',
        }}
      >
        <VideoCardThumbnailContainer
          sx={{
            opacity: video.draft ? 0.4 : 1,
          }}
          watchedpercent={video.watchtime?.watchedPercent}
        >
          <ImageCover ratio={16 / 9} src={video.thumbnail} />
        </VideoCardThumbnailContainer>
        {video.draft && (
          <ElementSmallTag
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
            }}
            text="Draft"
          />
        )}
        {isVideoPrivate && (
          <ElementLockIcon
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          />
        )}
        {/* Uncomment this line to show video duration */}
        {/* <ElementSmallTag
          sx={{
            position: 'absolute',
            right: 8,
            bottom: 8,
          }}
          text="20 min"
        /> */}
      </Link>
      <Stack direction="column" spacing={0.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            textDecoration: 'none',
          }}
        >
          <Link
            component={RouterLink}
            to={videoSlugLink(video)}
            underline="none"
            color="inherit"
          >
            <Tooltip title={video.title}>
              <NullableTypography
                variant="subtitle1"
                sx={{
                  lineHeight: 1.1,
                  maxHeight: '3.5ch',
                  overflow: 'hidden',
                }}
              >
                {video.title}
              </NullableTypography>
            </Tooltip>
          </Link>
          <VideoCardMenu video={video} />
        </Stack>
        {showInfo && (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <CardInformation
              user={video.publisher}
              createdDate={video.createdAt}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip
                title={t(`card.${video.views > 1 ? 'views' : 'view'}`, {
                  count: video.views || 0,
                })}
              >
                <Chip
                  label={video.views}
                  size="small"
                  icon={<Icon name={'mdi:eye-circle'} />}
                />
              </Tooltip>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
