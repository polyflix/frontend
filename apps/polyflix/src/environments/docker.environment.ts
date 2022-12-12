import { Environment } from '@core/types/environment.type'

export const environment: Environment = {
  mocked: false,
  api: 'http://host.docker.internal:4000',
  minioUrl: 'http://host.docker.internal:9000',
  urlRealm: 'http://localhost:3002/',
  realm: 'Polyflix',
  clientIdReald: 'polyflix-front',
  redirectUri: 'http://localhost:8080/auth/redirect',
}
