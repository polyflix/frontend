import { ManageSearch, Person, Settings } from '@mui/icons-material'
import {
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Stack,
  SxProps,
  useTheme,
} from '@mui/material'
import { Theme } from '@mui/material'
import Box from '@mui/material/Box'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { Logo } from '@core/components/Logo/Logo.component'
import { ArrowStyle } from '@core/components/MenuPopOver/MenuPopOver.style'
import { Spotlight } from '@core/components/Spotlight/Spotlight.component'

import { UserAvatar } from '@users/components/UserAvatar/UserAvatar.component'

import { RootStyle, ToolbarStyle } from './Navbar.style'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Logout } from '@auth/components/Logout/Logout.component'

type UsePopOverModalReturnProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  handleClose: () => void
  PopOver: ({
    children,
    sx,
  }: PropsWithChildren<MenuPopoverProps>) => JSX.Element
}

type MenuPopoverProps = {
  sx?: SxProps<Theme>
}

export const usePopOverModal = (): UsePopOverModalReturnProps => {
  const [isOpen, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget)
    setOpen(!isOpen)
  }

  const handleClose = () => {
    setAnchor(null)
    setOpen(false)
  }

  const PopOver = ({ children, sx }: PropsWithChildren<MenuPopoverProps>) => (
    <Popover
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          mt: 1.5,
          ml: 0.5,
          overflow: 'inherit',
          boxShadow: (theme) => theme.shadows[2],
          border: (theme) => `solid 1px ${theme.palette.background.paper}`,
          background: (theme) => theme.palette.background.paper,
          ...sx,
        },
      }}
      open={isOpen}
      onClose={handleClose}
      anchorEl={anchor}
    >
      <ArrowStyle className="arrow" />

      {children}
    </Popover>
  )

  return { PopOver, onClick, handleClose }
}

export const DashboardNavbar: React.FC<PropsWithChildren<{}>> = () => {
  const { pathname } = useLocation()

  const { t } = useTranslation('common')

  const isHomePage = (): boolean => pathname === '/'
  const theme = useTheme()
  const { PopOver, onClick, handleClose } = usePopOverModal()

  const toolBarRef = useRef<HTMLElement>()
  const toolBarContainerRef = useRef<HTMLElement>()
  const handleScroll = () => {
    if (!toolBarRef.current || !toolBarContainerRef.current) {
      return
    }
    if (window.scrollY > 0) {
      toolBarRef.current.style.backgroundColor = '#fff'
      toolBarContainerRef.current.style.border = 'none'
    } else {
      toolBarRef.current.style.backgroundColor = 'transparent'
      toolBarContainerRef.current.style.borderBottom = `1px solid ${theme.palette.grey[400]}`
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <RootStyle>
      <ToolbarStyle ref={toolBarRef}>
        <Stack
          ref={toolBarContainerRef}
          direction="row"
          sx={{
            margin: '0 auto',
            height: '100%',
            width: '100%',
            maxWidth: 'clamp(1100px, 80vw, 1750px)',
            borderBottom: (th) => `1px solid ${th.palette.grey[400]}`,
          }}
        >
          <Box
            sx={{
              display: {
                md: 'none',
                xs: 'flex',
              },
              color: 'grey.600',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 2,
              cursor: 'pointer',
            }}
          >
            <Icon name="eva:menu-fill" />
          </Box>
          <Logo />
          <Box sx={{ flexGrow: 1 }} />
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ sm: 0, md: 1, lg: 2 }}
            sx={{
              color: (th) => th.palette.grey[600],
            }}
          >
            {!isHomePage() && <Spotlight />}
            {/* <LanguageButton />
          <Logout /> */}

            <IconButton onClick={onClick}>
              <UserAvatar />
            </IconButton>
            <Logout />
            <PopOver>
              <List>
                <ListItemButton
                  component={RouterLink}
                  onClick={handleClose}
                  to="/users/profile/videos"
                >
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary={t('navbar.actions.profile')} />
                </ListItemButton>
                <ListItemButton disabled={true} onClick={handleClose}>
                  <ListItemIcon>
                    <ManageSearch />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('navbar.actions.contentManagement')}
                  />
                </ListItemButton>
                <ListItemButton
                  component={RouterLink}
                  onClick={handleClose}
                  to="/users/profile/settings"
                >
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText primary={t('navbar.actions.settings')} />
                </ListItemButton>
              </List>
            </PopOver>
          </Stack>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  )
}
