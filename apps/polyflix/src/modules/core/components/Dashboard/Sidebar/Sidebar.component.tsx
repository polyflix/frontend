import { Box, Drawer, Link, useMediaQuery, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { BugReport } from '@core/components/BugReport/BugReport.component'
import { Scrollbar } from '@core/components/Scrollbar/Scrollbar.component'
import { ThemeButton } from '@core/components/ThemeButton/ThemeButton.component'
import { useSidebar } from '@core/hooks/useSidebar.hook'
import { OPEN_DRAWER_WIDTH } from '@core/layouts/Dashboard/Dashboard.style'
import { ease } from '@core/utils/transition'

import { UserMinimalCard } from '../../UserMinimalCard/UserMinimalCard.component'
import { Section } from './Section/Section.component'
import { getSidebarSections } from './Sidebar.config'
import { AccountStyle, RootStyle } from './Sidebar.style'

export const DashboardSidebar = () => {
  const th = useTheme()
  const ltsm: boolean = useMediaQuery(th.breakpoints.down('md'))

  const { open, toggle } = useSidebar()

  // Without it, translations are not loaded, so ignore eslint unused
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { t } = useTranslation('sidebar')

  return (
    <RootStyle open={open}>
      <Box>
        <Drawer
          variant={ltsm ? 'temporary' : 'persistent'}
          open={!ltsm || open}
          onClose={() => toggle()}
          PaperProps={{
            sx: {
              bgcolor: 'background.paper',
            },
          }}
        >
          <Scrollbar
            sx={{
              height: '100%',
              overflowX: 'hidden',
              bgcolor: 'background.paper',
              transition: (theme) => ease(theme, 'width'),
              width: OPEN_DRAWER_WIDTH,
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
              <Link
                underline="none"
                component={RouterLink}
                to="/users/profile/videos"
              >
                <AccountStyle open={open}>
                  <UserMinimalCard />
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
              <Box
                sx={{
                  display: {
                    sm: 'none',
                    xs: 'grid',
                  },
                  alignItems: 'center',
                  alignContent: 'center',
                }}
              >
                <ThemeButton />
              </Box>
              <BugReport />
            </Box>
          </Scrollbar>
        </Drawer>
      </Box>
    </RootStyle>
  )
}
