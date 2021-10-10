export interface ILoginForm {
  email: string
  password: string
}

export interface IRegisterForm extends ILoginForm {
  firstName: string
  lastName: string
  passwordConfirm: string
}

export interface IResetPasswordForm {
  email: string
}
