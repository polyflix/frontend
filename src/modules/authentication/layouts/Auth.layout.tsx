import { Typography } from '@mui/material'
import { PropsWithChildren } from 'react'
import { Link as RouterLink } from 'react-router-dom'

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
        <Typography variant="body1" sx={{ mt: { md: -2 } }}>
          {children}
        </Typography>
      </MHidden>
    </HeaderBaseStyle>
  )
}
