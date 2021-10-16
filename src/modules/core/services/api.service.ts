/**
 * Allows you to manage everything related to api
 */
import { Injectable } from '@polyflix/di'

import { ApiType } from '@core/types/http.type'

import { EnvironmentService } from './environment.service'

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
