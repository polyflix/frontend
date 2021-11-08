import { Box, Divider, List, Theme, Typography } from '@mui/material'
import { SxProps } from '@mui/system'
import { isUndefined } from 'lodash'

import { useRoles } from '@core/hooks/useRoles.hook'
import { useSidebar } from '@core/hooks/useSidebar.hook'
import { fadeInAnnimation } from '@core/utils/animation'

import { Item } from '../Item/Item.component'
import { ItemList } from '../ItemList/ItemList.component'
import { SidebarItem } from '../Sidebar.config'
import { SectionTitle } from '../Sidebar.style'

interface Props {
  title: string
  items: SidebarItem[]
  sx?: SxProps<Theme>
}

export const Section = ({ sx, title, items, ...other }: Props) => {
  const { open } = useSidebar()
  const { hasRoles } = useRoles()

  return (
    <Box {...other} sx={{ ...sx, padding: '0 1rem 0 1rem' }}>
      <SectionTitle open={open}>
        <Typography
          sx={{ ...fadeInAnnimation(open) }}
          fontWeight="bold"
          letterSpacing={3}
          variant="body2"
        >
          {title.toUpperCase()}
        </Typography>
        {!open && <Divider />}
      </SectionTitle>
      <List disablePadding>
        {items.map((item, index) => {
          const hasItems = !isUndefined(item.items)

          if (hasItems) {
            return <ItemList item={item} key={index} />
          }

          if (!hasRoles(item?.roles || [])) {
            return
          }
          return <Item key={index} item={item} />
        })}
      </List>
    </Box>
  )
}
