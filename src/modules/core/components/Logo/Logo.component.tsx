import { Box, Stack, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { APP_NAME } from '@core/constants/app.constant'

interface Props {
  minimal?: boolean
}

export const Logo = ({ minimal = false }: Props) => {
  const history = useHistory()
  const location = useLocation()
  // We store the initial page to show the back arrow if only navigated in another page
  // at least once
  const [initialPage] = useState(location.pathname)

  const { t } = useTranslation('home')
  const onClickLogo = () => history.push('/')

  return (
    <Stack direction="row" alignItems="baseline">
      {location.pathname !== initialPage && (
        <Tooltip title={`${t('goBack')}`} onClick={() => history.goBack()}>
          <Typography
            color={'grey.700'}
            sx={{
              px: 2,
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' },
              transitionDuration: '500ms',
            }}
          >
            <Icon name={'akar-icons:chevron-left'} />
          </Typography>
        </Tooltip>
      )}
      <Typography
        title={t('page.title')}
        onClick={onClickLogo}
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
