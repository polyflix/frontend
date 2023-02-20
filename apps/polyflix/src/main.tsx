import { environment } from '@env/environment'
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web'
import '@vime/core/themes/default.css'
import { isUndefined } from 'lodash'
import { SnackbarProvider } from 'notistack'
import React, { Suspense } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-circular-progressbar/dist/styles.css'
import ReactDOM from 'react-dom'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { Router } from '@routes/router'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'simplebar-react/dist/simplebar.min.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'swiper/css'

import { useInjection } from '@polyflix/di'

import { DIProvider } from '@core/components/DIProvider/DIProvider'
import { LoadingLayout } from '@layouts/Loading/Loading.layout'
import { ServiceUnavailablePage } from '@core/pages/503.page'
import { store } from '@core/store'

import { useAuth } from '@auth/hooks/useAuth.hook'
import { useServerHealth } from '@auth/hooks/useServerHealth.hook'
import keycloakClient from '@auth/keycloak/config'
import { AuthService } from '@auth/services/auth.service'

import { GlobalStyles } from '@theme/globalStyles'
import { ThemeConfig } from '@theme/theme'

import i18n from './i18n/config'
import './styles/index.scss'

import { initMockServer } from 'mock-server'
import { useRoles } from '@core/hooks/useRoles.hook'

if (environment.mocked) {
  initMockServer()
}

/**
 * This functional component is the main entrypoint of our app.
 * It should contain every router of the app.
 */
const PolyflixApp = () => {
  const authService = useInjection<AuthService>(AuthService)

  let { keycloak, initialized } = useKeycloak()
  const { user, hasRefreshedAuth, isAuthRefreshing } = useAuth()
  const { isUnhealthy } = useServerHealth()

  // If the environment is currently mocked,
  // We don't care about the status of a potential Keycloak install
  // So we can force the `initialized` param to be true
  if (environment.mocked) {
    initialized = true
    // We force `keycloak.authenticated` to be truthy
    // So that when the developer will choose the user to
    // mock, it will directly access the app
    keycloak.authenticated = true
  }

  // If Keycloak isn't initialized yet,
  // We can't perform any requests on it.
  if (!initialized) {
    return <LoadingLayout />
  }

  // If the server is unavailable, display the 503 page
  if (isUnhealthy) {
    return (
      <Router>
        <ServiceUnavailablePage />
      </Router>
    )
  }

  const isAuthenticated = Boolean(keycloak.authenticated) && !isUndefined(user)

  if (!environment.mocked) {
    // If the user isn't authenticated, and we didn't try to refresh the authentication
    // we should try to automatically renew the authentication of the user.
    if (!isAuthenticated && !hasRefreshedAuth) {
      authService.refreshAuth()
    }

    // We return the loading screen if the authentication is currently being refreshed and
    // if the mock server isn't enabled.
    if (isAuthRefreshing) {
      return <LoadingLayout />
    }
  }

  // We want to redirect the user to the wanted page after the authentication
  // So we get the current url and pass it to the AuthRouter
  const wantedUri = window.location.href

  return <Router isAuthenticated={isAuthenticated} wantedUri={wantedUri} />
}

// We render our app here, by wrapping it with some providers such as the Redux store provider, the DI provider
// and the theme provider, in order to ensure that every components of the app can work properly.
ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<LoadingLayout />}>
      <Provider store={store}>
        <ThemeConfig>
          <GlobalStyles />
          <I18nextProvider i18n={i18n}>
            <SnackbarProvider
              maxSnack={5}
              action={(key) => <CloseSnackbarButton key={key} />}
            >
              <DIProvider>
                <HelmetProvider>
                  <ReactKeycloakProvider authClient={keycloakClient}>
                    <PolyflixApp />
                  </ReactKeycloakProvider>
                </HelmetProvider>
              </DIProvider>
            </SnackbarProvider>
          </I18nextProvider>
        </ThemeConfig>
      </Provider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('application')
)
