import { ExploreCursusPage } from '@cursus/pages/Explore.page'
import { CreateUpdateCursusPage } from '@cursus/pages/[create-update].page'
import { CursusSlugPage } from '@cursus/pages/[slug].page'
import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

export const CursusRouter: React.FC = () => {
  const { url } = useRouteMatch()
  return (
    <Switch>
      <Route exact path={`${url}/explore`} component={ExploreCursusPage} />
      <Route
        path={`${url}/:slug?/(create|update)`}
        component={CreateUpdateCursusPage}
      />
      <Route path={`${url}/:slug`} component={CursusSlugPage} />
    </Switch>
  )
}
