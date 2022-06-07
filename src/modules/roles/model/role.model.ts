import { Permission } from './permission.model'

export interface Role {
  name: string
  permissions: Permission[]
}
