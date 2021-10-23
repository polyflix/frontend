import { Grid, Typography } from '@mui/material'
import { VideoSliderCard } from '@videos/components/VideoSliderCard/VideoSliderCard.component'
import { useTranslation } from 'react-i18next'

import { Page } from '@core/components/Page/Page.component'
import { Slider } from '@core/components/Slider/Slider.component'
import { useResourceState } from '@core/hooks/useResourceState.hook'

export const HomePage = () => {
  const { data: videosIds } = useResourceState('videos')
  const { t } = useTranslation('home')
  return (
    <Page title="Home">
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
            {videosIds.map((videoId: string) => (
              <VideoSliderCard key={videoId} videoId={videoId} />
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
            {videosIds.map((videoId: string) => (
              <VideoSliderCard key={videoId} videoId={videoId} />
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
            {videosIds.map((videoId: string) => (
              <VideoSliderCard key={videoId} videoId={videoId} />
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
            {videosIds.map((videoId: string) => (
              <VideoSliderCard key={videoId} videoId={videoId} />
            ))}
          </Slider>
        </Grid>
      </Grid>
    </Page>
  )
}
