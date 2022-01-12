import { Paper, styled, Box, alpha } from '@mui/material'

import { ease } from '@core/utils/transition'

export const RootStyle = styled<any>(Paper)(({ theme, draft }) => ({
  position: 'relative',
  height: '200px',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',

  '&:hover': {
    borderColor: theme.palette.primary.main,
    ...(draft && {
      borderColor: alpha(theme.palette.primary.main, 0.5),
    }),
    '.card-footer': {
      backgroundColor: alpha(theme.palette.primary.light, 0.2),
    },
  },

  '&::after': {
    zIndex: -1,
    content: '""',
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.background.default,
    top: theme.spacing(1),
    left: theme.spacing(1),
    height: '100%',
    width: '100%',
    borderRadius: theme.spacing(1),
    transition: ease(theme, ['transform', 'backgroundColor']),
  },
  '&:hover::after': {
    backgroundColor: theme.palette.primary.light,
    ...(draft && {
      backgroundColor: alpha(theme.palette.primary.light, 0.5),
    }),
    [theme.breakpoints.up('xs')]: {
      transform: 'rotate(1.5deg)',
    },
    border: 'none',
  },
}))

export const CardFooterStyle = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(0, 0, 1, 1),
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.bg,
}))
