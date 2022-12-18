import { Environment } from '@core/types/environment.type'

/**
 * This is the default environment which will be used by our app.
 * The content of this file will be modified by the build when the NODE_ENV
 * is different from "local" to take the good variables depending on your environment.
 *
 * You should ALWAYS import only this file in the app in order to access variables.
 */
export const environment: Environment = {
  mocked: true,
  api: 'http://localhost:3000',
  minioUrl: 'http://localhost:9000',
  urlRealm: 'http://localhost:3002/',
  redirectUri: 'http://localhost:3000/auth/redirect',
  realm: 'Polyflix',
  clientIdReald: 'polyflix-front',
}
