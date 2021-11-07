import {
  Delete,
  Edit,
  InfoOutlined,
  MoreVertOutlined,
} from '@mui/icons-material'
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const CollectionCardMenu = () => {
  const { t } = useTranslation('collections')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

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
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {t('explore.collectionCard.menu.items.edit')}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <InfoOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {t('explore.collectionCard.menu.items.view')}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {t('explore.collectionCard.menu.items.delete')}
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
