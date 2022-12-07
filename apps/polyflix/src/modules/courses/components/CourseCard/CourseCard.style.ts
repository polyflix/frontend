import { Paper, styled } from '@mui/material'

import { ease } from '@core/utils/transition'

export const CourseCardRootStyle = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  position: 'relative',
  height: '100%',
  width: '100%',
  cursor: 'pointer',
  transition: ease(theme, 'border'),

  '& .backdrop': {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
    top: 7,
    left: 7,
    transition: 'all .2s ease-out',
  },

  '&:hover': {
    '.backdrop.first': {
      top: 0,
      left: 4,
      transform: 'rotate(-4deg)',
    },
    '.backdrop.last': {
      top: 2,
      transform: 'rotate(5deg)',
    },
  },
}))
