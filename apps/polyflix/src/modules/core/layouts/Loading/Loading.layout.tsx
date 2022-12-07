import { Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'

import { LoadingRootStyle } from './Loading.style'

interface Props {
  text?: string
  isPage?: boolean
}

export const LoadingLayout = ({ text, isPage = true }: Props) => {
  return (
    <LoadingRootStyle isPage={isPage}>
      <Stack direction="column" justifyContent="center" alignItems="center">
        <CircularProgress sx={{ mb: 5 }} size={70} />
        {text && (
          <Typography fontWeight="bold" variant="body1">
            {text}
          </Typography>
        )}
      </Stack>
    </LoadingRootStyle>
  )
}
