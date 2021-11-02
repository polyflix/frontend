import { Box, styled } from '@mui/material'

import { ease } from '@core/utils/transition'

export const QuestionPaginationItem = styled(Box)<any>(
  ({ theme, isActive }) => ({
    width: 35,
    height: 35,
    padding: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.primary.main}`,
    color: isActive ? 'white' : theme.palette.primary.main,
    background: isActive ? theme.palette.primary.main : 'transparent',
    transition: ease(theme, 'background'),
    '&:hover': {
      cursor: 'pointer',
      background: theme.palette.primary.main,
      color: 'white',
    },
  })
)
