import { Box, Divider, Link, Stack } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { buildSkeletons } from '@core/utils/gui.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { VideoCardSkeleton } from '@videos/components/Skeleton/VideoCardSkeleton/VideoCardSkeleton.component'
import { VideoSliderCard } from '@videos/components/VideoSliderCard/VideoSliderCard.component'
import { Video } from '@videos/models/video.model'
import { useGetVideosQuery } from '@videos/services/video.service'
import { VideoFilters } from '@videos/types/filters.type'

export const ProfileVideosPage = () => {
  const { t } = useTranslation('users')
  const { user } = useAuth()
  let params = new URLSearchParams(window.location.search)

  const [filters, setFilters] = useState<VideoFilters>({
    authorId: user?.id,
    page: parseInt(params.get('page') || '1'),
    pageSize: 10,
  })

  const { data, isLoading, isFetching } = useGetVideosQuery({
    ...filters,
    order: '-createdAt',
  })

  const videos: Video[] = data?.items || []
  const skeletons = buildSkeletons(3)

  let totalPage = Math.ceil((data?.totalCount ?? 1) / (filters.pageSize ?? 1))

  return (
    <Page
      disableGutters={true}
      sx={{ mt: 3 }}
      title={t('profile.tabs.videos.content.title')}
    >
      <Stack justifyContent="space-between" direction="row">
        <Header
          title={t('profile.tabs.videos.content.title')}
          description={t('profile.tabs.videos.content.description')}
        />
        <Link
          underline="none"
          component={RouterLink}
          color="inherit"
          to="/videos/history"
        >
          {t('profile.actions.history')}
        </Link>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* If there is more than 10 items, we display a limit item per page selector */}
      {(data?.totalCount ?? 1) * (filters.pageSize ?? 1) > 10 && (
        <Stack justifyContent="space-between" direction="row">
          <ItemsPerPage
            onChange={(pageSize) =>
              setFilters({ ...filters, pageSize, page: 1 })
            }
          />
        </Stack>
      )}

      <Grid sx={{ my: 3 }} container spacing={2}>
        {!isFetching
          ? videos.map((video: Video) => (
              <Grid key={video.slug} item xs={12} sm={6} md={4} lg={3}>
                <VideoSliderCard
                  key={video.slug}
                  video={video}
                  isFetching={isFetching}
                />
              </Grid>
            ))
          : skeletons.map((_, i: number) => (
              <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
                <VideoCardSkeleton key={i} />
              </Grid>
            ))}
      </Grid>

      {videos.length > 0 && !isLoading ? (
        <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
          <PaginationSynced
            filters={filters}
            setFilters={setFilters}
            pageCount={totalPage}
          />
        </Box>
      ) : (
        !isLoading && <NoData variant="videos" link="/videos/create" />
      )}
    </Page>
  )
}
