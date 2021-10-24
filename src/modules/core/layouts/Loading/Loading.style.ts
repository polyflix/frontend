import { styled, Box } from '@mui/material'

export const LoadingRootStyle = styled(Box)<any>(({ isPage }) => ({
  display: 'flex',
  height: isPage ? '100vh' : '100%',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}))
