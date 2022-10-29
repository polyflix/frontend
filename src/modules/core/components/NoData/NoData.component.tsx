import { Button, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useTranslation } from 'react-i18next'
import Lottie from 'react-lottie'
import { Link as RouterLink } from 'react-router-dom'

import { useRoles } from '@core/hooks/useRoles.hook'
import { Role } from '@core/types/roles.type'

import animationData from '../../../../assets/lotties/empty-box.json'

interface Props {
  variant?:
    | 'videos'
    | 'quizzes'
    | 'collections'
    | 'attachments'
    | 'courses'
    | 'administration'
  link?: string
  creatable?: boolean
}

export const NoData = ({ link, variant, creatable = true }: Props) => {
  const { t } = useTranslation('common')
  const { hasRoles } = useRoles()
  const requiredRoles = [Role.Contributor, Role.Admin]

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  return (
    <Stack
      sx={{ width: '100%' }}
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Typography align="center" variant="h3">
        {t('noData.title')}
      </Typography>
      {hasRoles(requiredRoles) && (
        <>
          {creatable && (
            <Typography align="center" sx={{ color: 'text.secondary' }}>
              {variant
                ? t('noData.description', { ns: variant })
                : t('noData.descriptionDefault')}
            </Typography>
          )}
          {link && (
            <Button
              to={link}
              component={RouterLink}
              variant="outlined"
              size="large"
            >
              {t('noData.buttonText', { ns: variant })}
            </Button>
          )}
        </>
      )}
      <Box sx={{ pb: 2 }}>
        <Lottie options={defaultOptions} height={200} width={200} />
      </Box>
    </Stack>
  )
}
