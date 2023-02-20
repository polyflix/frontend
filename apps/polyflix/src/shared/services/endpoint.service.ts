/**
 * Allows you to manage everything related to api
 */
import { Injectable } from '@polyflix/di'

import { ApiType } from '@types_/http.type'

import { EnvironmentService } from '@services/environment.service'

@Injectable()
export class ApiService {
  constructor(private environmentService: EnvironmentService) {}

  endpoint(apiVersion: string, apiType?: ApiType): string {
    const environment = this.environmentService.get()

    const endpoint = environment.api
    return apiType
      ? `${endpoint}/${apiType}/api/${apiVersion}`
      : `${endpoint}/api/${apiVersion}`
  }
}
