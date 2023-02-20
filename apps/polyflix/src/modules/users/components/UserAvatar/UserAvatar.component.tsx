import { Avatar, Theme } from '@mui/material'
import { SxProps } from '@mui/system'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { User } from '@types_/user.type'

type UserAvatarProps = {
  user?: Pick<User, 'firstName'> & Pick<User, 'lastName'> & Pick<User, 'avatar'>
  variant?: 'square' | 'circular' | 'rounded' | undefined
  sx?: SxProps<Theme>
}

export const UserAvatar = ({ ...props }: UserAvatarProps) => {
  const { user: authenticatedUser } = useAuth()

  const user = props.user || authenticatedUser

  return (
    <Avatar
      sx={{ ...props.sx }}
      variant={props.variant}
      src={user?.avatar}
      alt={`${user?.firstName} ${user?.lastName} profile picture`}
    />
  )
}
