import { Button, Stack, Tooltip } from '@mui/material'
import { useRef } from 'react'

import { Icon } from '@core/components/Icon/Icon.component'
import { dataUriToBlob } from '@core/helpers/file.helper'

import { VideoStyle } from './FrameSelector.style'

interface Props {
  src: string
  onSelect: (thumbnail: File) => void
}

// Component used to render a video, and select frames inside
export const FrameSelector = ({ src, onSelect }: Props) => {
  const player = useRef<HTMLVideoElement>(null)

  const onScreenshot = () => {
    const canvas = document.createElement('canvas')
    canvas.width = player.current?.videoWidth || 640
    canvas.height = player.current?.videoHeight || 480

    const ctx = canvas.getContext('2d')

    if (player.current && ctx) {
      ctx.drawImage(player.current, 0, 0, canvas.width, canvas.height)
      const blob = dataUriToBlob(canvas.toDataURL('image/jpeg'))

      onSelect(new File([blob], `sc_${Date.now()}.jpeg`, { type: blob.type }))
    }
  }

  return (
    <Stack position="relative">
      <VideoStyle ref={player} src={src} controls />

      <Tooltip title="Screenshot">
        <Button
          onClick={onScreenshot}
          variant="contained"
          sx={{ position: 'absolute', top: 20, right: 20 }}
        >
          <Icon name="bx:bx-screenshot" />
        </Button>
      </Tooltip>
    </Stack>
  )
}
