import { StatusCodes } from 'http-status-codes'

import { Inject, Injectable } from '@polyflix/di'

import { APP_DISPATCHER } from '@core/constants/app.constant'
import { ApiService } from '@core/services/endpoint.service'
import { HttpService } from '@core/services/http.service'
import type { AppDispatch } from '@core/store'
import { ApiVersion } from '@core/types/http.type'

import {
  authenticateUser,
  authenticationFailed,
  authenticationInProgress,
  logoutUser,
  refreshAuthFailed,
  refreshAuthInProgress,
} from '@auth/reducers/auth.slice'
import {
  ILoginForm,
  IRegisterForm,
  IRequestResetPasswordForm,
  IResetPasswordForm,
} from '@auth/types/form.type'

import { MeService } from '@users/services/me.service'

import keycloak from '../../../../src/keycloak/config'

@Injectable()
export class AuthService {
  protected endpoint: string

  constructor(
    private readonly apiService: ApiService,
    private readonly httpService: HttpService,
    private readonly meService: MeService,
    @Inject(APP_DISPATCHER) private readonly dispatch: AppDispatch
  ) {
    this.endpoint = `${this.apiService.endpoint(ApiVersion.V1)}/auth`
  }

  public async refreshAuth() {
    this.dispatch(refreshAuthInProgress())

    try {
      await keycloak.updateToken(5)
      const user = await this.meService.getMe()

      this.dispatch(
        authenticateUser({
          user,
          token: keycloak.token!!,
        })
      )
    } catch (error) {
      console.log(
        'Failed to refresh the token, or the session has expired:',
        error
      )
      this.dispatch(refreshAuthFailed())
      return
    }
  }

  /**
   * Login a user and authenticate it to the store.
   * @param {ILoginForm} body the form data to send with the request
   * @returns
   */
  public async login(body: ILoginForm) {
    this.dispatch(authenticationInProgress())

    const { status, response, error } = await this.httpService.post(
      `${this.endpoint}/login`,
      {
        body,
      }
    )

    if (status !== StatusCodes.OK) {
      this.dispatch(authenticationFailed())
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
   * Fetch the current logged in user profile
   */
  public async getUser() {
    const user = await this.meService.getMe()
    return this.dispatch(
      authenticateUser({
        token: keycloak.token!!,
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
      `${this.endpoint}/register`,
      {
        body: {
          ...registerForm,
          redirect:
            window.location.protocol + '//' + window.location.host + '/auth/',
        },
      }
    )

    if (![StatusCodes.OK, StatusCodes.CREATED].includes(status)) {
      this.dispatch(authenticationFailed())
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
    resetRequestForm: IRequestResetPasswordForm
  ): Promise<any> {
    const { status, error, response } = await this.httpService.post(
      `${this.endpoint}/forgotPassword`,
      {
        body: {
          ...resetRequestForm,
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
    await keycloak.logout()
    this.dispatch(logoutUser())
  }

  /**
   * Send a new password
   * @param resetPasswordForm
   */
  public async resetPassword(
    resetPasswordForm: IResetPasswordForm
  ): Promise<void | string> {
    const { status, error } = await this.httpService.post(
      `${this.endpoint}/resetPassword`,
      {
        body: resetPasswordForm,
      }
    )

    if (status !== StatusCodes.OK) {
      return error
    }
  }
}
