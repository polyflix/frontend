import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { AdminPage } from './admin.page'
import { AdminCollectionPage } from './collections/collections.page'
import { AdminCoursePage } from './courses/courses.page'
import { AdminPathPage } from './paths/paths.page'
import { AdminTagsPage } from './tags/tags.page'
import { AdminUserPage } from './users/users.page'
import { AdminVideoPage } from './videos/videos.page'

export const AdminRouter: React.FC = () => {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route
        exact
        path={path + '/collections'}
        component={AdminCollectionPage}
      />
      <Route exact path={path + '/courses'} component={AdminCoursePage} />
      <Route exact path={path + '/paths'} component={AdminPathPage} />
      <Route exact path={path + '/users'} component={AdminUserPage} />
      <Route exact path={path + '/videos'} component={AdminVideoPage} />
      <Route exact path={`${path}/tags`} component={AdminTagsPage} />
      <Route exact path={path} component={AdminPage} />
    </Switch>
  )
}
