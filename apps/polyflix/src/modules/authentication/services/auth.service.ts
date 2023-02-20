import { Inject, Injectable } from '@polyflix/di'

import { APP_DISPATCHER } from '@constants/app.constant'
import { ApiService } from '@services/endpoint.service'
import type { AppDispatch } from '@core/store'
import { ApiVersion } from '@types_/http.type'

import keycloakClient from '@auth/keycloak/config'
import {
  authenticateUser,
  logoutUser,
  refreshAuthFailed,
  refreshAuthInProgress,
} from '@auth/reducers/auth.slice'

import { MeService } from '@users/services/me.service'

@Injectable()
export class AuthService {
  protected endpoint: string

  constructor(
    private readonly apiService: ApiService,
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
      console.error(
        'Failed to refresh the token, or the session has expired:',
        error
      )
      this.dispatch(refreshAuthFailed())
      return
    }
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
