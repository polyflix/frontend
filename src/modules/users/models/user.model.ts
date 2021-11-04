import { BaseModel } from '@core/models/base.model'

export interface User extends BaseModel {
  email: string
  firstName: string
  lastName: string
  avatar: string
  isAccountActivated: boolean
  isAdmin: boolean
  displayName: string
}
