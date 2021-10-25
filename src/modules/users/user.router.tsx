import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { ProfilePage } from './pages/Profile.page'
import { EditProfilePage } from './pages/Update-profile.page'

/**
 * This is the Authentication module router. It handles every routes behind /auth.
 */
export const UserRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={`${url}/:id?/profile`} component={ProfilePage} />
      <Route
        exact
        path={`${url}/:id?/profile/settings`}
        component={EditProfilePage}
      />
    </Switch>
  )
}
