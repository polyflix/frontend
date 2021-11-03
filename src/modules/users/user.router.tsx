import { useEffect } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { NotFoundPage } from '@core/pages/404.page'
import { NotImplementedPage } from '@core/pages/NotImplemented.page'

import { ProfilePage } from './pages/Profile/Profile.page'
import { ProfileCollectionsPage } from './pages/ProfileCollections/ProfileCollections.page'
import { ProfileGroupsPage } from './pages/ProfileGroups/ProfileGroups.page'
import { ProfileQuizzesPage } from './pages/ProfileQuizzes/ProfileQuizzes.page'
import { ProfileVideosPage } from './pages/ProfileVideos/ProfileVideos.page'
import { EditProfilePage } from './pages/UpdateProfile/UpdateProfile.page'

const ProfileRouter = () => {
  const { url } = useRouteMatch()

  useEffect(() => console.log('url', url), [url])

  return (
    <ProfilePage>
      <Switch>
        <Route exact path={`${url}`} component={NotImplementedPage} />
        <Route exact path={`${url}/videos`} component={ProfileVideosPage} />
        <Route
          exact
          path={`${url}/collections`}
          component={ProfileCollectionsPage}
        />
        <Route exact path={`${url}/groups`} component={ProfileGroupsPage} />
        <Route exact path={`${url}/quizzes`} component={ProfileQuizzesPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </ProfilePage>
  )
}
/**
 * This is the Authentication module router. It handles every routes behind /auth.
 */
export const UserRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route
        exact
        path={`${url}/:id?/profile/settings`}
        component={EditProfilePage}
      />
      <Route path={`${url}/:id?/profile`} component={ProfileRouter} />
    </Switch>
  )
}
