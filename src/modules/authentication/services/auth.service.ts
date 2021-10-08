import { Injectable } from '@polyflix/di'
import { StatusCodes } from 'http-status-codes'

import { HttpService } from '../../common/services/http.service'
import { ReduxService } from '../../common/services/redux.service'
import { User } from '../../users/models/user.model'
import { Token } from '../models/token.model'
import {
  LoginFailureAction,
  LoginInProgressAction,
  LoginSuccessAction,
  LogoutAction,
  RefreshAuthFailureAction,
  RefreshAuthInProgress,
  RefreshAuthSuccessAction,
  RegisterFailureAction,
  RegisterInProgressAction,
  RegisterSuccessAction,
  ValidateAccountAction,
  ResetPasswordFailureAction,
  ResetPasswordInProgressAction,
  ResetPasswordSuccessAction,
} from '../redux/actions/auth.action'
import {
  AuthAction,
  ILoginForm,
  IRegisterForm,
  IResetPasswordForm,
  IResetRequestForm,
} from '../types/auth.type'

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly reduxService: ReduxService<AuthAction>
  ) {}

  /**
   * Login a user
   * @param {ILoginForm} loginForm
   */
  public async login(loginForm: ILoginForm) {
    this.reduxService.dispatch(LoginInProgressAction())

    const { status, response, error } = await this.httpService.post(
      '/auth/login',
      {
        body: loginForm,
      }
    )

    if (![StatusCodes.OK, StatusCodes.CREATED].includes(status)) {
      return this.reduxService.dispatch(LoginFailureAction(error))
    }

    const { user, accessToken } = response

    const token = Token.decode(accessToken)

    return this.reduxService.dispatch(
      LoginSuccessAction(User.fromJson(user), token)
    )
  }

  /**
   * Refresh authentication
   */
  public async refreshAuth() {
    this.reduxService.dispatch(RefreshAuthInProgress())
    const { status, response } = await this.httpService.post('/auth/refresh')
    if (
      status !== StatusCodes.OK ||
      (status === StatusCodes.OK && !response.user)
    ) {
      return this.reduxService.dispatch(RefreshAuthFailureAction())
    }
    const token = Token.decode(response.token)

    return this.reduxService.dispatch(
      RefreshAuthSuccessAction(User.fromJson(response.user), token)
    )
  }

  /**
   * Log out the user
   */
  public async logout() {
    await this.httpService.get('/auth/logout')
    return this.reduxService.dispatch(LogoutAction())
  }

  /**
   * Register a user
   * @param {IRegisterForm} registerForm
   */
  public async register(registerForm: IRegisterForm) {
    this.reduxService.dispatch(RegisterInProgressAction())
    registerForm.redirect =
      window.location.protocol + '//' + window.location.host + '/auth/'

    const { status, response, error } = await this.httpService.post(
      '/auth/register',
      {
        body: registerForm,
      }
    )

    if (![StatusCodes.OK, StatusCodes.CREATED].includes(status))
      return this.reduxService.dispatch(RegisterFailureAction(error))

    const { user, accessToken } = response
    const token = Token.decode(accessToken)

    return this.reduxService.dispatch(
      RegisterSuccessAction(User.fromJson(user), token)
    )
  }

  /**
   * Send reset password email
   * @param {IResetRequestForm} resetRequestForm
   */
  public async sendResetEmail(resetRequestForm: IResetRequestForm) {
    resetRequestForm.redirect =
      window.location.protocol + '//' + window.location.host + '/auth/'
    await this.httpService.post('/auth/forgotPassword', {
      body: resetRequestForm,
    })
  }

  /**
   * Reset password
   * @param {IResetPasswordForm} resetRequestForm
   */
  public async resetPassword(
    resetPasswordForm: IResetPasswordForm
  ): Promise<boolean> {
    this.reduxService.dispatch(ResetPasswordInProgressAction())
    const { status } = await this.httpService.post('/auth/resetPassword', {
      body: resetPasswordForm,
    })
    if (![StatusCodes.OK, StatusCodes.CREATED].includes(status)) {
      this.reduxService.dispatch(ResetPasswordFailureAction())
      return false
    }
    this.reduxService.dispatch(ResetPasswordSuccessAction())
    return true
  }

  public async activateAccount(userId: string) {
    const { response } = await this.httpService.post('/auth/activateAccount', {
      body: {
        userId,
      },
    })
    if (response) {
      this.reduxService.dispatch(ValidateAccountAction(response))
    }
  }

  public async sendValidationEmail(email: string) {
    await this.httpService.post('/auth/validationEmail', {
      body: {
        email,
        redirect:
          window.location.protocol + '//' + window.location.host + '/auth/',
      },
    })
  }
}
