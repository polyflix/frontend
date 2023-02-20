import { Environment } from '@types_/environment.type'

export const environment: Environment = {
  mocked: false,
  api: 'https://qapolyflix.dopolytech.fr',
  minioUrl: 'https://minio.qapolyflix.dopolytech.fr',
  urlRealm: 'https://sso.qapolyflix.dopolytech.fr/',
  redirectUri: 'https://qapolyflix.dopolytech.fr/auth/redirect',
  realm: 'polyflix',
  clientIdReald: 'polyflix-front',
}
