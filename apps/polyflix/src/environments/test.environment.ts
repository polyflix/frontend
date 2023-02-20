import { Environment } from '@types_/environment.type'

export const environment: Environment = {
  mocked: false,
  api: 'https://dev.polyflix.dopolytech.fr',
  minioUrl: 'https://minio.dev.polyflix.dopolytech.fr',
  urlRealm: 'https://sso.qapolyflix.dopolytech.fr/',
  redirectUri: 'https://qapolyflix.dopolytech.fr/auth/redirect',
  realm: 'polyflix',
  clientIdReald: 'polyflix-front',
}
