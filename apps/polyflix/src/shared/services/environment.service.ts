import { environment } from '@env/environment'

import { Injectable } from '@polyflix/di'

import { Environment } from '@types_/environment.type'

/**
 * Allows you to manage everything related to environment
 */
@Injectable()
export class EnvironmentService {
  get(): Environment {
    return environment
  }
}
