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
import { Link } from 'react-router-dom'

import { useConfirmModal } from '@core/hooks/useConfirmModal.hook'

import { Collection } from '@collections/models/collection.model'
import { useDeleteCollectionMutation } from '@collections/services/collection.service'

type CollectionCardMenuProps = {
  collection: Collection
}

export const CollectionCardMenu = ({ collection }: CollectionCardMenuProps) => {
  const { t } = useTranslation('collections')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const [deleteCollection] = useDeleteCollectionMutation()

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
      deleteCollection({ slug: collection.slug })
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
          component={Link}
          to={`/collections/${collection.slug}/update`}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {t('explore.collectionCard.menu.items.edit')}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={onClickModal}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>
            {t('explore.collectionCard.menu.items.delete')}
          </ListItemText>
        </MenuItem>
      </Menu>
      <Modal />
    </>
  )
}
