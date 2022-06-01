import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { AdminUserPage } from './pages/users/index.page'

export const AdminRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route path={`${url}/users`} component={AdminUserPage} />
    </Switch>
  )
}
