import { Route, useRouteMatch, Switch } from 'react-router-dom'

import { CreateUpdateCollectionPage } from './pages/CreateUpdate/CreateUpdateCollection.page'
import { ExploreCollectionPage } from './pages/ExploreCollection/ExploreCollection.page'
import { CollectionSlugPage } from './pages/Slug/[slug].page'

export const CollectionRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={`${url}/explore`} component={ExploreCollectionPage} />
      <Route
        path={`${url}/:slug?/(create|update)`}
        component={CreateUpdateCollectionPage}
      />
      <Route exact path={`${url}/:slug`} component={CollectionSlugPage} />
    </Switch>
  )
}
