import { styled } from '@mui/system'

import {
  OPEN_DRAWER_WIDTH,
  MINIATURIZED_DRAWER_WIDTH,
} from '@core/layouts/DashBoard/DashBoard.style'
import { ease } from '@core/utils/transition'

export const RootStyle = styled<any>('div')(({ theme, open }) => ({
  flexShrink: 0,
  width: open ? OPEN_DRAWER_WIDTH : MINIATURIZED_DRAWER_WIDTH,
  transition: ease(theme, 'width'),
}))

const AVATAR_WIDTH = 40

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
