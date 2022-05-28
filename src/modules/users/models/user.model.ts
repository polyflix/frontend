import { Role } from '@core/types/roles.type'

export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  avatar: string
  roles: Role[]
}
