import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { CreateUpdatePage } from './pages/[create-update].page'

export const VideoRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route
        path={`${url}/:slug?/(create|update)`}
        component={CreateUpdatePage}
      />
    </Switch>
  )
}
