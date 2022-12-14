import { Collapse, List, ListItemText } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Icon } from '@core/components/Icon/Icon.component'
import { useRoles } from '@core/hooks/useRoles.hook'
import { useSidebar } from '@core/hooks/useSidebar.hook'
import { fadeInAnnimation } from '@core/utils/animation'

import { Item } from '../Item/Item.component'
import { SidebarItem } from '../Sidebar.config'
import { ItemIconStyle, ItemListStyle, ItemStyle } from '../Sidebar.style'

interface Props {
  item: SidebarItem
}

export const ItemList = ({ item }: Props) => {
  const { t } = useTranslation('sidebar')
  const { open } = useSidebar()
  const { hasRoles } = useRoles()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <ItemListStyle>
      <ItemStyle open={open} onClick={() => setMenuOpen(!menuOpen)}>
        <ItemIconStyle>
          <Icon name={item?.icon || ''} />
        </ItemIconStyle>
        <ListItemText
          primary={t(item.title)}
          sx={{
            ...fadeInAnnimation(open),
          }}
        />
        <Icon
          name={
            menuOpen
              ? 'eva:arrow-ios-downward-fill'
              : 'eva:arrow-ios-forward-fill'
          }
        />
      </ItemStyle>
      <Collapse in={menuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.items!.map((subItem: SidebarItem, i: number) => {
            if (!hasRoles(item?.roles || [])) {
              return
            }
            return <Item key={i} item={subItem} isSubItem={true} />
          })}
        </List>
      </Collapse>
    </ItemListStyle>
  )
}
