import { ManageSearch, Person, Settings } from '@mui/icons-material'
import {
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import Box from '@mui/material/Box'
import React, { PropsWithChildren, useEffect } from 'react'
import { Link as RouterLink, useLocation, useHistory } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { Logo } from '@core/components/Logo/Logo.component'
import { Spotlight } from '@core/components/Spotlight/Spotlight.component'

import { UserAvatar } from '@users/components/UserAvatar/UserAvatar.component'

import { RootStyle, ToolbarStyle } from './Navbar.style'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Logout } from '@auth/components/Logout/Logout.component'
import { usePopOverModal } from '@studio/hooks/use-pop-over-modal.hook'
import { polyflixRouter } from '@core/utils/routes'
import { HasRoles } from '@core/components/HasRoles/HasRoles.component'
import { Role } from '@core/types/roles.type'
import { LanguageButton } from '@core/components/LanguageButton/LanguageButton.component'

export const DashboardNavbar: React.FC<PropsWithChildren<{}>> = () => {
  const { pathname } = useLocation()

  const { t } = useTranslation('common')

  const isHomePage = (): boolean => pathname === '/'
  const theme = useTheme()
  const {
    PopOver: AvatarPopOver,
    onClick: onClickAvatar,
    handleClose: handleCloseAvatar,
  } = usePopOverModal()
  const {
    PopOver: StudioPopOver,
    onClick: onClickStudio,
    handleClose: handleCloseStudio,
  } = usePopOverModal()

  const toolBarRef = useRef<HTMLElement>()
  const toolBarContainerRef = useRef<HTMLElement>()
  const handleScroll = () => {
    if (!toolBarRef.current || !toolBarContainerRef.current) {
      return
    }
    if (window.scrollY > 0) {
      toolBarRef.current.style.backgroundColor =
        theme.palette.background.default
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

  const history = useHistory()
  const goBack = () => {
    history.goBack()
  }

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
          <Typography
            variant="caption"
            sx={{
              color: 'grey.500',
              alignSelf: 'center',
              paddingX: 2,
              cursor: 'pointer',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
            }}
            onClick={goBack}
          >
            {t('actions.goBack')}
          </Typography>
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
            <IconButton onClick={onClickAvatar}>
              <UserAvatar />
            </IconButton>
            <HasRoles roles={[Role.Admin, Role.Contributor]}>
              <Tooltip title={t('navbar.tooltip.create')}>
                <IconButton onClick={onClickStudio}>
                  <Icon name="uil:create-dashboard" />
                </IconButton>
              </Tooltip>
            </HasRoles>

            <LanguageButton />
            <Logout />

            <StudioPopOver>
              <List>
                <ListItemButton
                  component={RouterLink}
                  onClick={handleCloseStudio}
                  to={polyflixRouter().studio.videos.create}
                >
                  <ListItemIcon>
                    <Icon name="eva:play-circle-outline" />
                  </ListItemIcon>
                  <ListItemText primary={t('navbar.actions.createVideo')} />
                </ListItemButton>
                <ListItemButton
                  component={RouterLink}
                  onClick={handleCloseStudio}
                  to={polyflixRouter().studio.quizzes.create}
                >
                  <ListItemIcon>
                    <Icon name="healthicons:i-exam-multiple-choice" />
                  </ListItemIcon>
                  <ListItemText primary={t('navbar.actions.createQuizz')} />
                </ListItemButton>
                <ListItemButton
                  component={RouterLink}
                  onClick={handleCloseStudio}
                  to={polyflixRouter().studio.courses.create}
                >
                  <ListItemIcon>
                    <Icon name="gg:align-left" />
                  </ListItemIcon>
                  <ListItemText primary={t('navbar.actions.createCourse')} />
                </ListItemButton>
              </List>
            </StudioPopOver>

            <AvatarPopOver>
              <List>
                <ListItemButton
                  component={RouterLink}
                  onClick={handleCloseAvatar}
                  to="/users/profile/videos"
                >
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary={t('navbar.actions.profile')} />
                </ListItemButton>
                <HasRoles roles={[Role.Admin, Role.Contributor]}>
                  <ListItemButton
                    component={RouterLink}
                    onClick={handleCloseAvatar}
                    to="/studio"
                  >
                    <ListItemIcon>
                      <ManageSearch />
                    </ListItemIcon>
                    <ListItemText
                      primary={t('navbar.actions.contentManagement')}
                    />
                  </ListItemButton>
                </HasRoles>
                <ListItemButton
                  component={RouterLink}
                  onClick={handleCloseAvatar}
                  to="/users/profile/settings"
                >
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText primary={t('navbar.actions.settings')} />
                </ListItemButton>
              </List>
            </AvatarPopOver>
          </Stack>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  )
}
