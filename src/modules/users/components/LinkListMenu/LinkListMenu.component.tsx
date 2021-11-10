import { Delete, Edit, MoreVertOutlined } from '@mui/icons-material'
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { useConfirmModal } from '@core/hooks/useConfirmModal.hook'
import { Element } from '@core/models/element.model'

import { Link } from '@links/models/link.model'
import { useDeleteLinkMutation } from '@links/services/link.service'

type LinkListMenuMenuProps = {
  link: Element<Link>
}

export const LinkListMenuMenu = ({ link }: LinkListMenuMenuProps) => {
  const { t } = useTranslation('users')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const [deleteLink] = useDeleteLinkMutation()

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const { Modal, onClick: onClickModal } = useConfirmModal({
    title: t('profile.tabs.links.deleteModal.title'),
    content: t('profile.tabs.links.deleteModal.content'),
    onCancel: () => {
      handleClose()
    },
    onConfirm: () => {
      handleClose()
      deleteLink({ id: link.id })
    },
  })

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
        <MenuItem
          onClick={handleClose}
          component={RouterLink}
          to={`/links/${link.id}/update`}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {t('profile.tabs.links.content.list.menu.actions.edit')}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={onClickModal}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>
            {t('profile.tabs.links.content.list.menu.actions.delete')}
          </ListItemText>
        </MenuItem>
      </Menu>
      <Modal />
    </>
  )
}
