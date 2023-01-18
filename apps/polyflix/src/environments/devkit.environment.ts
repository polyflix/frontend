import { Environment } from '@core/types/environment.type'

export const environment: Environment = {
  mocked: false,
  api: 'http://polyflix.local',
  minioUrl: 'http://minio',
  urlRealm: 'http://keycloak/',
  redirectUri: 'http://localhost:3000/auth/redirect',
  realm: 'Polyflix',
  clientIdReald: 'polyflix-front',
}
