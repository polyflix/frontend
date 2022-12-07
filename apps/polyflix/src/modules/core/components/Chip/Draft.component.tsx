import { Chip, styled } from '@mui/material'

export const DraftTag = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: -10,
  right: 20,
  mt: 1,
  border: 'solid 1px grey',
  fontSize: '9px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
}))
