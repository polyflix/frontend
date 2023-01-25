import { Add } from '@mui/icons-material'
import { Box, Button, Divider, Grid, Stack } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { PaginationSynced } from '@core/components/Pagination/PaginationSynced.component'
import { useRoles } from '@core/hooks/useRoles.hook'
import { Visibility } from '@core/models/content.model'
import { Role } from '@core/types/roles.type'
import { buildSkeletons } from '@core/utils/gui.utils'

import { VideoCardSkeleton } from '@videos/components/Skeleton/VideoCardSkeleton/VideoCardSkeleton.component'
import { Video } from '@videos/models/video.model'
import { useGetVideosQuery } from '@videos/services/video.service'
import { VideoFilters } from '@videos/types/filters.type'
import { polyfilxRouter } from '@core/utils/routes'
import { VideoCard } from '@core/components/VideoCard/video-card.component'

export const ExploreVideosPage = () => {
  const { t } = useTranslation('videos')
  let params = new URLSearchParams(window.location.search)

  // Useful states for filtering purposes
  const [filters, setFilters] = useState<VideoFilters>({
    page: parseInt(params.get('page') || '1'),
    pageSize: 10,
  })

  const { data, isLoading, isFetching } = useGetVideosQuery({
    visibility: Visibility.PUBLIC,
    draft: false,
    order: '-createdAt',
    ...filters,
  })

  const { hasRoles } = useRoles()
  const videos: Video[] = data?.items || []
  const skeletons = buildSkeletons(3)

  let totalPage = Math.ceil((data?.totalCount ?? 1) / (filters.pageSize ?? 1))

  return (
    <Page isLoading={isLoading} title={t('explore.title')}>
      <Header
        title={t('explore.title')}
        description={t('explore.description')}
        hideActionButton={!hasRoles([Role.Admin, Role.Contributor])}
        actionButton={
          <Button
            variant="contained"
            startIcon={<Add />}
            component={RouterLink}
            to={polyfilxRouter().studio.videos.create}
          >
            {t('explore.actions.create')}
          </Button>
        }
      />

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
              <Grid key={video.slug} item xs={12} sm={6} md={6} lg={4}>
                <VideoCard key={video.slug} video={video} />
              </Grid>
            ))
          : skeletons.map((_, i: number) => (
              <Grid key={i} item xs={12} sm={6} md={6} lg={4}>
                <VideoCardSkeleton key={i} />
              </Grid>
            ))}
      </Grid>

      {videos.length > 0 && !isLoading ? (
        <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
          <PaginationSynced
            filters={filters}
            setFilters={setFilters}
            pageCount={totalPage < 1 ? 1 : totalPage}
          />
        </Box>
      ) : (
        <NoData variant="videos" link={polyfilxRouter().studio.videos.create} />
      )}
    </Page>
  )
}
