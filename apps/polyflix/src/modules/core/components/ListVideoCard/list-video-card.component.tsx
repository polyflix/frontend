import {
  Box,
  Link,
  Paper,
  Skeleton,
  Stack,
  styled,
  Tooltip,
} from '@mui/material'
import { Video } from '@videos/models/video.model'
import { AspectRatioBox } from '../AspectRatioBox/AspectRation.component'
import { Link as RouterLink } from 'react-router-dom'
import { videoSlugLink } from '@core/helpers/video.helper'
import { ImageCover } from '../ImageCover/image-cover.component'
import { ElementLockIcon } from '../ElementLockIcon/element-lock-icon.component'
import { NullableTypography } from '../NullableTypography/nullable-typography.component'
import { VideoCardMenu } from '../VideoCardMenu/element-option.component'
import { CardInformation } from '../CardInformation/card-information.component'

type ListVideoCardProps = {
  video?: Video | null
  showInfo?: boolean
}

const VideoCardThumbnailContainer = styled<any>(Box)(
  ({ theme, watchedPercent }) => ({
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: '5px',
      width: `${(watchedPercent ?? 0) * 100}%`,
      background: theme.palette.primary.main,
      borderRadius: 'inherit',
    },
  })
)

export const ListVideoCard = ({
  video,
  showInfo = true,
}: ListVideoCardProps) => {
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

  return (
    <Stack direction="row" spacing={1}>
      <Link
        component={RouterLink}
        to={videoSlugLink(video)}
        underline="none"
        color="inherit"
        sx={{
          overflow: 'hidden',
          position: 'relative',
          minWidth: '100px',
          opacity: isVideoPrivate ? 0.5 : 1,
        }}
      >
        <VideoCardThumbnailContainer
          watchedpercent={video.watchtime?.watchedPercent}
        >
          <ImageCover ratio={16 / 9} src={video.thumbnail} />
        </VideoCardThumbnailContainer>
        {isVideoPrivate && (
          <ElementLockIcon
            sx={{
              position: 'absolute',
              right: 4,
              top: 4,
            }}
          />
        )}
        {/* Uncomment this line to show video duration */}
        {/* <ElementSmallTag
          sx={{
            position: 'absolute',
            right: 4,
            bottom: 4,
          }}
          text="20 min"
        /> */}
      </Link>
      <Stack
        direction="column"
        spacing={0.5}
        sx={{
          width: '100%',
          minWidth: 0,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: '100%',
          }}
        >
          <Link
            component={RouterLink}
            to={videoSlugLink(video)}
            underline="none"
            color="inherit"
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Tooltip title={video.title}>
              <NullableTypography
                variant="subtitle1"
                noWrap
                sx={{
                  flex: 1,
                  lineHeight: 1.1,
                  overflow: 'hidden',
                }}
              >
                {video.title}
              </NullableTypography>
            </Tooltip>
          </Link>
          <Box
            sx={{
              display: 'inline-block',
              width: '28px',
              height: '28px',
            }}
          >
            <VideoCardMenu video={video} />
          </Box>
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
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
