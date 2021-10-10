import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { LoginPage } from './pages/Login.page'
import { RegisterPage } from './pages/Register.page'
import { ResetPasswordPage } from './pages/ResetPassword.page'
import { ValidatePage } from './pages/Validate.page'

/**
 * This is the Authentication module router. It handles every routes behind /auth.
 */
export const AuthRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route path={`${url}/login`} component={LoginPage} />
      <Route path={`${url}/register`} component={RegisterPage} />
      <Route path={`${url}/forgotten-password`} component={ResetPasswordPage} />
      <Route path={`${url}/validate`} component={ValidatePage} />
    </Switch>
  )
}
