import Box from '@mui/material/Box'
import React, { PropsWithChildren } from 'react'

import { LanguageButton } from '@core/components/LanguageButton/LanguageButton.component'
import { Logo } from '@core/components/Logo/Logo.component'

export const PublicDashboardLayout: React.FC = ({
  children,
}: PropsWithChildren<{}>) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Logo />
        <LanguageButton />
      </Box>
      <Box
        sx={{
          width: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
