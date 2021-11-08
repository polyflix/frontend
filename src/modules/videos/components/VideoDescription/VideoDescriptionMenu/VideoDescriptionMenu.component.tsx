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
import { Link } from 'react-router-dom'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { DeleteVideoModal } from '@videos/components/DeleteVideoModal/DeleteVideoModal.component'
import { Video } from '@videos/models/video.model'

type Props = {
  video?: Video | null
}

export const VideoDescriptionMenu: React.FC<Props> = ({ video }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { t } = useTranslation('videos')
  const { user } = useAuth()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

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
                setIsDeleteModalOpen(true)
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
          <DeleteVideoModal
            id={video.id}
            open={isDeleteModalOpen}
            setIsOpen={setIsDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            goBackonSuccess={true}
          />
        </>
      )}
    </>
  )
}
