import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { AdminRolePage } from './pages/roles/index.page'
import { AdminUserPage } from './pages/users/index.page'

export const AdminRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route path={`${url}/roles`} component={AdminRolePage} />
      <Route path={`${url}/users`} component={AdminUserPage} />
    </Switch>
  )
}
