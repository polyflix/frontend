import { isUndefined } from 'lodash'
import { Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom'

import { PrivateRoute } from '@auth/components/PrivateRoute/PrivateRoute.component'
import { useAuth } from '@auth/hooks/useAuth.hook'

import { LoginPage } from './pages/Login.page'
import { RegisterPage } from './pages/Register.page'
import { ResetPasswordPage } from './pages/ResetPassword.page'
import { ValidatePage } from './pages/Validate.page'
import { useKeycloak } from '@react-keycloak/web'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { authenticateUser } from '@auth/reducers/auth.slice'
import { convertKeycloakUserToModel } from '@users/models/user.model'
import { store } from '@core/store'
import { useInjection } from '@polyflix/di'
import { AuthService } from '@auth/services/auth.service'

/**
 * This is the Authentication module router. It handles every routes behind /auth.
 */
export const AuthRouter = () => {
  const { url } = useRouteMatch()
  const { user } = useAuth()
  const { keycloak } = useKeycloak()
  const dispatch = useDispatch()
  const history = useHistory<any>()
  const authService = useInjection<AuthService>(AuthService)


  useEffect(() => {
    if (!keycloak)
      return;

    console.log("AUTHENTICATION STATUS IS " + keycloak.authenticated)

    if (keycloak.authenticated && keycloak.isTokenExpired()) {
      keycloak.updateToken(30).then(console.log)
        .catch(function() {
        alert('Failed to refresh token');
      });
    } else if (keycloak.authenticated) {
      keycloak.loadUserProfile()
        .then(async function(profile) {
          await authService.login(
            convertKeycloakUserToModel(profile),
            keycloak.token || ''
          )
          history.push({ pathname: '/' })
        }).catch(function() {
        alert('Failed to load user profile');
      });
    }
  }, [keycloak, keycloak.authenticated])

  const isAuthenticated = !isUndefined(user)
  const isAccountActivated = user?.isAccountActivated || false
  console.log("auth.router.tsx, isAuthenticated: " + isAuthenticated)
  console.log("auth.router.tsx, user: " + user)
  return (
    <Switch>
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
