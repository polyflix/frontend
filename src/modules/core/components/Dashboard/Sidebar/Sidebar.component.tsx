import { Box, Button, Drawer, Link, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { Icon } from '@core/components/Icon/Icon.component'
import { Scrollbar } from '@core/components/Scrollbar/Scrollbar.component'
import { useSidebar } from '@core/hooks/useSidebar.hook'
import {
  MINIATURIZED_DRAWER_WIDTH,
  OPEN_DRAWER_WIDTH,
} from '@core/layouts/Dashboard/Dashboard.style'
import { fadeInAnnimation } from '@core/utils/animation'
import { ease } from '@core/utils/transition'

import { AuthService } from '@auth/services/auth.service'

import { Section } from './Section/Section.component'
import { getSidebarSections } from './Sidebar.config'
import { AccountStyle, RootStyle } from './Sidebar.style'
import { UserAvatar } from './UserAvatar/UserAvatar.component'

export const DashboardSidebar = () => {
  const authService = useInjection<AuthService>(AuthService)

  const { open, toggle } = useSidebar()
  const { t } = useTranslation('common')

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
              overflowX: 'hidden',
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
              <Box
                sx={{
                  ...(open && {
                    px: 4,
                  }),
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title="Logout">
                  <Button
                    onClick={() => authService.logout()}
                    variant="outlined"
                    color="primary"
                    aria-label="add"
                    size="small"
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                      minWidth: 40,
                      ...(open && {
                        width: '100%',
                        height: 40,
                      }),
                      ...(!open && {
                        borderRadius: '100%',
                        width: 40,
                        height: 40,
                      }),
                    }}
                  >
                    <Icon name="eva:log-in-fill" />
                    <Box
                      component="p"
                      sx={{
                        transition: (theme) => ease(theme, 'width'),
                        ...(open && {
                          ml: 1,
                        }),
                        ...(!open && {
                          width: 0,
                        }),
                        whiteSpace: 'nowrap',
                        ...fadeInAnnimation(open),
                      }}
                    >
                      {t('sidebar.actions.logout')}
                    </Box>
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </Scrollbar>
        </Drawer>
      </Box>
    </RootStyle>
  )
}
