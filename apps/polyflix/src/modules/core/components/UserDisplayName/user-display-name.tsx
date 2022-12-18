import { TypographyProps } from '@mui/material'
import { User } from '@users/models/user.model'
import { NullableTypography } from '../NullableTypography/nullable-typography.component'

type UserDisplayNameProps = TypographyProps & {
  user: (Pick<User, 'firstName'> & Pick<User, 'lastName'>) | undefined
}

export const UserDisplayName = ({ user, ...props }: UserDisplayNameProps) => {
  const userName = user ? `${user.firstName} ${user.lastName}` : null
  return <NullableTypography {...props}>{userName}</NullableTypography>
}
