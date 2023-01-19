import { Box } from '@mui/material'
import { RouterBreadcrumbs } from 'ui-lib/components'
import { Outlet } from 'react-router-dom'

export const VideoLayout = () => {
  return (
    <main>
      <RouterBreadcrumbs />
      <Box
        sx={{
          py: 2,
        }}
      >
        <Outlet />
      </Box>
    </main>
  )
}
