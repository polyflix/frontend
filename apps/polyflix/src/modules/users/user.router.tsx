import {
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom'

import { NotFoundPage } from '@core/pages/404.page'
import { NotImplementedPage } from '@core/pages/NotImplemented.page'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { ProfileCoursesPage } from '@users/pages/ProfileCourses/ProfileCourses.page'

import { ProfilePage } from './pages/Profile/Profile.page'
import { ProfileAttachmentsPage } from './pages/ProfileAttachments/ProfileAttachments.page'
import { ProfileCertificationsPage } from './pages/ProfileCertifications/ProfileCertifications.page'
import { ProfileCollectionsPage } from './pages/ProfileCollections/ProfileCollections.page'
import { ProfileQuizzesPage } from './pages/ProfileQuizzes/ProfileQuizzes.page'
import { ProfileVideosPage } from './pages/ProfileVideos/ProfileVideos.page'
import { EditProfilePage } from './pages/UpdateProfile/UpdateProfile.page'
import { useGetUserQuery } from './services/user.service'
import { ProfileRecommendationsPage } from './pages/ProfileRecommendations/ProfileRecommendations.page'

const ProfileRouter = () => {
  let { url } = useRouteMatch()
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const { user: me } = useAuth()
  const { data } = useGetUserQuery(id || me?.id!)
  if (me?.id === id) history.push('/users/profile/videos')

  return (
    <ProfilePage>
      <Switch>
        <Route exact path={`${url}`} component={NotImplementedPage} />
        <Route
          exact
          path={`${url}/videos`}
          component={() => <ProfileVideosPage user={data} />}
        />
        <Route
          exact
          path={`${url}/modules`}
          component={() => <ProfileCollectionsPage user={data} />}
        />
        <Route
          exact
          path={`${url}/courses`}
          component={() => <ProfileCoursesPage user={data} />}
        />
        <Route
          exact
          path={`${url}/quizzes`}
          component={() => <ProfileQuizzesPage user={data} />}
        />
        <Route
          exact
          path={`${url}/certifications`}
          component={ProfileCertificationsPage}
        />
        <Route
          exact
          path={`${url}/attachments/:mode?/:attachmentId?`}
          component={ProfileAttachmentsPage}
        />
        <Route
          exact
          path={`${url}/recommendations`}
          component={() => <ProfileRecommendationsPage user={data} />}
        />
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
