import { Avatar, Theme } from '@mui/material'

import { useAuth } from '@auth/hooks/useAuth.hook'
import { PropsWithChildren } from 'react'
import { SxProps } from '@mui/system'
import { User } from '@users/models/user.model'

type UserAvatarProps = {
  user: User
  variant?: string
  sx?: SxProps<Theme>
}

export const UserAvatar: React.FC<PropsWithChildren<UserAvatarProps>> = ({user, sx, variant}) => {

  return (
    <Avatar
      sx={{ ...sx }}
      variant={variant}
      src={user?.avatar}
      alt={`${user?.displayName} profile picture`}
    />
  )
}
