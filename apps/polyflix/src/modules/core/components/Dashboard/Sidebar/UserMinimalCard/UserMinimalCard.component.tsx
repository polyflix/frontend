import { useAuth } from '@auth/hooks/useAuth.hook'
import { useSidebar } from '@core/hooks/useSidebar.hook'
import { Role } from '@types_/roles.type'
import { fadeInAnnimation } from '@core/utils/animation'
import { Box, Stack, Tooltip, Typography } from '@mui/material'
import { UserAvatar } from '@users/components/UserAvatar/UserAvatar.component'
import { getUsernameToDisplay } from '@users/helpers/displayUsername.helper'
import { User } from '@types_/user.type'

import { capitalize } from 'lodash'
import { useTranslation } from 'react-i18next'

const getHighestRole = (user: Partial<User> & Pick<User, 'roles'>): string => {
  if (!user.roles) return ''
  if (user!.roles.length > 0) {
    if (user!.roles.includes(Role.Admin)) {
      return capitalize(Role.Admin)
    }
    if (user!.roles.includes(Role.Contributor)) {
      return capitalize(Role.Contributor)
    }
    if (user!.roles.includes(Role.Member)) {
      return capitalize(Role.Member)
    }
  }
  return ''
}

export const UserMinimalCard = ({}) => {
  const { open } = useSidebar()
  const { user } = useAuth()
  const { t } = useTranslation()
  const role = t(`roles.${getHighestRole(user!).toLowerCase()}`)

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
          {getUsernameToDisplay(user!)}
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
