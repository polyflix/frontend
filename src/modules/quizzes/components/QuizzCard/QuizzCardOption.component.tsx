import {
  Delete,
  Edit,
  ListAlt,
  MoreVertOutlined,
  PlayArrow,
} from '@mui/icons-material'
import {
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { DeleteQuizzModal } from '../DeleteQuizzModal/DeleteQuizzModal.component'

interface OptionProps {
  id: string
}

//CRUD management in user profile
export const QuizzSliderOption = ({ id }: OptionProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [isDeleteQuizzModalOpen, setIsDeleteQuizzModalOpen] =
    useState<boolean>(false)
  const { t } = useTranslation('quizzes')

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
        <Link
          component={RouterLink}
          to={`/quizzes/${id}/play`}
          underline="none"
          color="inherit"
        >
          <MenuItem>
            <ListItemIcon>
              <PlayArrow fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('card.options.play')}</ListItemText>
          </MenuItem>
        </Link>
        <Link
          component={RouterLink}
          to={`/quizzes/${id}/results`}
          underline="none"
          color="inherit"
        >
          <MenuItem>
            <ListItemIcon>
              <ListAlt fontSize="small" />
            </ListItemIcon>
            <ListItemText> {t('card.options.seeResults')}</ListItemText>
          </MenuItem>
        </Link>
        <Link
          component={RouterLink}
          to={`/quizzes/${id}/update`}
          underline="none"
          color="inherit"
        >
          <MenuItem>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText> {t('card.options.edit')}</ListItemText>
          </MenuItem>
        </Link>
        <MenuItem onClick={() => setIsDeleteQuizzModalOpen(true)}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText> {t('forms.delete.action.delete')}</ListItemText>
        </MenuItem>
      </Menu>
      <DeleteQuizzModal
        id={id}
        open={isDeleteQuizzModalOpen}
        setIsOpen={setIsDeleteQuizzModalOpen}
        onClose={() => setIsDeleteQuizzModalOpen(false)}
      />
    </>
  )
}
