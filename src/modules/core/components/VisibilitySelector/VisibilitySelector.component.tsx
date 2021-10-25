import { Grid, Paper, Stack, Typography } from '@mui/material'
import { alpha, Box } from '@mui/system'
import { useTranslation } from 'react-i18next'

import { Visibility } from '@core/models/content.model'
import { ease } from '@core/utils/transition'

import { Icon } from '../Icon/Icon.component'

interface Props {
  value: Visibility
  onChange: (value: Visibility) => void
}

interface IVisibilityItem {
  icon: string
  label: string
  value: Visibility
  description: string
}

export const VisibilitySelector = ({ value, onChange }: Props) => {
  const { t } = useTranslation('resources')

  const items: IVisibilityItem[] = [
    {
      icon: 'si-glyph:global',
      label: t('visibility.public.label'),
      value: Visibility.PUBLIC,
      description: t('visibility.public.description'),
    },
    {
      icon: 'ri:lock-password-line',
      label: t('visibility.protected.label'),
      value: Visibility.PROTECTED,
      description: t('visibility.protected.description'),
    },
    {
      icon: 'ic:outline-visibility-off',
      label: t('visibility.private.label'),
      value: Visibility.PRIVATE,
      description: t('visibility.private.description'),
    },
  ]

  return (
    <Grid container>
      {items.map(({ value: v, label, description, icon }, idx) => {
        const isActive = v === value
        return (
          <Grid key={idx} item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                cursor: 'pointer',
                transition: (theme) => ease(theme, 'background'),
                ...(isActive && {
                  background: (theme) => alpha(theme.palette.primary.main, 0.1),
                }),
              }}
              variant="outlined"
              onClick={() => onChange(v)}
            >
              <Stack direction="row">
                <Box sx={{ flexShrink: 1, mr: 2 }}>
                  <Icon name={icon} size={30} />
                </Box>
                <Stack>
                  <Typography variant="h5">{label}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, color: 'text.secondary' }}
                  >
                    {description}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        )
      })}
    </Grid>
  )
}
