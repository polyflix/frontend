import { Box, Collapse, List, ListItemText, Theme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { CSSObject, SxProps } from '@mui/system'
import { useState } from 'react'
import React, { PropsWithChildren } from 'react'
import { NavLink as RouterLink } from 'react-router-dom'

import {
  SideBarItemList,
  SideBarItems,
  SideBarItem,
} from '@core/components/DashBoard/DashBoardSidebar/sidebar.config'
import { Icon } from '@core/components/Icon/Icon.component'
import { useActiveRoot } from '@core/hooks/useActiveRoot.hook'
import { fadeInAnnimation } from '@core/utils/annimation'

import {
  ListItemIconStyle,
  ListItemStyle,
  NavListItemStyle,
} from './DashboardSidebarNavSection.style'

type NavItemProps = {
  item: SideBarItem
  open: boolean
  isSubItem?: boolean
}

const NavItem: React.FC<PropsWithChildren<NavItemProps>> = ({
  item,
  open,
  isSubItem = false,
}) => {
  const isActiveRoot = useActiveRoot(item.href)
  const { title, href, icon } = item

  const activeRootStyle: CSSObject = {
    color: 'primary.main',
    fontWeight: 'bolder',
    ...(!isSubItem && {
      bgcolor: (theme: Theme) =>
        alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    }),
  }

  return (
    <ListItemStyle
      open={open}
      component={RouterLink}
      to={href}
      sx={{
        ...(isActiveRoot && activeRootStyle),
      }}
    >
      <ListItemIconStyle
        sx={{
          ...(isActiveRoot && { color: 'primary.main' }),
        }}
      >
        {isSubItem ? <Icon name={icon} size={15} /> : <Icon name={icon} />}
      </ListItemIconStyle>
      <ListItemText
        disableTypography
        primary={title}
        sx={{
          ...fadeInAnnimation(open),
        }}
      />
    </ListItemStyle>
  )
}

type NavListItemProps = {
  listItem: SideBarItemList
  open: boolean
}

const NavListItem: React.FC<NavListItemProps> = ({ listItem, open }) => {
  const { title, items, icon } = listItem
  const [menuOpen, setMenuOpen] = useState(true)

  return (
    <NavListItemStyle open={menuOpen}>
      <ListItemStyle open={open} onClick={() => setMenuOpen(!menuOpen)}>
        <ListItemIconStyle>
          <Icon name={icon} />
        </ListItemIconStyle>
        <ListItemText
          disableTypography
          primary={title}
          sx={{
            ...fadeInAnnimation(open),
          }}
        />
        <Icon
          name={
            menuOpen
              ? 'eva:arrow-ios-upward-fill'
              : 'eva:arrow-ios-downward-fill'
          }
        />
      </ListItemStyle>
      <Collapse in={menuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((item, i: number) => (
            <NavItem
              key={i}
              item={item as SideBarItem}
              open={open}
              isSubItem={true}
            />
          ))}
        </List>
      </Collapse>
    </NavListItemStyle>
  )
}

type NavSectionProps = {
  navConfig: SideBarItems
  sx?: SxProps<Theme>
  open: boolean
}

export const NavSection: React.FC<NavSectionProps> = ({
  navConfig,
  sx,
  open,
  ...other
}) => {
  const isItem = (item: SideBarItem | SideBarItemList): boolean => {
    return !item.hasOwnProperty('items')
  }

  return (
    <Box {...other} sx={{ ...sx }}>
      <List
        disablePadding
        sx={{
          padding: '1rem',
        }}
      >
        {navConfig.map((item: SideBarItem | SideBarItemList, i: number) =>
          isItem(item) ? (
            <NavItem key={i} item={item as SideBarItem} open={open} />
          ) : (
            <NavListItem
              key={i}
              listItem={item as SideBarItemList}
              open={open}
            />
          )
        )}
      </List>
    </Box>
  )
}
