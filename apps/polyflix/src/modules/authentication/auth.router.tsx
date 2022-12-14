import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { PrivateRoute } from '@auth/components/PrivateRoute/PrivateRoute.component'

import { RedirectPage } from './pages/Redirect.page'
import { environment } from '@env/environment'
import { MockAuthenticationPage } from './pages/Mock.page'

interface Props {
  isAuthenticated: boolean
}

export const AuthRouter = ({ isAuthenticated }: Props) => {
  const { url } = useRouteMatch()

  if (!isAuthenticated && environment.mocked) {
    return <MockAuthenticationPage />
  }

  return (
    <Switch>
      <Route exact path={`${url}/redirect`} component={RedirectPage} />
      <PrivateRoute condition={!isAuthenticated} redirectTo={'/'}>
        <Route exact path={`${url}/login`} component={RedirectPage} />
      </PrivateRoute>
    </Switch>
  )
}
