import { styled, Box } from '@mui/material'

export const RootStyle = styled(Box)(() => ({
  position: 'relative',
}))

export const WrapperStyle = styled('div')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  '& > *': { height: '100%', width: '100%' },
}))
