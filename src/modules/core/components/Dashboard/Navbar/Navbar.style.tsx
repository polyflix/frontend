import { AppBar, Toolbar } from '@mui/material'
import { alpha, styled } from '@mui/system'

import { ease } from '@core/utils/transition'

import {
  MINIATURIZED_DRAWER_WIDTH,
  OPEN_DRAWER_WIDTH,
} from '../../../layouts/Dashboard/Dashboard.style'

const APPBAR_MOBILE = 64
const APPBAR_DESKTOP = 92

export const RootStyle = styled<any>(AppBar)(({ theme, open }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  transition: ease(theme, 'width'),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${
      open ? OPEN_DRAWER_WIDTH : MINIATURIZED_DRAWER_WIDTH + 1
    }px)`,
  },
}))

export const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(1, 5),
  },
}))
