import { Box, Stack, StackProps, SxProps, Theme } from '@mui/material'
import { PropsWithChildren } from 'react'

type PageSectionProps = {
  sx?: SxProps<Theme>
  innerProps?: StackProps
}

export const PageSection = ({
  children,
  innerProps,
  sx,
}: PropsWithChildren<PageSectionProps>) => {
  return (
    <Box
      component="section"
      sx={{
        ...sx,
      }}
    >
      <Stack
        direction="column"
        sx={{
          width: '100%',
          maxWidth: 'clamp(1100px, 80vw, 1750px)',
          boxSizing: 'border-box',
          px: {
            xs: 2,
            sm: 3,
          },
          margin: '0 auto',
        }}
        {...innerProps}
      >
        {children}
      </Stack>
    </Box>
  )
}
