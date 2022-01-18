import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { VideoHistoryPage } from '@videos/pages/History.page'

import { SubtitleProvider } from './contexts/Subtitles.context'
import { ExploreVideosPage } from './pages/Explore.page'
import { CreateUpdatePage } from './pages/[create-update].page'
import { SlugPage } from './pages/[slug].page'

export const VideoRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={`${url}/explore`} component={ExploreVideosPage} />
      <Route path={`${url}/history`} component={VideoHistoryPage} />
      <Route
        path={`${url}/:slug?/(create|update)`}
        component={CreateUpdatePage}
      />
      <Route exact path={`${url}/:slug?`}>
        <SubtitleProvider>
          <SlugPage />
        </SubtitleProvider>
      </Route>
    </Switch>
  )
}
