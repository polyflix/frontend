import AddIcon from '@mui/icons-material/Add'
import { Fab, Stack, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import React, { PropsWithChildren } from 'react'

import { Icon } from '@core/components/Icon/Icon.component'
import { Logo } from '@core/components/Logo/Logo.component'

import { NotificationsPopover } from '../../NotificationPopOver/NotificationPopOver.component'
import { RootStyle, ToolbarStyle } from './DashBoardNavbar.style'

type DashBoardNavbarProps = {
  isOpenSidebar: boolean
}

export const DashBoardNavbar: React.FC<
  PropsWithChildren<DashBoardNavbarProps>
> = ({ isOpenSidebar }) => {
  return (
    <RootStyle open={isOpenSidebar}>
      <ToolbarStyle>
        <Logo />
        <Box sx={{ flexGrow: 1 }} />
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 1, sm: 2 }}
          sx={{
            color: (theme) => theme.palette.grey[600],
          }}
        >
          <Icon name="ic:round-language" />
          <NotificationsPopover />
          <Tooltip title="Add media">
            <Fab color="primary" aria-label="add" size="small">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  )
}
