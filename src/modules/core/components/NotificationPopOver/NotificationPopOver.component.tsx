import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useRef, useState } from 'react'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { MenuPopover } from '@core/components/MenuPopOver/MenuPopOver.component'
import { Scrollbar } from '@core/components/Scrollbar/Scrollbar.component'

enum NotificationType {}
// TODO

interface Notification {
  id: number
  title: string
  description: string
  avatar: string
  type: NotificationType
  createdAt: number
  isUnRead: boolean
}

const renderContent = (notification: Notification) => {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography
        component="span"
        variant="body2"
        sx={{ color: 'text.secondary' }}
      >
        &nbsp; {notification.description.toLocaleLowerCase()}
      </Typography>
    </Typography>
  )

  switch (notification.type) {
    default:
      return {
        avatar: (
          <img
            alt={notification.title}
            src="https://www.thesprucepets.com/thmb/sfuyyLvyUx636_Oq3Fw5_mt-PIc=/3760x2820/smart/filters:no_upscale()/adorable-white-pomeranian-puppy-spitz-921029690-5c8be25d46e0fb000172effe.jpg"
          />
        ),
        title,
      }
  }
}

type NotificationItemProps = {
  notification: Notification
}

const NotificationItem: React.FC<PropsWithChildren<NotificationItemProps>> = ({
  notification,
}) => {
  const { avatar, title } = renderContent(notification)

  const formatDate = (date: number): string => {
    // TODO
    return date.toLocaleString()
  }

  return (
    <ListItemButton
      to="#"
      disableGutters
      component={RouterLink}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Box sx={{ mr: 0.5, width: 16, height: 16 }} />
            <Icon name="eva:clock-fill" />
            {formatDate(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  )
}

export const NotificationsPopover: React.FC = () => {
  const anchorRef = useRef(null)
  const [open, setOpen] = useState(false)
  const { t } = useTranslation('common')
  const [notifications, setNotifications] = useState<Notification[] | []>([])
  const totalUnRead = notifications.filter(
    (item: Notification) => item.isUnRead === true
  ).length

  const handleOpen = () => {
    console.log('This feature is currently disabled') // setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleMarkAllAsRead = () => {
    // TODO
    setNotifications(notifications)
  }

  return (
    <>
      <Tooltip title={t<string>('soon')}>
        <IconButton
          ref={anchorRef}
          size="large"
          color={open ? 'primary' : 'default'}
          onClick={handleOpen}
          sx={{
            ...(open && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.focusOpacity
                ),
            }),
          }}
        >
          <Badge badgeContent={totalUnRead} color="error">
            <Icon name="eva:bell-fill" />
          </Badge>
        </IconButton>
      </Tooltip>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 360 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Icon name="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: 'overline' }}
              >
                New
              </ListSubheader>
            }
          >
            {notifications.slice(0, 2).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: 'overline' }}
              >
                Before that
              </ListSubheader>
            }
          >
            {notifications.slice(2, 5).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </List>
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple component={RouterLink} to="#">
            View All
          </Button>
        </Box>
      </MenuPopover>
    </>
  )
}
