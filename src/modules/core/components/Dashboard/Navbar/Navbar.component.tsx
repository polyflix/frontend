import AddIcon from '@mui/icons-material/Add'
import { Fab, Stack, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import { VideoService } from '@videos/service/video.service'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { LanguageButton } from '@core/components/LanguageButton/LanguageButton.component'
import { Logo } from '@core/components/Logo/Logo.component'
import { SearchBar } from '@core/components/SearchBar/SearchBar.component'
import { useSidebar } from '@core/hooks/useSidebar.hook'

import { NotificationsPopover } from '../../NotificationPopOver/NotificationPopOver.component'
import { RootStyle, ToolbarStyle } from './Navbar.style'

export const DashboardNavbar: React.FC<PropsWithChildren<{}>> = ({}) => {
  const { open } = useSidebar()
  const { t } = useTranslation('common')

  const videoService = useInjection<VideoService>(VideoService)

  return (
    <RootStyle open={open}>
      <ToolbarStyle>
        <Logo />
        <Box sx={{ flexGrow: 1 }} />
        <SearchBar />
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 1, sm: 2 }}
          sx={{
            color: (theme) => theme.palette.grey[600],
          }}
        >
          <LanguageButton />
          <NotificationsPopover />
          <Tooltip
            title={t<string>('navbar.actions.add.media')}
            onClick={() => videoService.findAll().then()}
          >
            <Fab color="primary" aria-label="add" size="small">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  )
}
