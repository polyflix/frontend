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
import { ILoginAuth } from '@auth/types/auth.type'

import { MeService } from '@users/services/me.service'

import keycloakClient from '../../../../src/keycloak/config'

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
      await keycloakClient.updateToken(5)
      const user = await this.meService.getMe()

      this.dispatch(
        authenticateUser({
          user,
          token: keycloakClient.token!!,
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
   * @param {ILoginAuth} body the form data to send with the request
   * @returns
   */
  public async login(body: ILoginAuth) {
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
        token: keycloakClient.token!!,
        user: user,
      })
    )
  }

  /**
   * Log out the current logged in user
   */
  public async logout() {
    await keycloakClient.logout()
    this.dispatch(logoutUser())
  }
}
