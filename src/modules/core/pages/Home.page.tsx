import { Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Page } from '@core/components/Page/Page.component'
import { Slider } from '@core/components/Slider/Slider.component'
import { Visibility } from '@core/models/content.model'

import { VideoSliderCard } from '@videos/components/VideoSliderCard/VideoSliderCard.component'
import { useGetVideosQuery } from '@videos/services/video.service'
import { VideoFilters } from '@videos/types/filters.type'

export const HomePage = () => {
  const [filters] = useState<VideoFilters>({
    page: 1,
    pageSize: 10,
  })

  const { data } = useGetVideosQuery({
    visibility: Visibility.PUBLIC,
    draft: false,
    ...filters,
  })

  const videos = data?.items || []

  const { t } = useTranslation('home')

  return (
    <Page title={t('page.title')} maxWidth={false}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Slider
            isLoading={!data?.items.length}
            heading={
              <Typography variant="h4">
                {t('sliders.titles.continueWatching')}
              </Typography>
            }
            freeMode
          >
            {videos.map((video) => (
              <VideoSliderCard key={video.id} video={video} />
            ))}
          </Slider>
        </Grid>
        <Grid item xs={12}>
          <Slider
            isLoading={!data?.items.length}
            heading={
              <Typography variant="h4">{t('sliders.titles.latest')}</Typography>
            }
            freeMode
          >
            {videos.map((video) => (
              <VideoSliderCard key={video.id} video={video} />
            ))}
          </Slider>
        </Grid>
        <Grid item xs={12}>
          <Slider
            isLoading={!data?.items.length}
            heading={
              <Typography variant="h4">
                {t('sliders.titles.popular')}
              </Typography>
            }
            freeMode
          >
            {videos.map((video) => (
              <VideoSliderCard key={video.id} video={video} />
            ))}
          </Slider>
        </Grid>
        <Grid item xs={12}>
          <Slider
            isLoading={!data?.items.length}
            heading={
              <Typography variant="h4">
                {t('sliders.titles.watchAgain')}
              </Typography>
            }
            freeMode
          >
            {videos.map((video) => (
              <VideoSliderCard key={video.id} video={video} />
            ))}
          </Slider>
        </Grid>
      </Grid>
    </Page>
  )
}
