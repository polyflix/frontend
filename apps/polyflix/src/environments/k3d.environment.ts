import { Environment } from '@core/types/environment.type'

export const environment: Environment = {
  api: 'http://polyflix.test',
  minioUrl: 'http://minio.test',
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
}
