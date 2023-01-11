import { Typography, TypographyProps } from '@mui/material'
import { forwardRef, PropsWithChildren } from 'react'

// eslint-disable-next-line react/display-name
export const NullableTypography = forwardRef<
  typeof Typography,
  TypographyProps
>(({ children, ...props }: PropsWithChildren<any>, ref) => (
  <Typography ref={ref} {...props}>
    {children ?? 'n/a'}
  </Typography>
))
