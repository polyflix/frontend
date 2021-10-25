import { Paper } from '@mui/material'
import { styled } from '@mui/system'

export const BannerHead = styled(Paper)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 25,
  padding: theme.spacing(8, 0, 0, 0),
}))
