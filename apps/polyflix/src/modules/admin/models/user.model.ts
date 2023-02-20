import { Role } from '@types_/roles.type'

export interface AdminUserForm {
  avatar?: string
  username?: string
  firstName?: string
  lastName?: string
  roles: Role[]
}
