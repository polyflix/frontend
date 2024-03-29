import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { APP_NAME } from '@constants/app.constant'

interface Props {
  minimal?: boolean
}

export const Logo = ({ minimal = false }: Props) => {
  const history = useHistory()
  const { t } = useTranslation('home')

  return (
    <Stack direction="row" alignItems="center">
      <Typography
        title={t('page.title')}
        onClick={() => history.push('/')}
        sx={{ color: 'text.primary', cursor: 'pointer' }}
        variant="h3"
      >
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
