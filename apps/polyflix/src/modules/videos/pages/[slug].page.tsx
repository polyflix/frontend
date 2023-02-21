import { Grid, Skeleton } from '@mui/material'
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

import { AspectRatioBox } from '@core/components/AspectRatioBox/AspectRation.component'
import { Page } from '@core/components/Page/Page.component'

import { Player } from '@videos/components/Player/Player.component'
import { PlayerSidebar } from '@videos/components/PlayerSidebar/PlayerSidebar.component'
import { VideoDetails } from '@videos/components/VideoDescription/VideoDescription.component'
import { useGetVideoQuery } from '@shared/services/resources/videos/video.service'

export const SlugPage = () => {
  const { slug } = useParams<{ slug: string }>()

  const {
    data: video,
    isLoading,
    refetch,
    isFetching,
    error,
  } = useGetVideoQuery(slug)

  const playerRef = useRef<HTMLVmPlayerElement>(null)

  useEffect(() => refetch(), [slug])

  return (
    <Page
      error={error}
      title={video?.title}
      maxWidth={false}
      sx={{
        maxWidth: 'clamp(1100px, 80vw, 1750px)',
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
              maxWidth: 'clamp(1100px, 80vw, 1750px)',
              margin: '0 auto',
            }}
          >
            {!isLoading && !isFetching && !!video ? (
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
          {
            //wait video load complete before display details
            video && <VideoDetails video={video} />
          }
        </Grid>
      </Grid>
    </Page>
  )
}
