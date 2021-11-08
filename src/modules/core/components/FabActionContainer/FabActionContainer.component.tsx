import { Box, Container, Stack } from '@mui/material'
import React, { PropsWithChildren } from 'react'

import { OPEN_DRAWER_WIDTH } from '@core/layouts/Dashboard/Dashboard.style'

export const FabActionContainer: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: {
          xs: `100%`,
          md: `calc(100% - ${OPEN_DRAWER_WIDTH}px)`,
        },
        zIndex: 1000,
        padding: {
          xs: 1,
          sm: 2,
        },
      }}
    >
      <Container>
        <Stack justifyContent="end" alignItems="end" spacing={1}>
          {children}
        </Stack>
      </Container>
    </Box>
  )
}
