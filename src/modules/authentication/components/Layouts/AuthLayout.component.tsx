import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { PropsWithChildren } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { Logo } from '@core/components/Logo/Logo.component'
import { MHidden } from '@core/components/MHidden/MHidden.component'

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'end',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'baseline',
    padding: theme.spacing(3, 7, 0, 7),
  },
}))

export const AuthLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <HeaderStyle>
      <RouterLink style={{ textDecoration: 'none' }} to="/">
        <Logo />
      </RouterLink>

      <MHidden width="smDown">
        <Typography variant="body1" sx={{ mt: { md: -2 } }}>
          {children}
        </Typography>
      </MHidden>
    </HeaderStyle>
  )
}
