import { Box, Stack, Typography, Tooltip } from '@mui/material'

import { useSidebar } from '@core/hooks/useSidebar.hook'
import { Role } from '@core/types/roles.type'
import { fadeInAnnimation } from '@core/utils/animation'
import { capitalize } from '@core/utils/text.utils'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { UserAvatar } from '@users/components/UserAvatar/UserAvatar.component'
import { User } from '@users/models/user.model'

const getHighestRole = (user: Partial<User> & Pick<User, 'roles'>): string => {
  if (!user.roles) return ''
  if (user!.roles.length > 0) {
    if (user!.roles.includes(Role.Admin)) {
      return capitalize(Role.Admin)
    }
    if (user!.roles.includes(Role.Teacher)) {
      return capitalize(Role.Teacher)
    }
    if (user!.roles.includes(Role.Student)) {
      return capitalize(Role.Student)
    }
  }
  return ''
}

export const UserMinimalCard = ({}) => {
  const { open } = useSidebar()
  const { user } = useAuth()
  const role = getHighestRole(user!)

  return (
    <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
      <UserAvatar user={user!} />
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
          noWrap={true}
        >
          {user?.displayName}
        </Typography>
        <Tooltip title={role}>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              ...fadeInAnnimation(open),
            }}
            noWrap={true}
          >
            {role}
          </Typography>
        </Tooltip>
      </Box>
    </Stack>
  )
}
