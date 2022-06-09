import { useKeycloak } from '@react-keycloak/web'
import { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { LoadingLayout } from '@core/layouts/Loading/Loading.layout'

import { AuthService } from '@auth/services/auth.service'

/**
 * The page we lands on when keycloak auth is successful
 * @returns
 */
export const RedirectPage = () => {
  const authService = useInjection<AuthService>(AuthService)
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const { keycloak, initialized } = useKeycloak()

  const isKeycloakAuthenticated = Boolean(keycloak.authenticated)

  useEffect(() => {
    // Fetch the current logged in user profile and
    // add it to the global state, before redirecting
    // to the application.
    if (isKeycloakAuthenticated)
      authService.getUser().finally(() => setIsFetching(false))
  }, [keycloak])

  if (!isKeycloakAuthenticated) keycloak.login()

  if (!initialized || isFetching) return <LoadingLayout />

  return <Redirect to="/" />
}
