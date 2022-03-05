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

export const convertKeycloakUserToModel = (data: any): User => ({
    ...data,
    avatar: "https://c.tenor.com/2O1TPEXjjj0AAAAC/cheems-doggo.gif",
  isAccountActivated: true,
  isAdmin: true,
  displayName: data.firstName + " " + data.lastName,
})
