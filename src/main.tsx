import { isUndefined } from 'lodash'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'simplebar/src/simplebar.css'

import { useInjection } from '@polyflix/di'

import { DIProvider } from '@core/components/DIProvider/DIProvider'
import { DashboardLayout } from '@core/layouts/Dashboard/Dashboard.layout'
import { LoadingLayout } from '@core/layouts/Loading/Loading.layout'
import { OverlayContainer } from '@core/layouts/OverlayContainer/OverlayContainer.layout'
import { NotFoundPage } from '@core/pages/404.page'
import { ServiceUnavailablePage } from '@core/pages/503.page'
import { store } from '@core/store'

import { AuthRouter } from '@auth/auth.router'
import { PrivateRoute } from '@auth/components/PrivateRoute/PrivateRoute.component'
import { useAuth } from '@auth/hooks/useAuth.hook'
import { useServerHealth } from '@auth/hooks/useServerHealth.hook'
import { AuthService } from '@auth/services/auth.service'

import { GlobalStyles } from '@theme/globalStyles'
import { ThemeConfig } from '@theme/theme'

import './i18n/config'
import './styles/index.scss'

/**
 * This functional component is the main entrypoint of our app.
 * It should contains every routers of the app.
 */
const PolyflixApp = () => {
  const authService = useInjection<AuthService>(AuthService)

  const { user, hasRefreshedAuth, isLoading } = useAuth()
  const { isUnhealthy } = useServerHealth()

  // If the server is unavailable, display the 503 page
  if (isUnhealthy) return <ServiceUnavailablePage />

  // We consider that the user is authenticated when
  // the user value in the state is defined
  const isAuthenticated = !isUndefined(user)

  // If the user is not authenticated and we didn't try to refresh the authentication
  // we should try to automatically renew the authentication of the user.
  if (!isAuthenticated && !hasRefreshedAuth) authService.refreshAuth()

  if (isLoading) return <LoadingLayout />

  return (
    <Router>
      <Switch>
        {/* We want to add the auth router only if the user is currently not logged in */}
        {!isAuthenticated && (
          <PrivateRoute
            path="/auth"
            redirectTo="/"
            condition={!isAuthenticated}
            component={AuthRouter}
          />
        )}
        <PrivateRoute condition={isAuthenticated} path="/">
          <DashboardLayout>
            <Switch>
              <Route component={NotFoundPage} />
            </Switch>
          </DashboardLayout>
        </PrivateRoute>
      </Switch>
    </Router>
  )
}

// We render our app here, by wrapping it with some providers such as the Redux store provider, the DI provider
// and the theme provider, in order to ensure that every components of the app can work properly.
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <DIProvider>
        <HelmetProvider>
          <ThemeConfig>
            <GlobalStyles />
            <Suspense fallback={<LoadingLayout />}>
              <OverlayContainer>
                <PolyflixApp />
              </OverlayContainer>
            </Suspense>
          </ThemeConfig>
        </HelmetProvider>
      </DIProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('application')
)
