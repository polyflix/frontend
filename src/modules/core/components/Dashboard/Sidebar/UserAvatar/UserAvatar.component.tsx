import { Avatar, Box, Stack, Typography, Tooltip } from '@mui/material'

import { DEFAULT_AVATAR_PICTURE } from '@core/constants/defaultValue.constant'
import { useSidebar } from '@core/hooks/useSidebar.hook'
import { fadeInAnnimation } from '@core/utils/animation'

import { useAuth } from '@auth/hooks/useAuth.hook'

export const UserAvatar = ({}) => {
  const { open } = useSidebar()
  const { user } = useAuth()

  return (
    <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
      <Avatar
        src={user?.avatar || DEFAULT_AVATAR_PICTURE}
        alt={`${user?.displayName} profile picture`}
      />
      <Box
        sx={{
          ml: 2,
          width: (theme) => `calc(100% - 40px - ${theme.spacing(2)})`,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.primary',
            whiteSpace: 'nowrap',
            ...fadeInAnnimation(open),
          }}
        >
          {user?.displayName}
        </Typography>
        <Tooltip title={user?.email}>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              ...fadeInAnnimation(open),
            }}
            noWrap={true}
          >
            {user?.email}
          </Typography>
        </Tooltip>
      </Box>
    </Stack>
  )
}
