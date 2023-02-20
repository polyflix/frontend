import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { MarkdownBox } from '@core/components/MarkdownBox/MarkdownBox.component'
import { Image } from '@app/styles/Image.style'

interface Props {
  title?: string
  thumbnail?: string | File
  description?: string
}

// Component used by the video form to render the video preview
export const VideoPreview = ({ title, description, thumbnail }: Props) => {
  const { t } = useTranslation('videos')

  const getThumbnail = () => {
    if (!thumbnail) return '/images/dumb_thumbnail.jpg'
    if (typeof thumbnail === 'string') return thumbnail

    return URL.createObjectURL(thumbnail)
  }

  return (
    <>
      <Image
        loading="lazy"
        width="100%"
        src={getThumbnail()}
        alt={`${title} thumbnail.`}
      />
      <Typography sx={{ my: 2 }} variant="h5">
        {title || t('preview.title')}
      </Typography>
      {description ? (
        <MarkdownBox body={description} />
      ) : (
        <Typography whiteSpace="pre-wrap" variant="body1">
          {t('preview.description')}
        </Typography>
      )}
    </>
  )
}
