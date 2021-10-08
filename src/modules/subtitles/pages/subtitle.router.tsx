import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import { CollaborativeSubtitleEditingPage } from './collaborative-subtitle-editing.page'

export const SubtitleRouter: React.FC = () => {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route
        exact
        path={`${path}/:slug`}
        component={CollaborativeSubtitleEditingPage}
      />
    </Switch>
  )
}
