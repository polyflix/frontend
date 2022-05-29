import { Environment } from '@core/types/environment.type'

/**
 * This is the default environment which will be used by our app.
 * The content of this file will be modified by the build when the NODE_ENV
 * is different than "local" to take the good variables depending on your environment.
 *
 * You should ALWAYS import only this file in the app in order to access variables.
 */
export const environment: Environment = {
  api: 'http://localhost:4000',
  minioUrl: 'http://localhost:9000',
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
