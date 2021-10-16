import AddIcon from '@mui/icons-material/Add'
import { Fab, Stack, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageButton } from '@core/components/LanguageButton/LanguageButton.component'
import { Logo } from '@core/components/Logo/Logo.component'
import { SearchBar } from '@core/components/SearchBar/SearchBar.component'
import { useSidebar } from '@core/hooks/useSidebar.hook'

import { NotificationsPopover } from '../../NotificationPopOver/NotificationPopOver.component'
import { RootStyle, ToolbarStyle } from './Navbar.style'

export const DashboardNavbar: React.FC<PropsWithChildren<{}>> = ({}) => {
  const { open } = useSidebar()
  const { t } = useTranslation('common')

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
          <Tooltip title={t<string>('navbar.actions.add.media')}>
            <Fab color="primary" aria-label="add" size="small">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  )
}
