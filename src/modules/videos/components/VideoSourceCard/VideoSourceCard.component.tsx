import { Paper, Stack, Typography } from '@mui/material'

import { Icon } from '@core/components/Icon/Icon.component'

import { VideoSource } from '@videos/types/video.type'

interface Props {
  source: VideoSource
  description: string
  icon: string
}

export const VideoSourceCard = ({ source, icon, description }: Props) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        height: '100%',
        p: 3,
      }}
    >
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="center">
          <Icon name={icon} size={80} />
        </Stack>
        <Typography textAlign="center" variant="h4">
          {source}
        </Typography>
        <Typography
          textAlign="center"
          variant="body1"
          sx={{ color: 'text.secondary' }}
        >
          {description}
        </Typography>
      </Stack>
    </Paper>
  )
}
