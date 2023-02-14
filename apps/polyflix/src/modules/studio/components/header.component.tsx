import { Button, Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'

type HeaderProps = {
  title: string
  description: string
  createAvailable?: boolean
}

export const Header = ({
  title,
  description,
  createAvailable = true,
}: HeaderProps) => {
  const { url } = useRouteMatch()
  const { t } = useTranslation('studio')

  return (
    <Stack direction="column">
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        justifyContent="space-between"
      >
        <Typography variant="h3" color="inherit">
          {title}
        </Typography>
        {createAvailable && (
          <Button
            component={RouterLink}
            to={`${url}/create`}
            variant="contained"
          >
            {t('common.header.actions.create')}
          </Button>
        )}
      </Stack>
      <Typography
        variant="body2"
        color="inherit"
        sx={{
          pb: 1,
        }}
      >
        {description}
      </Typography>
      <Divider />
    </Stack>
  )
}
