import { isUndefined } from 'lodash'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'

import { PrivateRoute } from '@auth/components/PrivateRoute/PrivateRoute.component'
import { useAuth } from '@auth/hooks/useAuth.hook'

import { LoginPage } from './pages/Login.page'
import RedirectPage from './pages/Redirect.page'
import { RegisterPage } from './pages/Register.page'
import { ResetPasswordPage } from './pages/ResetPassword.page'
import { ValidatePage } from './pages/Validate.page'

/**
 * This is the Authentication module router. It handles every routes behind /auth.
 */
export const AuthRouter = () => {
  const { url } = useRouteMatch()
  const { user } = useAuth()

  const isAuthenticated = !isUndefined(user)
  const isAccountActivated = user?.isAccountActivated || false
  return (
    <Switch>
      <Route exact path={`${url}/redirect`} component={RedirectPage} />
      <PrivateRoute
        exact
        path={`${url}/validate`}
        condition={isAuthenticated && !isAccountActivated}
        redirectTo={'/'}
        component={ValidatePage}
      />
      <PrivateRoute condition={!isAuthenticated} redirectTo={'/'}>
        <Switch>
          <Route
            exact
            path={`${url}/forgotten-password`}
            component={ResetPasswordPage}
          />
          <Route exact path={`${url}/login`} component={LoginPage} />
          <Route exact path={`${url}/register`} component={RegisterPage} />
        </Switch>
      </PrivateRoute>
    </Switch>
  )
}
