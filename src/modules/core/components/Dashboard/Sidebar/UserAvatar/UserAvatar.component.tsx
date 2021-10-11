import { Avatar, Box, Stack, Typography } from '@mui/material'

import { useSidebar } from '@core/hooks/useSidebar.hook'
import { fadeInAnnimation } from '@core/utils/animation'

import { useAuth } from '@auth/hooks/useAuth.hook'

const DEFAULT_PICTURE =
  'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png'

export const UserAvatar = ({}) => {
  const { open } = useSidebar()
  const { user } = useAuth()

  return (
    <Stack direction="row" alignItems="center">
      <Avatar
        src={user?.profilePicture || DEFAULT_PICTURE}
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
          Admin
        </Typography>
      </Box>
    </Stack>
  )
}
