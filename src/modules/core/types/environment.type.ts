/**
 * Don't use this type unless in environement config
 */
type DebugCredential = {
  email: string
  password: string
  name: string
}

export interface Environment {
  api: string
  minioUrl: string
  debugMode?: boolean
  debugCredentials?: DebugCredential[]
  urlRealm: string
  realm: string
  clientIdReald: string
  redirectUri: string
}
