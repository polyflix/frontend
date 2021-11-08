import { Box, Stack, Typography, Tooltip } from '@mui/material'

import { useSidebar } from '@core/hooks/useSidebar.hook'
import { fadeInAnnimation } from '@core/utils/animation'

import { useAuth } from '@auth/hooks/useAuth.hook'

export const UserAvatar = ({}) => {
  const { open } = useSidebar()
  const { user } = useAuth()

  return (
    <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
      <UserAvatar user={user} />
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
