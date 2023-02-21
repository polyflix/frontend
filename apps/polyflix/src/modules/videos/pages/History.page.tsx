import { Grid, Stack } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'
import { Visibility } from '@types_/resources/content.type'
import { buildSkeletons } from '@core/utils/gui.utils'

import { ViewingState } from '@videos/components/Filters/ViewingState.component'
import { VideoCardSkeleton } from '@videos/components/Skeleton/VideoCardSkeleton/VideoCardSkeleton.component'
import { VideoSliderCard } from '@videos/components/VideoSliderCard/VideoSliderCard.component'
import { Video } from '@videos/models/video.model'
import { useGetVideosQuery } from '@shared/services/resources/videos/video.service'
import { VideoFilters } from '@videos/types/filters.type'

// This component displays the user video history.
export const VideoHistoryPage = () => {
  const { t } = useTranslation('videos')

  const [filters, setFilters] = useState<Partial<VideoFilters>>({
    isWatched: true,
    isWatching: true,
  })

  const { data, isLoading, isFetching } = useGetVideosQuery({
    visibility: Visibility.PUBLIC,
    draft: false,
    ...filters,
  })

  const changeVisibilityHandler = (visibility: string) => {
    let newFilters = { ...filters }
    switch (visibility) {
      case 'all':
        setFilters({ ...filters, isWatched: true, isWatching: true })
        break
      case 'watched':
        delete newFilters.isWatching
        setFilters({ ...newFilters, isWatched: true })
        break
      default:
        delete newFilters.isWatched
        setFilters({ ...newFilters, isWatching: true })
        break
    }
  }

  const videos: Video[] = data?.items || []

  const skeletons = buildSkeletons(3)

  return (
    <Page isLoading={isLoading} title={t('history.title')}>
      <Header
        title={t('history.title')}
        description={t('history.description')}
      />

      <Stack justifyContent="end" direction="row">
        <ViewingState onChange={changeVisibilityHandler} />
      </Stack>

      <Grid sx={{ my: 3 }} container spacing={2}>
        {!isFetching
          ? videos.map((video: Video) => (
              <Grid key={video.slug} item xs={12} sm={6} md={6} lg={4}>
                <VideoSliderCard
                  key={video.slug}
                  video={video}
                  isFetching={isFetching}
                />
              </Grid>
            ))
          : skeletons.map((_, i: number) => (
              <Grid key={i} item xs={12} sm={6} md={6} lg={4}>
                <VideoCardSkeleton key={i} />
              </Grid>
            ))}
      </Grid>
    </Page>
  )
}
