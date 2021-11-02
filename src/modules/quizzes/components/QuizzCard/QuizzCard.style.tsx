import { Chip, styled } from '@mui/material'

export const NewTag = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: -10,
  right: 20,
  mt: 1,
  border: 'none',
  fontSize: '9px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  background: theme.palette.success.main,
  color: 'white',
}))
