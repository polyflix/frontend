import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { PrivateRoute } from '@auth/components/PrivateRoute/PrivateRoute.component'

import { RedirectPage } from './pages/Redirect.page'
import { environment } from '@env/environment'
import { MockAuthenticationPage } from './pages/Mock.page'

interface Props {
  isAuthenticated: boolean
  redirectUrl: string
}

export const AuthRouter = ({
  isAuthenticated,
  redirectUrl: redirectUri,
}: Props) => {
  const { url } = useRouteMatch()

  // If we are in a mocked environment, we don't want to redirect to keycloak
  if (!isAuthenticated && environment.mocked) {
    return <MockAuthenticationPage redirectUri={redirectUri} />
  }

  return (
    <Switch>
      <Route
        exact
        path={`${url}/redirect`}
        render={() => <RedirectPage redirectUri={redirectUri} />}
      />
      <PrivateRoute condition={!isAuthenticated} redirectTo={'/'}>
        <Route
          exact
          path={`${url}/login`}
          render={() => <RedirectPage redirectUri={redirectUri} />}
        />
      </PrivateRoute>
    </Switch>
  )
}
