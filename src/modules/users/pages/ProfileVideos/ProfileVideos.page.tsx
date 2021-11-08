import {
  Box,
  Container,
  Divider,
  Pagination,
  Stack,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ItemsPerPage } from '@core/components/Filters/ItemsPerPage.component'
import { NoData } from '@core/components/NoData/NoData.component'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { VideoSliderCard } from '@videos/components/VideoSliderCard/VideoSliderCard.component'
import { Video } from '@videos/models/video.model'
import { useGetVideosQuery } from '@videos/services/video.service'
import { VideoFilters } from '@videos/types/filters.type'

export const ProfileVideosPage = () => {
  const { t } = useTranslation('users')
  const { user } = useAuth()

  const [filters, setFilters] = useState<VideoFilters>({
    authorId: user?.id,
    page: 1,
    pageSize: 10,
  })

  const { data, isFetching } = useGetVideosQuery({
    ...filters,
    order: '-createdAt',
  })

  let totalPage = Math.ceil((data?.totalCount ?? 1) / (filters.pageSize ?? 1))

  return (
    <Container disableGutters={true} maxWidth={false} sx={{ mt: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t('profile.tabs.videos.content.title')}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Stack justifyContent="space-between" direction="row">
        <ItemsPerPage
          onChange={(pageSize) => setFilters({ ...filters, pageSize })}
        />
      </Stack>
      <Grid sx={{ my: 3 }} container spacing={2}>
        {data?.items && data?.items.length > 0 ? (
          data?.items.map((item: Video) => (
            <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
              <VideoSliderCard
                key={item.id}
                video={item}
                isFetching={isFetching}
              />
            </Grid>
          ))
        ) : (
          <NoData variant="videos" link="/videos/create" />
        )}
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
    </Container>
  )
}
