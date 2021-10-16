import { Stack, Typography } from '@mui/material'
import { PropsWithChildren } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { LanguageButton } from '@core/components/LanguageButton/LanguageButton.component'
import { Logo } from '@core/components/Logo/Logo.component'
import { MHidden } from '@core/components/MHidden/MHidden.component'
import { HeaderBaseStyle } from '@core/styles/HeaderBase.style'

export const AuthLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <HeaderBaseStyle>
      <RouterLink style={{ textDecoration: 'none' }} to="/">
        <Logo />
      </RouterLink>

      <MHidden width="smDown">
        <Stack direction="row" alignItems="center">
          <Typography variant="body1" sx={{ mr: 2 }}>
            {children}
          </Typography>
          <LanguageButton />
        </Stack>
      </MHidden>
    </HeaderBaseStyle>
  )
}
