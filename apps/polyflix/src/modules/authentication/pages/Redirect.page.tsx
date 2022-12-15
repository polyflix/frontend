import { useKeycloak } from '@react-keycloak/web'
import { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { LoadingLayout } from '@core/layouts/Loading/Loading.layout'

import { AuthService } from '@auth/services/auth.service'
import { KeycloakLoginOptions } from 'keycloak-js'

interface Props {
  redirectUri: string | undefined
}

/**
 * The page we land on when keycloak auth is successful
 */
export const RedirectPage = ({ redirectUri: redirectUri }: Props) => {
  const authService = useInjection<AuthService>(AuthService)

  const [isFetching, setIsFetching] = useState<boolean>(true)
  const { keycloak, initialized } = useKeycloak()

  const isKeycloakAuthenticated = Boolean(keycloak.authenticated)

  useEffect(() => {
    // Fetch the current logged-in user profile and
    // add it to the global state, before redirecting
    // to the application.
    if (isKeycloakAuthenticated) {
      authService.getUser().finally(() => setIsFetching(false))
    }
  }, [keycloak])

  const loginOptions: KeycloakLoginOptions = {
    redirectUri,
  }
  if (!isKeycloakAuthenticated) {
    if (redirectUri) {
      keycloak.login(loginOptions)
    } else {
      keycloak.login()
    }
  }

  if (!initialized || isFetching) return <LoadingLayout />

  return <Redirect to={redirectUri ?? '/'} />
}
