import { Lock } from '@mui/icons-material'
import { Theme, Tooltip, SxProps, alpha } from '@mui/material'

type ElementLockIconProps = {
  sx?: SxProps<Theme>
}

export const ElementLockIcon = ({ sx }: ElementLockIconProps) => {
  return (
    <Tooltip title="Private">
      <Lock
        sx={{
          width: '20px',
          height: '20px',
          boxSizing: 'border-box',
          borderRadius: 0.5,
          p: 0.5,
          backgroundColor: (theme) => alpha(theme.palette.common.black, 0.8),
          color: (theme) => theme.palette.common.white,
          ...sx,
        }}
      />
    </Tooltip>
  )
}
