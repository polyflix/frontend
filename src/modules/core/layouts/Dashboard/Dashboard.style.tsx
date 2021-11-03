import { styled } from '@mui/material'

const APP_BAR_MOBILE = 64
const APP_BAR_DESKTOP = 92

export const OPEN_DRAWER_WIDTH = 280
export const MINIATURIZED_DRAWER_WIDTH = 85

export const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  overflow: 'hidden',
})

export const MainStyle = styled<any>('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'hidden',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
  },
}))
