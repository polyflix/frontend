import { Edit, MoreVert } from '@mui/icons-material'
import {
  Alert,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
} from '@mui/material'
import { Header } from '../../components/header.component'
import { GhostList } from '../../components/ghost-list.component'
import { Link as RouterLink } from 'react-router-dom'
import { usePopOverModal } from '@studio/hooks/use-pop-over-modal.hook'
import { Icon } from '@core/components/Icon/Icon.component'
import { polyfilxRouter } from '@core/utils/routes'
import { useTranslation } from 'react-i18next'
import { useGetUsersQuery } from '@users/services/user.service'
import { User } from '@users/models/user.model'
import { UserAvatar } from '@users/components/UserAvatar/UserAvatar.component'

export const UsersListPage = () => {
  const { data, isLoading, isFetching, isError } = useGetUsersQuery({
    page: 1,
    pageSize: 5,
  })

  const { PopOver, onClick, handleClose, outputData } = usePopOverModal()

  const { t } = useTranslation('studio')

  const content = () => {
    if (isLoading || isFetching) {
      return <GhostList />
    }

    if (isError) {
      return (
        <Box sx={{ pt: 2 }}>
          <Alert severity="error">{t('common.errors.global')}</Alert>
        </Box>
      )
    }

    const users = data?.data || []

    if (users.length === 0) {
      return (
        <Box sx={{ pt: 2 }}>
          <Alert severity="info">{t('users.noData')}</Alert>
        </Box>
      )
    }

    return (
      <>
        <List component={Stack} direction="column" gap={1} sx={{ pt: 2 }}>
          {users.map((user: User) => (
            <ListItem
              key={user.id}
              component={Paper}
              variant="outlined"
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={(e) => onClick(e, user)}
                >
                  <MoreVert />
                </IconButton>
              }
            >
              <ListItemButton
                component={RouterLink}
                to={polyfilxRouter().studio.users.view(user?.id)}
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
                    marginRight: 2,
                  }}
                  user={user}
                />
                <ListItemText primary={user.username} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <PopOver>
          <List>
            <ListItemButton
              component={RouterLink}
              onClick={handleClose}
              to={polyfilxRouter().studio.users.view(outputData?.id)}
            >
              <ListItemIcon>
                <Icon name="eva:eye-outline" />
              </ListItemIcon>
              <ListItemText primary={'View'} />
            </ListItemButton>
            <ListItemButton
              component={RouterLink}
              onClick={handleClose}
              to={polyfilxRouter().studio.users.update(outputData?.id)}
            >
              <ListItemIcon>
                <Edit />
              </ListItemIcon>
              <ListItemText primary={'Edit'} />
            </ListItemButton>
          </List>
        </PopOver>
      </>
    )
  }

  return (
    <Box
      sx={{
        width: '100%',
        px: 2,
      }}
    >
      <Header
        title={t('users.title')}
        description={t('users.description')}
        createAvailable={false}
      />
      {content()}
    </Box>
  )
}
