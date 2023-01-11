import { alpha, SxProps, Theme, Typography } from '@mui/material'

type ElementSmallTagProps = {
  text: string
  startIcon?: React.ReactNode
  position?: 'absolute' | 'relative'
  sx?: SxProps<Theme>
}

export const ElementSmallTag = ({
  text,
  startIcon,
  sx,
}: ElementSmallTagProps) => {
  return (
    <Typography
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        borderRadius: 0.5,
        px: 0.5,
        backgroundColor: (theme) => alpha(theme.palette.common.black, 0.8),
        color: (theme) => theme.palette.common.white,
        ...sx,
      }}
      variant="caption"
    >
      {startIcon && startIcon}
      {text}
    </Typography>
  )
}
