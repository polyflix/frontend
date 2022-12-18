import { alpha, SxProps, Theme, Typography } from '@mui/material'

type ElementSmallTagProps = {
  text: string
  position?: 'absolute' | 'relative'
  sx?: SxProps<Theme>
}

export const ElementSmallTag = ({ text, sx }: ElementSmallTagProps) => {
  return (
    <Typography
      sx={{
        borderRadius: 0.5,
        px: 0.5,
        backgroundColor: (theme) => alpha(theme.palette.common.black, 0.8),
        color: (theme) => theme.palette.common.white,
        ...sx,
      }}
      variant="caption"
    >
      {text}
    </Typography>
  )
}
