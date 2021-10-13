import { Box, ListItemButton, ListItemIcon, Theme } from '@mui/material'
import { alpha, CSSObject, styled } from '@mui/system'

import {
  MINIATURIZED_DRAWER_WIDTH,
  OPEN_DRAWER_WIDTH,
} from '@core/layouts/Dashboard/Dashboard.style'
import { ease } from '@core/utils/transition'

const AVATAR_WIDTH = 40

export const RootStyle = styled<any>('div')(({ theme, open }) => ({
  flexShrink: 0,
  width: open ? OPEN_DRAWER_WIDTH : MINIATURIZED_DRAWER_WIDTH,
  transition: ease(theme, 'width'),
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

const listItemMixin = (theme: Theme, open: boolean): CSSObject => ({
  ...(open && {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2.5),
  }),
})

export const SectionTitle = styled(Box)<any>(({ theme, open }) => ({
  height: 50,
  ...(open && {
    padding: theme.spacing(2, 4),
  }),
}))

export const ItemStyle = styled((props: any) => (
  <ListItemButton disableGutters {...props} />
))(({ theme, open }) => ({
  height: 48,
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  textTransform: 'capitalize',
  transition: ease(theme, 'padding'),
  color: theme.palette.text.secondary,
  ...listItemMixin(theme, open),
  ...theme.typography.body2,
}))

export const ItemIconStyle = styled(ListItemIcon)<any>(() => ({
  width: 52,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 0,
}))

export const ItemListStyle = styled('div')<any>(({ theme, open }) => ({
  borderRadius: theme.shape.borderRadius,
  ...(open && {
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity
    ),
  }),
}))
