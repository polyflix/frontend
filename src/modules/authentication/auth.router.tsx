import { isUndefined } from 'lodash'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { PrivateRoute } from '@auth/components/PrivateRoute/PrivateRoute.component'
import { useAuth } from '@auth/hooks/useAuth.hook'

import { LoginPage } from './pages/Login.page'
import { RedirectPage } from './pages/Redirect.page'
import { ResetPasswordPage } from './pages/ResetPassword.page'

/**
 * This is the Authentication module router. It handles every routes behind /auth.
 */
export const AuthRouter = () => {
  const { url } = useRouteMatch()
  const { user } = useAuth()

  const isAuthenticated = !isUndefined(user)
  return (
    <Switch>
      <Route exact path={`${url}/redirect`} component={RedirectPage} />
      <PrivateRoute condition={!isAuthenticated} redirectTo={'/'}>
        <Switch>
          <Route
            exact
            path={`${url}/forgotten-password`}
            component={ResetPasswordPage}
          />
          <Route exact path={`${url}/login`} component={LoginPage} />
        </Switch>
      </PrivateRoute>
    </Switch>
  )
}
