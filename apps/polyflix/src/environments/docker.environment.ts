import { Environment } from '@core/types/environment.type'

export const environment: Environment = {
  api: 'http://host.docker.internal:4000',
  minioUrl: 'http://host.docker.internal:9000',
  debugMode: true,
  debugCredentials: [
    {
      name: 'Unverified',
      email: 'unverified@gmail.com',
      password: '123456789',
    },
    { name: 'Student', email: 'student@gmail.com', password: '123456789' },
    { name: 'Professor', email: 'professor@gmail.com', password: '123456789' },
    { name: 'Admin', email: 'admin@gmail.com', password: '123456789' },
  ],
  urlRealm: 'http://localhost:3002/',
  realm: 'Polyflix',
  clientIdReald: 'polyflix-front',
  redirectUri: 'http://localhost:8080/auth/redirect',
}
