/**
 * This is the default environment which will be used by our app.
 * The content of this file will be modified by the build when the NODE_ENV
 * is different than "local" to take the good variables depending on your environment.
 *
 * You should ALWAYS import only this file in the app in order to acces variables.
 */
export const environment = {
  api: 'http://localhost:5000/api/v1',
  minioUrl: 'http://localhost:9000',
}
