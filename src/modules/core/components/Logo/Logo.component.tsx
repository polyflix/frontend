import { Box, Stack, Typography } from '@mui/material'

import { APP_NAME } from '@core/constants/app.constant'

interface Props {
  minimal?: boolean
}

export const Logo = ({ minimal = false }: Props) => {
  return (
    <Stack direction="row" alignItems="baseline">
      <Typography sx={{ color: 'text.primary' }} variant="h3">
        {minimal ? APP_NAME[0] : APP_NAME}
      </Typography>
      <Box
        sx={{
          ml: 1,
          width: 10,
          height: 10,
          borderRadius: '100%',
          backgroundColor: 'primary.main',
        }}
      />
    </Stack>
  )
}
