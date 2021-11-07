import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import dumbThumbnail from '@assets/images/dumb_thumbnail.jpg'
import { Image } from '@core/styles/Image.style'

interface Props {
  title?: string
  thumbnail?: string | File
  description?: string
}

// Component used by the video form to render the video preview
export const VideoPreview = ({ title, description, thumbnail }: Props) => {
  const { t } = useTranslation('videos')

  const getThumbnail = () => {
    if (!thumbnail) return dumbThumbnail
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
      <Typography whiteSpace="pre-wrap" variant="body1">
        {description || t('preview.description')}
      </Typography>
    </>
  )
}
