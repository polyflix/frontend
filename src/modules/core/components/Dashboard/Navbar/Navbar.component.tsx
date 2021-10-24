import AddIcon from '@mui/icons-material/Add'
import {
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Box from '@mui/material/Box'
import React, { PropsWithChildren, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Icon } from '@core/components/Icon/Icon.component'
import { LanguageButton } from '@core/components/LanguageButton/LanguageButton.component'
import { Logo } from '@core/components/Logo/Logo.component'
import { SearchBar } from '@core/components/SearchBar/SearchBar.component'
import { ThemeButton } from '@core/components/ThemeButton/ThemeButton.component'
import { useSidebar } from '@core/hooks/useSidebar.hook'

import { NotificationsPopover } from '../../NotificationPopOver/NotificationPopOver.component'
import { RootStyle, ToolbarStyle } from './Navbar.style'

export const DashboardNavbar: React.FC<PropsWithChildren<{}>> = ({}) => {
  const { open, toggle } = useSidebar()
  const { t } = useTranslation('common')
  const [openDial, setOpenDial] = useState(false)

  const th = useTheme()
  const ltmd = useMediaQuery(th.breakpoints.down('md'))

  const actions = [
    { icon: <Icon name="eva:pie-chart-2-fill" />, name: 'speedDial.quizz' },
    { icon: <Icon name="eva:video-fill" />, name: 'speedDial.video' },
  ]
  return (
    <RootStyle open={open}>
      <ToolbarStyle>
        <Box
          onClick={() => toggle()}
          sx={{
            display: {
              sm: 'none',
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
        <SearchBar />
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ sm: 0, md: 1, lg: 2 }}
          sx={{
            color: (theme) => theme.palette.grey[600],
          }}
        >
          <LanguageButton />
          <NotificationsPopover />
          <Box
            sx={{
              display: {
                sm: 'block',
                xs: 'none',
              },
            }}
          >
            <ThemeButton />
          </Box>
          <Tooltip
            sx={{
              display: {
                md: 'flex',
                xs: 'none',
              },
              position: {
                md: 'static',
                xs: 'fixed',
              },
              bottom: 16,
              right: 16,
            }}
            title={t<string>('navbar.actions.add.media')}
          >
            <Fab
              color="primary"
              aria-label="add"
              size={ltmd ? 'medium' : 'small'}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
          <SpeedDial
            ariaLabel="media speedDial"
            sx={{
              display: {
                md: 'none',
                xs: 'flex',
              },
              position: {
                md: 'static',
                xs: 'fixed',
              },
              bottom: 16,
              right: 16,
            }}
            icon={<SpeedDialIcon />}
            direction={ltmd ? 'up' : 'down'}
            onClose={() => setOpenDial(false)}
            onOpen={() => setOpenDial(true)}
            open={openDial}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={t(action.name)}
                onClick={() => setOpenDial(true)}
              />
            ))}
          </SpeedDial>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  )
}
