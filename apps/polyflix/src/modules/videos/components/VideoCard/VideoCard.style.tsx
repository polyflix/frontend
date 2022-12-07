import { Stack, styled } from '@mui/material'

export const VideoCardRootStyle = styled(Stack)<any>(() => ({
  width: '100%',
  height: '100%',
  '&:hover': {
    cursor: 'pointer',
  },
}))

export const VideoCardThumbnail = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
}))
