import { ListItemButton, ListItemIcon } from '@mui/material'
import { alpha, CSSObject, styled, Theme } from '@mui/system'

import { ease } from '@core/utils/transition'

const listItemMixin = (theme: Theme, open: boolean): CSSObject => ({
  ...(open && {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2.5),
  }),
})

export const ListItemStyle = styled((props: any) => (
  <ListItemButton disableGutters {...props} />
))(({ theme, open }) => ({
  ...theme.typography.body2,
  height: 48,
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  textTransform: 'capitalize',
  transition: ease(theme, 'padding'),
  color: theme.palette.text.secondary,
  ...listItemMixin(theme, open),
}))

export const ListItemIconStyle = styled(ListItemIcon)<any>(() => ({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const NavListItemStyle = styled('div')<any>(({ theme, open }) => ({
  borderRadius: theme.shape.borderRadius,
  ...(open && {
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity
    ),
  }),
}))
