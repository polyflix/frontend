import { Stack } from '@mui/material'
import Box from '@mui/material/Box'
import React, { PropsWithChildren } from 'react'

import { Icon } from '@core/components/Icon/Icon.component'
import { LanguageButton } from '@core/components/LanguageButton/LanguageButton.component'
import { Logo } from '@core/components/Logo/Logo.component'
import { Spotlight } from '@core/components/Spotlight/Spotlight.component'
import { useSidebar } from '@core/hooks/useSidebar.hook'

import { Logout } from '@auth/components/Logout/Logout.component'

import { RootStyle, ToolbarStyle } from './Navbar.style'

export const StudioNavbar: React.FC<PropsWithChildren<{}>> = ({}) => {
  const { open, toggle } = useSidebar()

  return (
    <RootStyle open={open}>
      <ToolbarStyle>
        <Box
          onClick={() => toggle()}
          sx={{
            display: {
              md: 'none',
              sm: 'flex',
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
            color: (theme) => theme.palette.grey[600],
          }}
        >
          <Spotlight />
          <LanguageButton />
          <Logout />
          <Box
            sx={{
              display: {
                sm: 'block',
                xs: 'none',
              },
            }}
          ></Box>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  )
}
