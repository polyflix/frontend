import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { PlayQuizzProvider } from './contexts/Play.context'
import { ExploreQuizzesPage } from './pages/Explore.page'
import { PlayQuizzPage } from './pages/Play.page'
import { CreateUpdateQuizzPage } from './pages/[create-update].page'

export const QuizzRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route path={`${url}/:id/play`}>
        <PlayQuizzProvider>
          <PlayQuizzPage />
        </PlayQuizzProvider>
      </Route>
      <Route
        path={`${url}/:id?/(create|update)`}
        component={CreateUpdateQuizzPage}
      />
      <Route path={`${url}/explore`} component={ExploreQuizzesPage} />
    </Switch>
  )
}
