import { Skeleton, Stack, Box } from '@mui/material'

import { AspectRatioBox } from '@core/components/AspectRatioBox/AspectRation.component'

export const VideoCardSkeleton = () => {
  return (
    <>
      <AspectRatioBox ratio={16 / 9}>
        <Skeleton
          sx={{
            borderRadius: '8px',
            height: '100%',
            width: '100%',
          }}
          animation="wave"
          variant="rectangular"
        />
      </AspectRatioBox>
      <Stack sx={{ mt: 2 }} direction="row">
        <Skeleton
          sx={{ flexShrink: 0 }}
          animation="wave"
          variant="circular"
          width={40}
          height={40}
        />
        <Box sx={{ pl: 1, width: '100%' }}>
          <Skeleton animation="wave" width="95%" height={25} />
          <Skeleton animation="wave" width="60%" height={15} />
        </Box>
      </Stack>
    </>
  )
}
