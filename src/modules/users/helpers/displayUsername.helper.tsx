import { User } from '@users/models/user.model'

export const getUserFullname = (
  user: User,
  onlyFistname: boolean = false
): string => {
  return onlyFistname ? user?.firstName : user?.firstName + ' ' + user?.lastName
}

export const getUsernameToDisplay = (
  user: User,
  onlyFistname: boolean = false
): string => {
  const username =
    user?.username && user?.username != user?.email
      ? user?.username
      : getUserFullname(user, onlyFistname)
  return username
}
