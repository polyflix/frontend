import { Grid } from '@mui/material'
import { isUndefined } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { Header } from '@core/components/Header/Header.component'
import { Page } from '@core/components/Page/Page.component'
import { useFetch } from '@core/hooks/useFetch.hook'
import { useSearchQuery } from '@core/hooks/useSearchQuery.hook'

import { VideoForm } from '@videos/components/Forms/VideoForm.component'
import { VideoSourceCard } from '@videos/components/VideoSourceCard/VideoSourceCard.component'
import { Video } from '@videos/models/video.model'
import { VideoService } from '@videos/services/video.service'
import { VideoSource } from '@videos/types/video.type'

export const CreateUpdatePage = () => {
  const { slug } = useParams<{ slug: string }>()

  // We want to fetch the video only if the slug is defined, in case of update mode.
  const { data: video, isLoading } = useFetch<Video, VideoService>(
    VideoService,
    'getById',
    [slug],
    {
      if: !isUndefined(slug),
    }
  )

  const isUpdate = !isUndefined(video)

  const { t } = useTranslation('videos')

  const source = useSearchQuery('src')

  const i18nKey = !isUndefined(video)
    ? 'update'
    : source
    ? source.toLowerCase()
    : !video && !source
    ? 'default'
    : 'create'

  return (
    <Page
      isLoading={isLoading}
      title={t(`forms.create-update.title.${i18nKey}`, { video: video?.title })}
    >
      <Header
        title={t(`forms.create-update.title.${i18nKey}`, {
          video: video?.title,
        })}
        description={t(`forms.create-update.description.${i18nKey}`)}
      />

      {!source && !video && (
        <Grid container spacing={5}>
          <Grid item md={4}>
            <Link style={{ textDecoration: 'none' }} to="?src=YouTube">
              <VideoSourceCard
                icon="logos:youtube-icon"
                source="YouTube"
                description={t('providers.youtube')}
              />
            </Link>
          </Grid>
          <Grid item md={4}>
            <Link style={{ textDecoration: 'none' }} to="?src=File">
              <VideoSourceCard
                icon="bi:file-arrow-up"
                source="File"
                description={t('providers.file')}
              />
            </Link>
          </Grid>
        </Grid>
      )}

      {(source || video) && (
        <VideoForm
          i18nKey={i18nKey}
          isUpdate={isUpdate}
          video={video}
          source={source as VideoSource}
        />
      )}
    </Page>
  )
}
