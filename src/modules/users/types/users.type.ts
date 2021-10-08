import { AlertType } from '../../ui/components/Alert/Alert.component'

export type UserState<T> = {
  isLoading: boolean
  data: T | null
  alert: { type: AlertType; message: string } | null
}

export interface IUserProfileUpdate {
  id: number
  email: string
  firstName: string
  lastName: string
  profilePicture: string | null
  isAccountActivated: boolean
  isAdmin: boolean
}

export interface IUserPasswordForm {
  currentPassword: string
  password: string
  passwordConfirm: string
}
