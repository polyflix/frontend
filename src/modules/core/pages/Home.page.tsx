import { Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Page } from '@core/components/Page/Page.component'
import { Slider } from '@core/components/Slider/Slider.component'

import { VideoSliderCard } from '@videos/components/VideoSliderCard/VideoSliderCard.component'
import { videosSelectors } from '@videos/reducers/video.slice'

export const HomePage = () => {
  const videos = useSelector(videosSelectors.selectIds)
  const { t } = useTranslation('home')
  return (
    <Page title="Home" container={false}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Slider
            heading={
              <Typography variant="h4">
                {t('sliders.titles.continueWatching')}
              </Typography>
            }
            freeMode
          >
            {videos.map((video) => (
              <VideoSliderCard
                key={video.toString()}
                videoId={video.toString()}
              />
            ))}
          </Slider>
        </Grid>
        <Grid item xs={12}>
          <Slider
            heading={
              <Typography variant="h4">{t('sliders.titles.latest')}</Typography>
            }
            freeMode
          >
            {videos.map((video) => (
              <VideoSliderCard
                key={video.toString()}
                videoId={video.toString()}
              />
            ))}
          </Slider>
        </Grid>
        <Grid item xs={12}>
          <Slider
            heading={
              <Typography variant="h4">
                {t('sliders.titles.popular')}
              </Typography>
            }
            freeMode
          >
            {videos.map((video) => (
              <VideoSliderCard
                key={video.toString()}
                videoId={video.toString()}
              />
            ))}
          </Slider>
        </Grid>
        <Grid item xs={12}>
          <Slider
            heading={
              <Typography variant="h4">
                {t('sliders.titles.watchAgain')}
              </Typography>
            }
            freeMode
          >
            {videos.map((video) => (
              <VideoSliderCard
                key={video.toString()}
                videoId={video.toString()}
              />
            ))}
          </Slider>
        </Grid>
      </Grid>
    </Page>
  )
}
