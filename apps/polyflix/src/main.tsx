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
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'simplebar-react/dist/simplebar.min.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'swiper/css'

import { useInjection } from '@polyflix/di'

import { DIProvider } from '@core/components/DIProvider/DIProvider'
import { DashboardLayout } from '@core/layouts/Dashboard/Dashboard.layout'
import { LoadingLayout } from '@core/layouts/Loading/Loading.layout'
import { NotFoundPage } from '@core/pages/404.page'
import { ServiceUnavailablePage } from '@core/pages/503.page'
import { HomePage } from '@core/pages/Home.page'
import { store } from '@core/store'
import { Role } from '@core/types/roles.type'

import { AuthRouter } from '@auth/auth.router'
import { PrivateRoute } from '@auth/components/PrivateRoute/PrivateRoute.component'
import { useAuth } from '@auth/hooks/useAuth.hook'
import { useServerHealth } from '@auth/hooks/useServerHealth.hook'
import keycloakClient from '@auth/keycloak/config'
import { AuthService } from '@auth/services/auth.service'

import { QuizzRouter } from '@quizzes/quizzes.router'

import { VideoRouter } from '@videos/video.router'

import { CollectionRouter } from '@collections/collection.router'

import { CourseRouter } from '@courses/course.router'

import { UserRouter } from '@users/user.router'

import { GlobalStyles } from '@theme/globalStyles'
import { ThemeConfig } from '@theme/theme'

import i18n from './i18n/config'
import { AdminRouter } from './modules/admin/admin.router'
import { CertificatePage } from './modules/certifications/pages/Certificate.page'
import './styles/index.scss'

import { initMockServer } from 'mock-server'

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

  return (
    <Router>
      <Switch>
        {/* We want the user to be redirected to home page if already logged in */}
        <Route
          path="/auth"
          render={() => <AuthRouter isAuthenticated={isAuthenticated} />}
        />
        <Route path="/certificate/:id" component={CertificatePage} />

        {/* We restrict these route to an authenticated user*/}
        <PrivateRoute condition={isAuthenticated}>
          <DashboardLayout>
            <Switch>
              <Route path="/courses" component={CourseRouter} />
              <Route path="/quizzes" component={QuizzRouter} />
              <Route path="/users" component={UserRouter} />
              <Route path="/videos" component={VideoRouter} />
              <Route path="/modules" component={CollectionRouter} />
              <Route exact path="/" component={HomePage} />
              <PrivateRoute
                condition={user?.roles.includes(Role.Admin) || false}
              >
                <Route path="/admin" component={AdminRouter} />
              </PrivateRoute>
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
    <Suspense fallback={<LoadingLayout />}>
      <Provider store={store}>
        <ThemeConfig>
          <GlobalStyles />
          <I18nextProvider i18n={i18n}>
            <SnackbarProvider maxSnack={5}>
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
