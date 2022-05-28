import { Injectable } from '@polyflix/di'

import { ApiService } from '@core/services/endpoint.service'
import { HttpService } from '@core/services/http.service'
import { ApiVersion } from '@core/types/http.type'

import { User } from '@users/models/user.model'

import keycloak from '../../../keycloak/config'

@Injectable()
export class MeService {
  private readonly endpoint: string

  constructor(
    private readonly httpService: HttpService,
    private readonly apiService: ApiService
  ) {
    this.endpoint = this.apiService.endpoint(ApiVersion.V2_0_0) + '/users'
  }

  async getMe(): Promise<User> {
    const { response } = await this.httpService.get(
      `${this.endpoint}/${keycloak.subject}`,
      {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      }
    )
    return response
  }
}
