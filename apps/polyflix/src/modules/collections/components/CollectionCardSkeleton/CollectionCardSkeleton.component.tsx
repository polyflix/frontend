import { Box, Stack, Skeleton } from '@mui/material'

import { Icon } from '@core/components/Icon/Icon.component'

import { RootStyle, CardFooterStyle } from './CollectionCardSkeleton.style'

export const CollectionCardSkeleton = () => {
  return (
    <RootStyle variant="outlined">
      <Stack spacing={2} direction="row" sx={{ p: 2, maxHeight: '125px' }}>
        <Box sx={{ pt: 1 }}>
          <Icon name="bx:bx-collection" size={30} />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Skeleton variant="title" width="65%" sx={{ mb: 1 }} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
        </Box>
      </Stack>
      <CardFooterStyle className="card-footer">
        <Skeleton variant="text" width="100%" />
      </CardFooterStyle>
    </RootStyle>
  )
}
