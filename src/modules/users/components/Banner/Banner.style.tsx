import { Paper } from '@mui/material'
import { styled } from '@mui/system'

export const BannerHead = styled(Paper)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  paddingTop: theme.spacing(8),
}))
