import { User } from '@types_/user.type'

export const getUserFullname = (
  user: User,
  onlyFirstname: boolean = false
): string => {
  if (user) {
    return onlyFirstname ? user.firstName : `${user.firstName} ${user.lastName}`
  }
  return ''
}

export const getUsernameToDisplay = (
  user: User,
  onlyFirstname: boolean = false
): string => {
  const username =
    user?.username && user?.username != user?.email
      ? user?.username
      : getUserFullname(user, onlyFirstname)
  return username
}
