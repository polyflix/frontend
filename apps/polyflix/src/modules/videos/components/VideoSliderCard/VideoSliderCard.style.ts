import { Stack, styled, Box } from '@mui/material'

export const VideoCardRootStyle = styled(Stack)<any>(() => ({
  width: '100%',
  height: '100%',
  '&:hover': {
    cursor: 'pointer',
  },
}))

export const VideoCardThumbnailContainer = styled<any>(Box)(
  ({ theme, watchedPercent }) => ({
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: '5px',
      width: `${(watchedPercent ?? 0) * 100}%`,
      background: theme.palette.primary.main,
      borderRadius: 'inherit',
    },
  })
)

export const VideoCardThumbnail = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 'inherit',
}))
