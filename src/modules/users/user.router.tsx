import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { NotFoundPage } from '@core/pages/404.page'
import { NotImplementedPage } from '@core/pages/NotImplemented.page'

import { ProfileCoursesPage } from '@users/pages/ProfileCourses/ProfileCourses.page'

import { ProfilePage } from './pages/Profile/Profile.page'
import { ProfileCollectionsPage } from './pages/ProfileCollections/ProfileCollections.page'
import { ProfileGroupsPage } from './pages/ProfileGroups/ProfileGroups.page'
import { ProfileLinksPage } from './pages/ProfileLinks/ProfileLinks.page'
import { ProfileQuizzesPage } from './pages/ProfileQuizzes/ProfileQuizzes.page'
import { ProfileVideosPage } from './pages/ProfileVideos/ProfileVideos.page'
import { EditProfilePage } from './pages/UpdateProfile/UpdateProfile.page'

const ProfileRouter = () => {
  const { url } = useRouteMatch()

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
        <Route exact path={`${url}/courses`} component={ProfileCoursesPage} />
        <Route exact path={`${url}/groups`} component={ProfileGroupsPage} />
        <Route exact path={`${url}/quizzes`} component={ProfileQuizzesPage} />
        <Route exact path={`${url}/links`} component={ProfileLinksPage} />
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
