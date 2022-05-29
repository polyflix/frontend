import { environment } from '@env/environment'
import Keycloak from 'keycloak-js'

const keycloakClient = new Keycloak({
  url: environment.urlRealm,
  realm: environment.realm,
  clientId: environment.clientIdReald,
})

export default keycloakClient
