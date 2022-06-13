import { Delete, Edit, MoreVertOutlined } from '@mui/icons-material'
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { capitalize } from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useConfirmModal } from '@core/hooks/useConfirmModal.hook'
import { Role } from '@core/types/roles.type'

import { useAuth } from '@auth/hooks/useAuth.hook'

type Props = {
  updateHref: string
  onDelete: () => void
  publisherId?: string
  type?:
    | 'common'
    | 'videos'
    | 'modules'
    | 'courses'
    | 'quizzes'
    | 'links'
    | 'cursus'
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
  publisherId,
  type = 'common',
}) => {
  const { t } = useTranslation('common')
  const { user } = useAuth()
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
    title: t('deleteModal.title', { ns: type }),
    content: t('deleteModal.content', { ns: type }),
    onCancel: () => {
      handleClose()
    },
    onConfirm: () => {
      handleClose()
      onDelete()
    },
  })

  const isMine: boolean = (user && publisherId === user.id) ?? false
  const isAdmin = user?.roles?.length && user?.roles?.includes(Role.Admin)

  return (
    <>
      {(React.Children.count(children) > 0 || !publisherId || isMine) && (
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
      )}
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
        {(!publisherId || isMine || isAdmin) && (
          <MenuItem onClick={handleClose} component={Link} to={updateHref}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>{capitalize(t('actions.update'))}</ListItemText>
          </MenuItem>
        )}
        {(!publisherId || isMine || isAdmin) && (
          <MenuItem onClick={onClickModal}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>{capitalize(t('actions.delete'))}</ListItemText>
          </MenuItem>
        )}
      </Menu>
      <Modal />
    </>
  )
}
