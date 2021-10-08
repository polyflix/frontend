import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { CreateUpdateVideoPage } from './[create-update].page'
import { VideoDetail } from './[slug].page'
import { StatsPage } from './[slug]/stats.page'
import { NewVideoPage } from './new-video.page'

export const VideoRouter: React.FC = () => {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={`${path}/new`} component={NewVideoPage} />
      <Route
        exact
        path={`${path}/(create|update)/:slug?`}
        component={CreateUpdateVideoPage}
      />
      <Route path={`${path}/:slug/statistics`} component={StatsPage} />
      <Route path={`${path}`} component={VideoDetail} />
    </Switch>
  )
}
