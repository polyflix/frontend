import { Box, Divider, Grid, Pagination, Stack, Tooltip } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'
import { Searchbar } from '@core/components/Searchbar/Searchbar.component'
import { Visibility } from '@core/models/content.model'

import { VideoSliderCard } from '@videos/components/VideoSliderCard/VideoSliderCard.component'
import { Video } from '@videos/models/video.model'
import { useGetVideosQuery } from '@videos/services/video.service'
import { VideoFilters } from '@videos/types/filters.type'

export const ExploreVideosPage = () => {
  const { t } = useTranslation('videos')

  // Useful states for filtering purposes
  const [filters, setFilters] = useState<VideoFilters>({
    page: 1,
    pageSize: 10,
  })

  const { data, isLoading } = useGetVideosQuery({
    visibility: Visibility.PUBLIC,
    draft: false,
    ...filters,
  })

  let totalPage = Math.ceil((data?.totalCount ?? 1) / (filters.pageSize ?? 1))

  return (
    <Page isLoading={isLoading} title={t('explore.title')}>
      <Header
        title={t('explore.title')}
        description={t('explore.description')}
      />

      <Divider sx={{ my: 3 }} />

      <Stack justifyContent="space-between" direction="row">
        <Tooltip
          title={t<string>('soon')}
          open={true}
          PopperProps={{
            disablePortal: true,
          }}
        >
          <Searchbar onChange={() => {}} label={t('soon', { ns: 'common' })} />
        </Tooltip>
        <ItemsPerPage
          onChange={(pageSize) => setFilters({ ...filters, pageSize })}
        />
      </Stack>

      <Grid sx={{ my: 3 }} container spacing={2}>
        {data?.items.map((item: Video) => (
          <Grid key={item.id} item xs={12} sm={6} md={6} lg={4}>
            <VideoSliderCard key={item.id} video={item} />
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="center">
        <Pagination
          onChange={(e, page) => setFilters({ ...filters, page })}
          count={totalPage < 1 ? 1 : totalPage}
          shape="rounded"
          variant="outlined"
          showFirstButton
          showLastButton
        />
      </Box>
    </Page>
  )
}
