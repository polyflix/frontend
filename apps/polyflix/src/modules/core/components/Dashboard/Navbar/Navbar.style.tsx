import { AppBar, Toolbar, styled } from '@mui/material'

import {
  MINIATURIZED_DRAWER_WIDTH, // OPEN_DRAWER_WIDTH,
} from '@layouts/Dashboard/Dashboard.style'
import { ease } from '@core/utils/transition'

const APPBAR_MOBILE = 64
const APPBAR_DESKTOP = 75
const AVATAR_WIDTH = 40

export const RootStyle = styled<any>(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backgroundColor: 'transparent',
  backgroundImage: 'none',
  boxSizing: 'border-box',
  transition: ease(theme, 'width'),
}))

export const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: APPBAR_MOBILE,
  backgroundColor: 'transparent',
  transition: ease(theme, 'background'),
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  margin: '0 auto',
  width: '100%',
  boxSizing: 'border-box',
  [theme.breakpoints.up('lg')]: {
    height: APPBAR_DESKTOP,
  },
}))

export const AccountStyle = styled('div')<any>(({ theme, open }) => ({
  display: 'flex',
  alignItems: 'start',
  transition: ease(theme, 'padding'),
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadius,
  ...(!open && {
    paddingLeft: MINIATURIZED_DRAWER_WIDTH / 2 - AVATAR_WIDTH / 2,
  }),
}))
