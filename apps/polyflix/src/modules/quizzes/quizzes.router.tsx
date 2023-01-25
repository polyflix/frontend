import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { PlayQuizzProvider } from './contexts/Play.context'
import { ExploreQuizzesPage } from './pages/Explore.page'
import { QuizzesHistoryPage } from './pages/History.page'
import { PlayQuizzPage } from './pages/Play.page'
import { QuizzResultsPage } from './pages/Results.page'

export const QuizzRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route path={`${url}/:id/play`}>
        <PlayQuizzProvider>
          <PlayQuizzPage />
        </PlayQuizzProvider>
      </Route>
      <Route path={`${url}/:id/results`} component={QuizzResultsPage} />

      <Route path={`${url}/explore`} component={ExploreQuizzesPage} />
      <Route path={`${url}/history`} component={QuizzesHistoryPage} />
    </Switch>
  )
}
