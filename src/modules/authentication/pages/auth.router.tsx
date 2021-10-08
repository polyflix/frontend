import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import LoginPage from './login.page'
import RegisterPage from './register.page'
import ResetPasswordPage from './resetPassword.page'
import ValidatePage from './validate.page'

export const AuthRouter: React.FC = () => {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={`${path}/login`} component={LoginPage} />
      <Route exact path={`${path}/register`} component={RegisterPage} />
      <Route exact path={`${path}/validate`} component={ValidatePage} />
      <Route
        exact
        path={`${path}/forgotten-password`}
        component={ResetPasswordPage}
      />
    </Switch>
  )
}
