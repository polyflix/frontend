import { Grid, Typography } from '@mui/material'
import { isEmpty } from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NoData } from '@core/components/NoData/NoData.component'
import { Page } from '@core/components/Page/Page.component'
import { Slider } from '@core/components/Slider/Slider.component'
import { Visibility } from '@core/models/content.model'

import { VideoSliderCard } from '@videos/components/VideoSliderCard/VideoSliderCard.component'
import { useGetVideosQuery } from '@videos/services/video.service'
import { VideoFilters } from '@videos/types/filters.type'
import { useGetUserAttachmentsQuery } from "@attachments/services/attachment.service";

export const HomePage = () => {
  const [filters] = useState<VideoFilters>({
    page: 1,
    pageSize: 10,
  })

  const lastVideosQuery = useGetVideosQuery({
    visibility: Visibility.PUBLIC,
    draft: false,
    order: '-createdAt',
    ...filters,
  })

  const popularVideosQuery = useGetVideosQuery({
    visibility: Visibility.PUBLIC,
    draft: false,
    order: '-views',
    ...filters,
  })

  const mostLikedVideosQuery = useGetVideosQuery({
    visibility: Visibility.PUBLIC,
    draft: false,
    order: '-likes',
    ...filters,
  })

  const watchingVideosQuery = useGetVideosQuery({
    visibility: Visibility.PUBLIC,
    draft: false,
    ...filters,
    isWatching: true,
  })

  const watchedVideosQuery = useGetVideosQuery({
    visibility: Visibility.PUBLIC,
    draft: false,
    ...filters,
    isWatched: true,
  })

  const lastVideos = lastVideosQuery.data?.items || []
  const popularVideos = popularVideosQuery.data?.items || []
  const mostLikedVideos = mostLikedVideosQuery.data?.items || []

  const watchingVideos = watchingVideosQuery.data?.items || []
  const watchedVideos = watchedVideosQuery.data?.items || []

  const { t } = useTranslation('home')

  if (
    isEmpty(lastVideos) &&
    isEmpty(popularVideos) &&
    isEmpty(mostLikedVideos) &&
    isEmpty(watchingVideos) &&
    isEmpty(watchedVideos)
  ) {
    return <NoData variant="videos" link="/videos/create" />
  }

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
              <VideoSliderCard key={video.slug} video={video} />
            ))}
          </Slider>
        </Grid>
        {/** END CURRENTLY WATCHING VIDEOS SLIDER **/}

        {/** LATEST VIDEOS SLIDER **/}
        <Grid
          item
          xs={12}
          hidden={!lastVideosQuery.isLoading && lastVideos.length === 0}
        >
          <Slider
            isLoading={lastVideosQuery.isLoading}
            heading={
              <Typography variant="h4">{t('sliders.titles.latest')}</Typography>
            }
            freeMode
          >
            {lastVideos.map((video) => (
              <VideoSliderCard key={video.slug} video={video} />
            ))}
          </Slider>
        </Grid>
        {/** END LATEST VIDEOS SLIDER **/}

        {/** POPULAR VIDEOS SLIDER **/}
        <Grid
          item
          xs={12}
          hidden={!popularVideosQuery.isLoading && popularVideos.length === 0}
        >
          <Slider
            isLoading={popularVideosQuery.isLoading}
            heading={
              <Typography variant="h4">
                {t('sliders.titles.popular')}
              </Typography>
            }
            freeMode
          >
            {/** We slice the array as it is a frozen object to create a clone of it **/}
            {popularVideos.map((video) => (
              <VideoSliderCard key={video.slug} video={video} />
            ))}
          </Slider>
        </Grid>
        {/** END POPULAR VIDEOS SLIDER **/}

        {/** MOST LIKED VIDEOS SLIDER **/}
        <Grid
          item
          xs={12}
          hidden={
            !mostLikedVideosQuery.isLoading && mostLikedVideos.length === 0
          }
        >
          <Slider
            isLoading={mostLikedVideosQuery.isLoading}
            heading={
              <Typography variant="h4">{t('sliders.titles.rated')}</Typography>
            }
            freeMode
          >
            {/** We slice the array as it is a frozen object to create a clone of it **/}
            {mostLikedVideos.map((video) => (
              <VideoSliderCard key={video.slug} video={video} />
            ))}
          </Slider>
        </Grid>
        {/** END MOST LIKED VIDEOS SLIDER **/}

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
              <VideoSliderCard key={video.slug} video={video} />
            ))}
          </Slider>
        </Grid>
        {/** END WATCHED VIDEOS SLIDER **/}
      </Grid>
    </Page>
  )
}
