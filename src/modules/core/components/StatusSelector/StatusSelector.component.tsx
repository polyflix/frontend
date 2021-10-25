import { Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useTranslation } from 'react-i18next'

import { Icon } from '../Icon/Icon.component'

type Props = {
  onChange: (value: boolean) => void
  value: boolean
}

export const StatusSelector = ({ value, onChange }: Props) => {
  const { t } = useTranslation('resources')

  const status = value ? 'draft' : 'published'

  return (
    <Stack
      sx={{ cursor: 'pointer' }}
      direction="row"
      onClick={() => onChange(!value)}
    >
      <Icon
        size={30}
        name={value ? 'ri:draft-line' : 'si-glyph:document-checked'}
      />
      <Box sx={{ ml: 2 }}>
        <Typography variant="h5">{`${t(
          `status.${status}.label`
        )}.`}</Typography>{' '}
        {`${t(`status.${status}.description`)}`}
        <Typography fontWeight="bold" sx={{ color: 'primary.main' }}>{`${t(
          'status.actions.switch'
        )}.`}</Typography>
      </Box>
    </Stack>
  )
}
