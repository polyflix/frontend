import { InfoOutlined } from '@mui/icons-material'
import {
  Box,
  Link,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { abbreviateNumber } from 'js-abbreviation-number'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { AspectRatioBox } from '@core/components/AspectRatioBox/AspectRation.component'
import { CardMenu } from '@core/components/CardMenu/CardMenu.component'
import { Endpoint } from '@core/constants/endpoint.constant'
import { getPublishLabel } from '@core/helpers/date.helper'
import { videoSlugLink } from '@core/helpers/video.helper'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'
import { Role } from '@core/types/roles.type'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { Video } from '@videos/models/video.model'
import { useDeleteVideoMutation } from '@videos/services/video.service'

import { UserAvatar } from '@users/components/UserAvatar/UserAvatar.component'

import {
  VideoCardRootStyle,
  VideoCardThumbnail,
  VideoCardThumbnailContainer,
} from './VideoSliderCard.style'

interface PropsVideo {
  video: Video
}

const VideoSliderOption: React.FC<PropsVideo> = ({ video }) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)
  const { t } = useTranslation('home')
  const [deleteVideo] = useDeleteVideoMutation()

  const handleDelete = async () => {
    try {
      await deleteVideo({ slug: video?.slug! }).unwrap()
      snackbarService.notify(CrudAction.DELETE, Endpoint.Videos)
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }

  return (
    <CardMenu
      updateHref={`/videos/${video.slug}/update`}
      onDelete={handleDelete}
      publisherId={video?.publisher?.id!}
      type="videos"
    >
      <MenuItem component={RouterLink} to={`/videos/${video?.slug}`}>
        <ListItemIcon>
          <InfoOutlined fontSize="small" />
        </ListItemIcon>
        <ListItemText>{t('sliders.videoCard.infoMenu.info')}</ListItemText>
      </MenuItem>
    </CardMenu>
  )
}

interface Props {
  video: Video
  isFetching?: boolean
}

export const VideoSliderCard = ({ video, isFetching = false }: Props) => {
  const { t } = useTranslation('videos')
  const { user } = useAuth()
  const isAdmin = user?.roles?.length && user?.roles?.includes(Role.Admin)

  return (
    <VideoCardRootStyle>
      {!video || isFetching ? (
        <>
          <AspectRatioBox ratio={16 / 9}>
            <Skeleton
              sx={{
                borderRadius: '8px',
                height: '100%',
                width: '100%',
              }}
              animation="wave"
              variant="rectangular"
            />
          </AspectRatioBox>
          <Stack
            sx={{
              mt: {
                xs: 1,
                md: 2,
              },
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 28px',
              }}
            >
              <Skeleton animation="wave" width="95%" height={25} />
            </Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Skeleton
                sx={{ flexShrink: 0 }}
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
              <Box>
                <Skeleton animation="wave" width="60%" height={15} />
                <Skeleton animation="wave" width="50%" height={15} />
              </Box>
            </Stack>
          </Stack>
        </>
      ) : (
        <>
          <AspectRatioBox ratio={16 / 9} sx={{ borderRadius: 1 }}>
            <Link
              underline="none"
              color="inherit"
              component={RouterLink}
              to={videoSlugLink(video)}
            >
              <VideoCardThumbnailContainer
                watchedPercent={video.watchtime?.watchedPercent}
              >
                <VideoCardThumbnail
                  loading="lazy"
                  src={video?.thumbnail}
                  onError={(e: any) => {
                    e.target.src = '/images/dumb_thumbnail.jpg'
                    e.preventDefault()
                    e.onerror = null
                  }}
                  alt={`${video?.title} thumbnail`}
                />
              </VideoCardThumbnailContainer>
            </Link>
          </AspectRatioBox>
          <Stack
            sx={{
              mt: {
                xs: 1,
                md: 2,
              },
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 28px',
              }}
            >
              <Link
                underline="none"
                color="inherit"
                component={RouterLink}
                to={videoSlugLink(video)}
                sx={{
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <Tooltip title={video?.title} followCursor>
                  <Typography
                    fontWeight="bold"
                    variant="subtitle1"
                    noWrap={false}
                    sx={{
                      fontSize: {
                        xs: '0.8rem',
                        md: '1rem',
                        lineHeight: '1.5em',
                        height: '3em',
                        overflow: 'hidden',
                      },
                    }}
                  >
                    {video?.title}
                  </Typography>
                </Tooltip>
              </Link>
              {(video.publisher!.id === user!.id || isAdmin) && (
                <VideoSliderOption video={video} />
              )}
            </Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Link
                underline="none"
                color="inherit"
                to={`/users/${video.publisher?.id}/profile/videos`}
                component={RouterLink}
              >
                <UserAvatar
                  sx={{
                    borderRadius: '100%',
                    width: {
                      xs: 25,
                      sm: 30,
                    },
                    height: {
                      xs: 25,
                      sm: 30,
                    },
                  }}
                  user={video.publisher!}
                />
              </Link>
              <Box
                sx={{
                  width: '80%',
                }}
              >
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: {
                      xs: '0.7rem',
                      md: '0.9rem',
                    },
                    lineHeight: 1,
                  }}
                  variant="body2"
                  noWrap={true}
                >
                  {`${video.publisher?.firstName} ${video.publisher?.lastName}`}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: {
                      xs: '0.6rem',
                      md: '0.8rem',
                    },
                  }}
                  variant="body2"
                  noWrap={true}
                >
                  {`${abbreviateNumber(video?.views || 0)} ${t<string>(
                    'slug.details.tooltips.views'
                  )}${video?.views && video?.views > 1 ? 's' : ''} - `}
                  {getPublishLabel(video?.createdAt)}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </>
      )}
    </VideoCardRootStyle>
  )
}
