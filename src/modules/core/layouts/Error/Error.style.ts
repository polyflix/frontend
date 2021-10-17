import { styled } from '@mui/system'

export const ErrorRootStyle = styled('div')<any>(({ theme, isPage }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  height: isPage ? '100vh' : '100%',
  padding: theme.spacing(1),
}))
