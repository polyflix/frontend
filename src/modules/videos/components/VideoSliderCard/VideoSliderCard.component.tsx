import {
  InfoOutlined,
  MoreVertOutlined,
  Edit,
  Delete,
} from '@mui/icons-material'
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
  Link,
  Tooltip,
} from '@mui/material'
import { abbreviateNumber } from 'js-abbreviation-number'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { AspectRatioBox } from '@core/components/AspectRatioBox/AspectRation.component'
import { getPublishLabel } from '@core/helpers/date.helper'
import { videoSlugLink } from '@core/helpers/video.helper'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { DeleteVideoModal } from '@videos/components/DeleteVideoModal/DeleteVideoModal.component'
import { Video } from '@videos/models/video.model'

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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { t } = useTranslation('home')
  const { user } = useAuth()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <IconButton
        aria-label="video menu"
        size="small"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          width: '100%',
        }}
      >
        <MoreVertOutlined fontSize="inherit" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem component={RouterLink} to={`/videos/${video?.slug}`}>
          <ListItemIcon>
            <InfoOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('sliders.videoCard.infoMenu.info')}</ListItemText>
        </MenuItem>
        {video.publishedBy!.id === user?.id && (
          <>
            <MenuItem
              onClick={() => {
                setIsDeleteModalOpen(true)
              }}
            >
              <ListItemIcon sx={{ color: 'error.main' }}>
                <Delete fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                {t('slug.details.menu.items.delete', { ns: 'videos' })}
              </ListItemText>
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to={`/videos/${video?.slug}/update`}
            >
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                {t('slug.details.menu.items.edit', { ns: 'videos' })}
              </ListItemText>
            </MenuItem>
          </>
        )}
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PlaylistAddOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {t('sliders.videoCard.infoMenu.addToPlayList')}
          </ListItemText>
        </MenuItem> */}
      </Menu>
      <DeleteVideoModal
        id={video.id}
        open={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        goBackonSuccess={false}
      />
    </>
  )
}

interface Props {
  video: Video
  isFetching?: boolean
}

export const VideoSliderCard = ({ video, isFetching = false }: Props) => {
  const { t } = useTranslation('videos')

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
          <Stack sx={{ mt: 2 }} direction="row">
            <Skeleton
              sx={{ flexShrink: 0 }}
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
            <Box sx={{ pl: 1, width: '100%' }}>
              <Skeleton animation="wave" width="95%" height={25} />
              <Skeleton animation="wave" width="60%" height={15} />
            </Box>
          </Stack>
        </>
      ) : (
        <>
          <AspectRatioBox
            ratio={16 / 9}
            sx={{ bgcolor: 'grey.400', borderRadius: 1 }}
          >
            <Link
              underline="none"
              color="inherit"
              component={RouterLink}
              to={videoSlugLink(video)}
            >
              <VideoCardThumbnailContainer
                watchedPercent={video.userMeta?.watchedPercent}
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
            }}
            direction="row"
          >
            <UserAvatar
              sx={{
                borderRadius: '100%',
                width: {
                  xs: 30,
                  sm: 40,
                },
                height: {
                  xs: 30,
                  sm: 40,
                },
              }}
              user={video.publishedBy!}
            />
            <Box
              sx={{
                pl: 1,
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
                      noWrap={true}
                      sx={{
                        fontSize: {
                          xs: '0.8rem',
                          md: '1rem',
                        },
                      }}
                    >
                      {video?.title}
                    </Typography>
                  </Tooltip>
                </Link>
                <VideoSliderOption video={video} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    width: 'calc(100% - 50px)',
                    fontSize: {
                      xs: '0.7rem',
                      md: '0.9rem',
                    },
                    lineHeight: 1,
                  }}
                  variant="body2"
                  noWrap={true}
                >
                  {video.publishedBy?.displayName}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    width: 'calc(100% - 50px)',
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
            </Box>
          </Stack>
        </>
      )}
    </VideoCardRootStyle>
  )
}
