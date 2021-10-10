import { Avatar, Fab, Link, Drawer, Typography, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import React, { PropsWithChildren } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { Scrollbar } from '@core/components/Scrollbar/Scrollbar.component'
import {
  MINIATURIZED_DRAWER_WIDTH,
  OPEN_DRAWER_WIDTH,
} from '@core/layouts/DashBoard/DashBoard.style'
import { fadeInAnnimation } from '@core/utils/annimation'
import { ease } from '@core/utils/transition'

import { AccountStyle, RootStyle } from './DashBoardSidebar.style'
import { NavSection } from './DashboardSidebarNavSection/DashboardSidebarNavSection.component'
import sidebarConfig from './sidebar.config'

type DashBoardSidebarProps = {
  isOpenSidebar: boolean
  toggleSidebar: () => void
}

export const DashBoardSidebar: React.FC<
  PropsWithChildren<DashBoardSidebarProps>
> = ({ isOpenSidebar, toggleSidebar }) => {
  return (
    <RootStyle
      open={isOpenSidebar}
      onMouseEnter={toggleSidebar}
      onMouseLeave={toggleSidebar}
    >
      <Box>
        <Drawer
          variant="persistent"
          open={true}
          PaperProps={{
            sx: {
              width: isOpenSidebar
                ? OPEN_DRAWER_WIDTH
                : MINIATURIZED_DRAWER_WIDTH,
              bgcolor: 'background.paper',
              boxShadow: (theme) => theme.shadows[24],
              borderRadius: (theme) =>
                `0 ${(theme.shape.borderRadius as number) * 6}px ${
                  (theme.shape.borderRadius as number) * 6
                }px 0`,
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
                mb: 4,
                mx: isOpenSidebar ? 2.5 : 0,
                pt: 3,
                transition: 'margin ease 300ms',
              }}
            >
              <Link underline="none" component={RouterLink} to="#">
                <AccountStyle open={isOpenSidebar}>
                  <Avatar
                    src={
                      'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png'
                    }
                    alt="photoURL"
                  />
                  <Box sx={{ ml: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'text.primary',
                        whiteSpace: 'nowrap',
                        ...fadeInAnnimation(isOpenSidebar),
                      }}
                    >
                      Malo Polese
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        whiteSpace: 'nowrap',
                        ...fadeInAnnimation(isOpenSidebar),
                      }}
                    >
                      Admin
                    </Typography>
                  </Box>
                </AccountStyle>
              </Link>
            </Box>

            <NavSection
              navConfig={sidebarConfig}
              open={isOpenSidebar}
            ></NavSection>

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
              {/* TODO Logout / login */}
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
