import { Typography } from '@mui/material'

import { Icon } from '@core/components/Icon/Icon.component'

export const VisibilityIcons = ({ visibility }: { visibility: string }) => {
  return visibility !== 'public' ? (
    <Typography
      variant="h5"
      sx={{
        color: 'text.secondary',
        marginRight: '0.5rem',
        display: 'inline-block',
      }}
    >
      <Icon
        size={16}
        name={
          visibility === 'private'
            ? 'ic:outline-visibility-off'
            : 'ri:lock-password-line'
        }
      />
    </Typography>
  ) : null
}
