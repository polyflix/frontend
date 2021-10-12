import { ListItemText, Theme } from '@mui/material'
import { alpha, CSSObject } from '@mui/system'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { useActiveRoot } from '@core/hooks/useActiveRoot.hook'
import { useSidebar } from '@core/hooks/useSidebar.hook'
import { fadeInAnnimation } from '@core/utils/animation'

import { SidebarItem } from '../Sidebar.config'
import { ItemIconStyle, ItemStyle } from '../Sidebar.style'

interface Props {
  item: SidebarItem
  isSubItem?: boolean
}

/**
 * This component is used by the sidebar to display links.
 * @returns
 */
export const Item = ({ item, isSubItem = false }: Props) => {
  const { open } = useSidebar()

  const isActiveRoot = useActiveRoot(item.href)

  const activeRootStyle: CSSObject = {
    color: 'primary.main',
    fontWeight: 'bolder',
    ...(!isSubItem && {
      bgcolor: (theme: Theme) =>
        alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    }),
  }

  return (
    <ItemStyle
      open={open}
      component={RouterLink}
      to={item.href}
      sx={{
        ...(isActiveRoot && activeRootStyle),
      }}
    >
      <ItemIconStyle
        sx={{
          ...(isActiveRoot && { color: 'primary.main' }),
        }}
      >
        {isSubItem ? (
          <Icon name={item.icon} size={15} />
        ) : (
          <Icon name={item.icon} />
        )}
      </ItemIconStyle>
      <ListItemText
        primary={item.title}
        sx={{
          ...fadeInAnnimation(open),
        }}
      />
    </ItemStyle>
  )
}