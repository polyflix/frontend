import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { ExploreCoursesPage } from '@courses/pages/Explore.page'
import { CreateUpdateCoursePage } from '@courses/pages/[create-update].page'
import { CourseSlugPage } from '@courses/pages/[slug].page'

export const CourseRouter: React.FC = () => {
  const { url } = useRouteMatch()
  return (
    <Switch>
      <Route exact path={`${url}/explore`} component={ExploreCoursesPage} />
      <Route
        path={`${url}/:slug?/(create|update)`}
        component={CreateUpdateCoursePage}
      />
      <Route path={`${url}/:slug`} component={CourseSlugPage} />
    </Switch>
  )
}
