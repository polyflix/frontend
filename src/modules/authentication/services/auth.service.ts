import { StatusCodes } from 'http-status-codes'
import type { TFunction } from 'i18next'

import { Inject, Injectable } from '@polyflix/di'

import { APP_DISPATCHER, APP_TRANSLATION } from '@core/constants/app.constant'
import { ApiService } from '@core/services/api.service'
import { HttpService } from '@core/services/http.service'
import { SnackbarService } from '@core/services/snackbar.service'
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
  IResetPasswordForm,
} from '@auth/types/form.type'

@Injectable()
export class AuthService {
  protected endpoint: string

  constructor(
    private readonly apiService: ApiService,
    private readonly httpService: HttpService,
    private readonly snackbarService: SnackbarService,
    @Inject(APP_DISPATCHER) private readonly dispatch: AppDispatch,
    @Inject(APP_TRANSLATION) private readonly translate: TFunction
  ) {
    this.endpoint = `${this.apiService.endpoint(ApiVersion.V1)}/auth`
  }

  public async refreshAuth() {
    this.dispatch(refreshAuthInProgress())

    const { status, response } = await this.httpService.post(
      `${this.endpoint}/refresh`
    )
    if (
      status !== StatusCodes.OK ||
      (status === StatusCodes.OK && !response.user)
    ) {
      return this.dispatch(refreshAuthFailed())
    }

    const { user, accessToken } = response

    // Example for snackbar
    this.snackbarService.createSnackbar(
      this.translate('snackbarExample', { user: user.firstName }),
      {
        variant: 'success',
      }
    )

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
    resetRequestForm: IResetPasswordForm
  ): Promise<any> {
    const { status, error, response } = await this.httpService.post(
      `${this.endpoint}/forgotPassword`,
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
    await this.httpService.get(`${this.endpoint}/logout`)
    this.dispatch(logoutUser())
  }

  /**
   * Request for a new email to validate an account
   * @param email
   */
  public async sendAgainValidationEmail(email: string) {
    const { status, error } = await this.httpService.post(
      `${this.endpoint}/validate/send`,
      {
        body: {
          email,
        },
      }
    )

    if (status !== StatusCodes.ACCEPTED) {
      this.snackbarService.createSnackbar(error, {
        variant: 'error',
      })
      throw error
    }
  }

  /**
   * Request to activate an account, is executed when  user accessed to
   * validate page with an id in it
   * @param userId
   */
  public async validateAccount(userId: string) {
    const { status, error } = await this.httpService.post(
      `${this.endpoint}/validate`,
      {
        body: {
          userId,
        },
      }
    )

    if (status !== StatusCodes.ACCEPTED) {
      this.snackbarService.createSnackbar(error, {
        variant: 'error',
      })
      throw error
    }

    await this.refreshAuth()
  }
}
