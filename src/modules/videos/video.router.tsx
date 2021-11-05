import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { PlayerProvider } from './contexts/Player.context'
import { SubtitleProvider } from './contexts/Subtitles.context'
import { ExploreVideosPage } from './pages/Explore.page'
import { CreateUpdatePage } from './pages/[create-update].page'
import { SlugPage } from './pages/[slug].page'

export const VideoRouter = () => {
  const { url } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={`${url}/explore`} component={ExploreVideosPage} />
      <Route
        path={`${url}/:slug?/(create|update)`}
        component={CreateUpdatePage}
      />
      <Route exact path={`${url}/:slug`}>
        <SubtitleProvider>
          <PlayerProvider>
            <SlugPage />
          </PlayerProvider>
        </SubtitleProvider>
      </Route>
    </Switch>
  )
}
