import { Environment } from '@types_/environment.type'

export const environment: Environment = {
  mocked: false,
  api: 'https://polyflix.dopolytech.fr',
  minioUrl: 'https://minio.polyflix.dopolytech.fr',
  urlRealm: 'https://sso.polyflix.dopolytech.fr/',
  redirectUri: 'https://polyflix.dopolytech.fr/auth/redirect',
  realm: 'polyflix',
  clientIdReald: 'polyflix-front',
}
