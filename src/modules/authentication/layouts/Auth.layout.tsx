import { Stack, Typography } from '@mui/material'
import { PropsWithChildren } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { LanguageButton } from '@core/components/LanguageButton/LanguageButton.component'
import { Logo } from '@core/components/Logo/Logo.component'
import { MHidden } from '@core/components/MHidden/MHidden.component'
import { ThemeButton } from '@core/components/ThemeButton/ThemeButton.component'
import { HeaderBaseStyle } from '@core/styles/HeaderBase.style'

export const AuthLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <HeaderBaseStyle>
      <RouterLink style={{ textDecoration: 'none' }} to="/">
        <Logo />
      </RouterLink>

      <Stack direction="row" alignItems="center">
        <MHidden width="smDown">
          <Typography variant="body1" sx={{ mr: 2 }}>
            {children}
          </Typography>
        </MHidden>
        <LanguageButton />
        <ThemeButton />
      </Stack>
    </HeaderBaseStyle>
  )
}
