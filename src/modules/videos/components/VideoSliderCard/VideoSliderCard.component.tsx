import {
  InfoOutlined,
  MoreVertOutlined,
  PlaylistAddOutlined,
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Link,
} from '@mui/material'
import { abbreviateNumber } from 'js-abbreviation-number'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { AspectRatioBox } from '@core/components/AspectRatioBox/AspectRation.component'
import { getPublishLabel } from '@core/helpers/date.helper'
import { videoSlugLink } from '@core/helpers/video.helper'

import { Video } from '@videos/models/video.model'

import { VideoCardRootStyle, VideoCardThumbnail } from './VideoSliderCard.style'

const VideoSliderOption = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { t } = useTranslation('home')

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
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <InfoOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('sliders.videoCard.infoMenu.info')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PlaylistAddOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {t('sliders.videoCard.infoMenu.addToPlayList')}
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

interface Props {
  video: Video
}

export const VideoSliderCard = ({ video }: Props) => {
  const th = useTheme()
  const ltsm: boolean = useMediaQuery(th.breakpoints.down('sm'))

  return (
    <VideoCardRootStyle>
      {!video ? (
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
              <VideoCardThumbnail
                loading="lazy"
                src={video?.thumbnail}
                alt={`${video?.title} thumbnail`}
              />
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
            <Avatar
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
              src="https://mui.com/static/images/avatar/1.jpg"
            />

            <Box
              sx={{
                pl: 1,
                width: (theme) =>
                  `calc(100% - ${ltsm ? 30 : 40}px - ${
                    ltsm ? theme.spacing(1) : theme.spacing(2)
                  })`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Link
                  underline="none"
                  color="inherit"
                  component={RouterLink}
                  to={videoSlugLink(video)}
                >
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
                </Link>
                <VideoSliderOption />
              </Box>
              <Box>
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
                >
                  John Smith
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
                  {`${abbreviateNumber(video?.views || 0)} views - `}
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
