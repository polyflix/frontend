import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { AdminFromGroupPage } from './pages/groups/form/form.page'
import { AdminGroupPage } from './pages/groups/list/list.page'
import { AdminViewGroupPage } from './pages/groups/view/view.page'
import { AdminUserPage } from './pages/users/index.page'
import { AdminVideoPage } from './pages/videos/index.page'

export const AdminRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route path={`${url}/users`} component={AdminUserPage} />
      <Route exact path={`${url}/groups`} component={AdminGroupPage} />
      <Route
        path={`${url}/groups/(create|update)/:slug?`}
        component={AdminFromGroupPage}
      />
      <Route path={`${url}/groups/:slug?`} component={AdminViewGroupPage} />
      <Route path={`${url}/videos`} component={AdminVideoPage} />
    </Switch>
  )
}
