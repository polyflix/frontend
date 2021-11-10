import { Delete, Edit, MoreVertOutlined } from '@mui/icons-material'
import {
  capitalize,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useConfirmModal } from '@core/hooks/useConfirmModal.hook'

type Props = {
  updateHref: string
  onDelete: () => void
}

/**
 * This component is the little menu inside collection / course cards.
 * You can add children to have some more custom item, there are shown above
 * the default Update / Delete items
 */
export const CardMenu: React.FC<Props> = ({
  updateHref,
  onDelete,
  children,
}) => {
  const { t } = useTranslation('common')
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

  const { Modal, onClick: onClickModal } = useConfirmModal({
    title: t('deleteModal.title'),
    content: t('deleteModal.content'),
    onCancel: () => {
      handleClose()
    },
    onConfirm: () => {
      handleClose()
      onDelete()
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
        {children}
        <MenuItem onClick={handleClose} component={Link} to={updateHref}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>{capitalize(t('actions.update'))}</ListItemText>
        </MenuItem>
        <MenuItem onClick={onClickModal}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>{capitalize(t('actions.delete'))}</ListItemText>
        </MenuItem>
      </Menu>
      <Modal />
    </>
  )
}
