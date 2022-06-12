import { IconButton, Stack, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useInjection } from '@polyflix/di'

import { Icon } from '@core/components/Icon/Icon.component'

import { AuthService } from '@auth/services/auth.service'

export const Logout = () => {
  const { t } = useTranslation()
  const authService = useInjection<AuthService>(AuthService)

  return (
    <>
      <Tooltip title={t<string>('navbar.actions.logout')}>
        <IconButton onClick={() => authService.logout()}>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Icon name="ant-design:logout-outlined" />
          </Stack>
        </IconButton>
      </Tooltip>
    </>
  )
}
