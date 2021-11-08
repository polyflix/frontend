import { BaseModel } from '@core/models/base.model'
import { Role } from '@core/types/roles.type'

export interface User extends BaseModel {
  email: string
  firstName: string
  lastName: string
  avatar: string
  isAccountActivated: boolean
  isAdmin: boolean
  displayName: string
  roles?: Role[]
}
