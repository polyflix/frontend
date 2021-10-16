/**
 * Allows you to manage everything related to environement
 */
import { Injectable } from '@polyflix/di'

import { Environment } from '@core/types/environment.type'

import { environment } from '../../../environments/environment'

@Injectable()
export class EnvironmentService {
  get(): Environment {
    return environment
  }
}
