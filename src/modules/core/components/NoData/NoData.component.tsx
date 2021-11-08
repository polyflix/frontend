import { Button, Stack, Typography, useMediaQuery } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import { useTranslation } from 'react-i18next'
import Lottie from 'react-lottie'
import { Link as RouterLink } from 'react-router-dom'

import { useRoles } from '@core/hooks/useRoles.hook'
import { Role } from '@core/types/roles.type'

import animationData from '../../../../assets/lotties/empty-box.json'

interface Props {
  variant?: 'videos' | 'quizzes' | 'collections'
  link?: string
}

export const NoData = ({ link, variant }: Props) => {
  const { t } = useTranslation('common')
  const th = useTheme()
  const ltsm: boolean = useMediaQuery(th.breakpoints.down('md'))
  const { hasRoles } = useRoles()
  const requiredRoles = [Role.Teacher, Role.Admin]

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
      sx={{ width: ltsm ? '100vw' : `calc(100vw - 280px)` }}
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
          <Typography align="center" sx={{ color: 'text.secondary' }}>
            {variant
              ? t('noData.description', { ns: variant })
              : t('noData.descriptionDefault')}
          </Typography>
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
      <Box>
        <Lottie options={defaultOptions} height={300} width={300} />
      </Box>
    </Stack>
  )
}
