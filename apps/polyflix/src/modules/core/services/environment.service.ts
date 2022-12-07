import { environment } from '@env/environment'

import { Injectable } from '@polyflix/di'

import { Environment } from '@core/types/environment.type'

/**
 * Allows you to manage everything related to environment
 */
@Injectable()
export class EnvironmentService {
  get(): Environment {
    return environment
  }
}
