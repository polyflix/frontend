import { StatusCodes } from 'http-status-codes'

import { Inject, Injectable } from '@polyflix/di'

import { APP_DISPATCHER } from '@core/constants/app.constant'
import { HttpService } from '@core/services/http.service'
import type { AppDispatch } from '@core/store'

import {
  authenticateUser,
  authenticationFailed,
  authenticationInProgress,
  logoutUser,
} from '@auth/reducers/auth.slice'
import {
  ILoginForm,
  IRegisterForm,
  IResetPasswordForm,
} from '@auth/types/form.type'

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(APP_DISPATCHER) private readonly dispatch: AppDispatch
  ) {}

  public async refreshAuth() {
    this.dispatch(authenticationInProgress())

    const { status, response } = await this.httpService.post('/auth/refresh')
    if (
      status !== StatusCodes.OK ||
      (status === StatusCodes.OK && !response.user)
    ) {
      return this.dispatch(authenticationFailed())
    }

    const { user, accessToken } = response

    return this.dispatch(
      authenticateUser({
        token: accessToken,
        user: user,
      })
    )
  }

  /**
   * Login a user and authenticate it to the store.
   * @param {ILoginForm} body the form data to send with the request
   * @returns
   */
  public async login(body: ILoginForm) {
    this.dispatch(authenticationInProgress())

    const { status, response, error } = await this.httpService.post(
      '/auth/login',
      {
        body,
      }
    )

    if (status !== StatusCodes.OK) {
      throw error
    }

    const { user, accessToken } = response

    return this.dispatch(
      authenticateUser({
        token: accessToken,
        user: user,
      })
    )
  }

  /**
   * Register a user
   * @param {IRegisterForm} registerForm
   */
  public async register(registerForm: IRegisterForm) {
    this.dispatch(authenticationInProgress())

    const { status, response, error } = await this.httpService.post(
      '/auth/register',
      {
        body: {
          ...registerForm,
          redirect:
            window.location.protocol + '//' + window.location.host + '/auth/',
        },
      }
    )

    if (![StatusCodes.OK, StatusCodes.CREATED].includes(status)) {
      throw error
    }

    const { user, accessToken } = response

    return this.dispatch(authenticateUser({ user, token: accessToken }))
  }

  /**
   * Send reset password email
   * @param {IResetRequestForm} resetRequestForm
   */
  public async sendResetEmail(
    resetRequestForm: IResetPasswordForm
  ): Promise<any> {
    const { status, error, response } = await this.httpService.post(
      '/auth/forgotPassword',
      {
        body: {
          ...resetRequestForm,
          redirect:
            window.location.protocol + '//' + window.location.host + '/auth/',
        },
      }
    )

    if (status !== StatusCodes.CREATED) {
      throw error
    }

    return response
  }

  /**
   * Log out the current logged in user
   */
  public async logout() {
    await this.httpService.get('/auth/logout')
    this.dispatch(logoutUser())
  }
}
