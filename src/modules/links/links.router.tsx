import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { CreateUpdatePage } from '@links/pages/[create-update].page'

export const LinkRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route
        path={`${url}/:id?/(create|update)`}
        component={CreateUpdatePage}
      />
    </Switch>
  )
}
