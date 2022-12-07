import { Avatar, Theme } from '@mui/material'
import { SxProps } from '@mui/system'

import { User } from '@users/models/user.model'

type UserAvatarProps = {
  // user: Partial<User> & Pick<User, 'displayName'> & Pick<User, 'avatar'>
  user: Pick<User, 'firstName'> & Pick<User, 'lastName'> & Pick<User, 'avatar'>
  variant?: 'square' | 'circular' | 'rounded' | undefined
  sx?: SxProps<Theme>
}

export const UserAvatar = ({ ...props }: UserAvatarProps) => {
  return (
    <Avatar
      sx={{ ...props.sx }}
      variant={props.variant}
      src={props.user?.avatar}
      // alt={`${props.user?.displayName} profile picture`}
      alt={`${props.user?.firstName} ${props.user?.lastName} profile picture`}
    />
  )
}
