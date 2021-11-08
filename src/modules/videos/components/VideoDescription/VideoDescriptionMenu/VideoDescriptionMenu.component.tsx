/* eslint-disable react/prop-types */
import { MoreVertOutlined, Edit, Delete } from '@mui/icons-material'
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { Video } from '@videos/models/video.model'
import { useDeleteVideoMutation } from '@videos/services/video.service'

type Props = {
  video?: Video | null
}

export const VideoDescriptionMenu: React.FC<Props> = ({ video }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { t } = useTranslation('videos')
  const history = useHistory()
  const { user } = useAuth()

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [deleteVideo] = useDeleteVideoMutation()

  return (
    <>
      {video.publishedBy.id === user.id && (
        <>
          <IconButton
            disableRipple={true}
            aria-label="video menu"
            size="small"
            aria-controls="basic-menu"
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{
              top: '1rem',
              right: '1rem',
              position: {
                xs: 'absolute',
                md: 'static',
              },
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
            <MenuItem
              onClick={() => {
                deleteVideo({ id: video?.id })
                history.goBack()
              }}
            >
              <ListItemIcon sx={{ color: 'error.main' }}>
                <Delete fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('slug.details.menu.items.delete')}</ListItemText>
            </MenuItem>
            <MenuItem component={Link} to={`/videos/${video?.slug}/update`}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t('slug.details.menu.items.edit')}</ListItemText>
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  )
}
