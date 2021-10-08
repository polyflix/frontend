import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { CreateUpdateCollectionPage } from './[create-update].page'
import { CollectionsPage } from './index.page'

export const CollectionRouter: React.FC = () => {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route
        exact
        path={`${path}/(create|update)/:slug?`}
        component={CreateUpdateCollectionPage}
      />
      <Route path={`${path}`} exact component={CollectionsPage} />
    </Switch>
  )
}
