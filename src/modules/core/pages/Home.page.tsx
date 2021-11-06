import { Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Page } from '@core/components/Page/Page.component'
import { Slider } from '@core/components/Slider/Slider.component'
import { Visibility } from '@core/models/content.model'

import { VideoSliderCard } from '@videos/components/VideoSliderCard/VideoSliderCard.component'
import { useGetVideosQuery } from '@videos/services/video.service'
import { VideoFilters } from '@videos/types/filters.type'

import { Video } from '../../videos/models/video.model'

export const HomePage = () => {
  const [filters] = useState<VideoFilters>({
    page: 1,
    pageSize: 10,
  })

  const lastVideosQuery = useGetVideosQuery({
    visibility: Visibility.PUBLIC,
    draft: false,
    ...filters,
  })

  const watchingVideosQuery = useGetVideosQuery({
    ...filters,
    isWatching: true,
  })

  const watchedVideosQuery = useGetVideosQuery({
    ...filters,
    isWatched: true,
  })

  const videos = lastVideosQuery.data?.items || []
  const watchingVideos = watchingVideosQuery.data?.items || []
  const watchedVideos = watchedVideosQuery.data?.items || []

  const { t } = useTranslation('home')

  return (
    <Page title={t('page.title')} maxWidth={false}>
      <Grid container spacing={5}>
        {/** CURRENTLY WATCHING VIDEOS SLIDER **/}
        <Grid
          item
          xs={12}
          hidden={!watchingVideosQuery.isLoading && watchingVideos.length === 0}
        >
          <Slider
            isLoading={watchingVideosQuery.isLoading}
            heading={
              <Typography variant="h4">
                {t('sliders.titles.continueWatching')}
              </Typography>
            }
            freeMode
          >
            {watchingVideos.map((video) => (
              <VideoSliderCard key={video.id} video={video} />
            ))}
          </Slider>
        </Grid>
        {/** END CURRENTLY WATCHING VIDEOS SLIDER **/}

        {/** LATEST VIDEOS SLIDER **/}
        <Grid item xs={12}>
          <Slider
            isLoading={lastVideosQuery.isLoading}
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
        {/** END LATEST VIDEOS SLIDER **/}

        {/** POPULAR VIDEOS SLIDER **/}
        <Grid item xs={12}>
          <Slider
            isLoading={lastVideosQuery.isLoading}
            heading={
              <Typography variant="h4">
                {t('sliders.titles.popular')}
              </Typography>
            }
            freeMode
          >
            {/** We slice the array as it is a frozen object to create a clone of it **/}
            {videos
              .slice()
              .sort((a: Video, b: Video) => b.views - a.views)
              .map((video) => (
                <VideoSliderCard key={video.id} video={video} />
              ))}
          </Slider>
        </Grid>
        {/** END POPULAR VIDEOS SLIDER **/}
        {/** WATCHED VIDEOS SLIDER **/}
        <Grid
          item
          xs={12}
          hidden={!watchedVideosQuery.isLoading && watchedVideos.length === 0}
        >
          <Slider
            isLoading={watchedVideosQuery.isLoading}
            heading={
              <Typography variant="h4">
                {t('sliders.titles.watchAgain')}
              </Typography>
            }
            freeMode
          >
            {watchedVideos.map((video) => (
              <VideoSliderCard key={video.id} video={video} />
            ))}
          </Slider>
        </Grid>
        {/** END WATCHED VIDEOS SLIDER **/}
      </Grid>
    </Page>
  )
}
