import { Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NoData } from '@core/components/NoData/NoData.component'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { VideoSliderCard } from '@videos/components/VideoSliderCard/VideoSliderCard.component'
import { Video } from '@videos/models/video.model'
import { useGetVideosQuery } from '@videos/services/video.service'
import { VideoFilters } from '@videos/types/filters.type'

export const ProfileVideosPage = () => {
  const { t } = useTranslation('users')
  const { user } = useAuth()

  const [filters] = useState<VideoFilters>({
    authorId: user?.id,
    page: 1,
    pageSize: 10,
  })

  const { data } = useGetVideosQuery({
    ...filters,
  })

  return (
    <Container disableGutters={true} maxWidth={false} sx={{ mt: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t('profile.tabs.videos.content.title')}
      </Typography>
      <Grid container spacing={2}>
        {data?.items && data?.items.length > 0 ? (
          data?.items.map((item: Video) => (
            <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
              <VideoSliderCard key={item.id} video={item} />
            </Grid>
          ))
        ) : (
          <NoData variant="videos" link="/videos/create" />
        )}
      </Grid>
    </Container>
  )
}
