import { TabPanel } from '@mui/lab'
import { TabPanelProps } from '@mui/lab/TabPanel/TabPanel'
import { styled, Box } from '@mui/material'

import { ease } from '@core/utils/transition'

export const TabPanelStyle = styled(TabPanel)<TabPanelProps>(() => ({
  height: 'calc(100% - 49px)',
  padding: 0,
}))

export const RootStyle = styled(Box)<any>(({ theme, open }) => ({
  height: '100%',
  transition: ease(theme, 'width'),
  [theme.breakpoints.down('lg')]: {
    height: '500px',
    width: '100%',
  },
  ...(open && {
    width: '400px',
    [theme.breakpoints.up('xl')]: {
      width: '500px',
    },
    opacity: 1,
  }),
  ...(!open && {
    overflow: 'hidden',
    width: '30px',
    opacity: 0,
  }),
}))
