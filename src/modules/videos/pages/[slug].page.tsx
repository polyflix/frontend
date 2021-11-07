import { Grid, Skeleton } from '@mui/material'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'

import { AspectRatioBox } from '@core/components/AspectRatioBox/AspectRation.component'
import { Page } from '@core/components/Page/Page.component'

import { Player } from '@videos/components/Player/Player.component'
import { PlayerSidebar } from '@videos/components/PlayerSidebar/PlayerSidebar.component'
import { VideoDetails } from '@videos/components/VideoDescription/VideoDescription.component'
import { useGetVideoQuery } from '@videos/services/video.service'

export const SlugPage = () => {
  const { slug } = useParams<{ slug: string }>()

  const { data: video, isLoading } = useGetVideoQuery(slug)

  const playerRef = useRef<HTMLVmPlayerElement>(null)

  return (
    <Page
      title={video?.slug}
      maxWidth={false}
      sx={{
        maxWidth: '2000px',
      }}
    >
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          lg
          sx={{
            order: 1,
          }}
        >
          <AspectRatioBox
            ratio={16 / 9}
            sx={{
              maxWidth: '2000px',
              margin: '0 auto',
            }}
          >
            {!isLoading && video ? (
              <Player video={video} playerRef={playerRef} />
            ) : (
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{ borderRadius: 1 }}
              />
            )}
          </AspectRatioBox>
        </Grid>
        <Grid
          item
          xs={12}
          lg="auto"
          sx={{
            order: {
              lg: 2,
              xs: 3,
            },
          }}
        >
          <PlayerSidebar video={video} playerRef={playerRef} />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            order: {
              lg: 3,
              xs: 2,
            },
          }}
        >
          <VideoDetails video={video} />
        </Grid>
      </Grid>
    </Page>
  )
}
