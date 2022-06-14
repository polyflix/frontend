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
import 'simplebar/src/simplebar.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'swiper/css'

import { useInjection } from '@polyflix/di'

import { DIProvider } from '@core/components/DIProvider/DIProvider'
import ModalCookies from '@core/components/Modals/ModalCookie.component'
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

// import { LinkRouter } from '@links/links.router'$
import { CollectionRouter } from '@collections/collection.router'

import { CourseRouter } from '@courses/course.router'

import { UserRouter } from '@users/user.router'

import { GlobalStyles } from '@theme/globalStyles'
import { ThemeConfig } from '@theme/theme'

import i18n from './i18n/config'
import { AdminRouter } from './modules/admin/admin.router'
import { CertificatePage } from './modules/certifications/pages/Certificate.page'
import './styles/index.scss'

/**
 * This functional component is the main entrypoint of our app.
 * It should contains every routers of the app.
 */
const PolyflixApp = () => {
  const authService = useInjection<AuthService>(AuthService)

  const { user, hasRefreshedAuth, isAuthRefreshing } = useAuth()
  const { initialized, keycloak } = useKeycloak()
  const { isUnhealthy } = useServerHealth()
  // If the server is unavailable, display the 503 page
  if (isUnhealthy)
    return (
      <Router>
        <ServiceUnavailablePage />
      </Router>
    )

  // We consider that the user is authenticated when
  // the user value in the state is defined
  const isKeycloakAuthenticated = Boolean(keycloak.authenticated)
  const isAuthenticated = !isUndefined(user) && isKeycloakAuthenticated

  // If the user is not authenticated and we didn't try to refresh the authentication
  // we should try to automatically renew the authentication of the user.
  if (!isAuthenticated && !hasRefreshedAuth && initialized) {
    authService.refreshAuth()
  }

  // We want to return the loading screen only in the case of the refresh authentication
  // or if we are waiting for informations from the server
  if (isAuthRefreshing || !initialized) return <LoadingLayout />

  return (
    <Router>
      <Switch>
        {/* We want the user to be redirected to home page if already logged in */}
        <Route path="/auth" component={AuthRouter} />
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
              {/* <Route path="/links" component={LinkRouter} />{' '} */}
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
                    <ModalCookies />
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
