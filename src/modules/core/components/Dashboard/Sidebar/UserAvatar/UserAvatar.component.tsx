import { Avatar, Box, Stack, Typography } from '@mui/material'

import { DEFAULT_AVATAR_PICTURE } from '@core/constants/defaultValue.constant'
import { useSidebar } from '@core/hooks/useSidebar.hook'
import { fadeInAnnimation } from '@core/utils/animation'

import { useAuth } from '@auth/hooks/useAuth.hook'

export const UserAvatar = ({}) => {
  const { open } = useSidebar()
  const { user } = useAuth()

  return (
    <Stack direction="row" alignItems="center">
      <Avatar
        src={user?.profilePicture || DEFAULT_AVATAR_PICTURE}
        alt={`${user?.displayName} profile picture`}
      />
      <Box sx={{ ml: 2 }}>
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
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            whiteSpace: 'nowrap',
            ...fadeInAnnimation(open),
          }}
        >
          {user?.email}
        </Typography>
      </Box>
    </Stack>
  )
}
