import { Box, Button, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { Icon } from '@core/components/Icon/Icon.component'
import { Logo } from '@core/components/Logo/Logo.component'
import { HeaderBaseStyle } from '@core/styles/HeaderBase.style'

import { ErrorRootStyle } from './Error.style'

interface Props {
  code: 403 | 404 | 503
  isPage?: boolean
}

// This component builds a common error layout to display on error pages.
export const ErrorLayout = ({ code, isPage = false }: Props) => {
  const { t } = useTranslation('errors')

  const titleKey = `${code}.title`
  const descriptionKey = `${code}.description`
  const ctaKey = `${code}.cta`

  const getCallToAction = () => {
    const commonProps: any = {
      variant: 'outlined',
      size: 'large',
    }
    switch (code) {
      case 503:
        return (
          <Button
            onClick={() => location.reload()}
            startIcon={<Icon name="ion:refresh-outline" />}
            {...commonProps}
          >
            {t(ctaKey)}
          </Button>
        )
      case 404:
        return (
          <Button to="/" component={RouterLink} {...commonProps}>
            {t(ctaKey)}
          </Button>
        )
      default:
        return <></>
    }
  }

  return (
    <ErrorRootStyle isPage={isPage}>
      {isPage && (
        <HeaderBaseStyle>
          <Logo />
        </HeaderBaseStyle>
      )}
      <Stack direction="column" justifyContent="center" alignItems="center">
        <Typography fontWeight="bold" fontSize="100px">
          {code}
        </Typography>
        <Typography sx={{ my: 2 }} variant="h3">
          {t(titleKey)}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {t(descriptionKey)}
        </Typography>
        <Box sx={{ py: 3 }}>{getCallToAction()}</Box>
      </Stack>
    </ErrorRootStyle>
  )
}
