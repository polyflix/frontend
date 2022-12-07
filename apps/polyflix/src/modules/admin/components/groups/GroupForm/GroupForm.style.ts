import { MenuItem, OutlinedInput, styled } from '@mui/material'

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  margin: theme.spacing(1, 0),
}))

export const StyledOutlinedInput = styled(OutlinedInput)(() => ({
  'div.MuiBox-root': {
    overflow: 'hidden',
    display: 'block',
    textOverflow: 'ellipsis',
  },
}))
