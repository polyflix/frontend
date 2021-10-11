import { Drawer, Fab, Link, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { Scrollbar } from '@core/components/Scrollbar/Scrollbar.component'
import { useSidebar } from '@core/hooks/useSidebar.hook'
import {
  MINIATURIZED_DRAWER_WIDTH,
  OPEN_DRAWER_WIDTH,
} from '@core/layouts/Dashboardx/Dashboard.style'
import { ease } from '@core/utils/transition'

import { Section } from './Section/Section.component'
import { getSidebarSections } from './Sidebar.config'
import { AccountStyle, RootStyle } from './Sidebar.style'
import { UserAvatar } from './UserAvatar/UserAvatar.component'

export const DashboardSidebar = () => {
  const { open, toggle } = useSidebar()

  return (
    <RootStyle open={open} onMouseEnter={toggle} onMouseLeave={toggle}>
      <Box>
        <Drawer
          variant="persistent"
          open={true}
          PaperProps={{
            sx: {
              width: open ? OPEN_DRAWER_WIDTH : MINIATURIZED_DRAWER_WIDTH,
              bgcolor: 'background.paper',
              boxShadow: (theme) => theme.shadows[24],
              transition: (theme) => ease(theme, 'width'),
            },
          }}
        >
          <Scrollbar
            sx={{
              height: '100%',
              '& .simplebar-content': {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              },
            }}
          >
            <Box
              sx={{
                mx: open ? 2.5 : 0,
                pt: 1,
                transition: 'margin ease 300ms',
              }}
            >
              <Link underline="none" component={RouterLink} to="#">
                <AccountStyle open={open}>
                  <UserAvatar />
                </AccountStyle>
              </Link>
            </Box>

            {Object.entries(getSidebarSections()).map(([section, items]) => (
              <Section key={section} title={section} items={items} />
            ))}

            <Box sx={{ flexGrow: 1 }} />

            <Box
              sx={{
                pb: 3,
                mt: 5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Tooltip title="Logout">
                <Fab color="primary" aria-label="add" size="small">
                  <Icon name="eva:log-in-fill" />
                </Fab>
              </Tooltip>
            </Box>
          </Scrollbar>
        </Drawer>
      </Box>
    </RootStyle>
  )
}
