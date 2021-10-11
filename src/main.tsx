import { isUndefined } from 'lodash'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'simplebar/src/simplebar.css'

import { DIProvider } from '@core/components/DIProvider/DIProvider'
import { DashboardLayout } from '@core/layouts/Dashboardx/Dashboard.layout'
import { store } from '@core/redux/store'

import { AuthRouter } from '@auth/auth.router'
import { PrivateRoute } from '@auth/components/PrivateRoute/PrivateRoute.component'
import { useAuth } from '@auth/hooks/useAuth.hook'

import { GlobalStyles } from '@theme/globalStyles'
import { ThemeConfig } from '@theme/theme'

import './i18n/config'
import './styles/index.scss'

/**
 * This functional component is the main entrypoint of our app.
 * It should contains every routers of the app.
 */
const PolyflixApp = () => {
  const { user } = useAuth()

  return (
    <Router>
      <Switch>
        {/* We want to add the auth router only if there is no user logged in */}
        {isUndefined(user) && <Route path="/auth" component={AuthRouter} />}
        <PrivateRoute exact condition={!isUndefined(user)} path="/">
          <DashboardLayout>
            <Switch>
              <Route path="/"></Route>
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
    <Suspense fallback={<div>Loading</div>}>
      <Provider store={store}>
        <DIProvider>
          <HelmetProvider>
            <ThemeConfig>
              <GlobalStyles />
              <PolyflixApp />
            </ThemeConfig>
          </HelmetProvider>
        </DIProvider>
      </Provider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('application')
)
