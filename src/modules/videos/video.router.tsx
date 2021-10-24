import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { CreateUpdatePage } from './pages/[create-update].page'
import { SlugPage } from './pages/[slug].page'

export const VideoRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route
        path={`${url}/:slug?/(create|update)`}
        component={CreateUpdatePage}
      />
      <Route exact path={`${url}/:slug`} component={SlugPage} />
    </Switch>
  )
}
