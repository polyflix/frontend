import { Button, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { Page } from '@core/components/Page/Page.component'

export const NotImplementedPage = () => {
  const { t } = useTranslation('errors')

  return (
    <Page title={t('404.title', { ns: 'errors' })}>
      <Stack direction="column" justifyContent="center" alignItems="center">
        <Typography align="center" sx={{ my: 2 }} variant="h3">
          {t('notImplemented.title')}
        </Typography>
        <Typography align="center" sx={{ color: 'text.secondary' }}>
          {t('notImplemented.content')}
        </Typography>
        <Button
          to="/"
          component={RouterLink}
          size="large"
          variant="outlined"
          sx={{ mt: 3 }}
        >
          {t('notImplemented.cta')}
        </Button>
      </Stack>
    </Page>
  )
}
