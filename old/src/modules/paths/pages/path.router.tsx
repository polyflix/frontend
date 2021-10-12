import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { PathsPage } from "./index.page";
import { CreateUpdatePathPage } from "./[create-update].page";
import { PathDetail } from "./[slug].page";

export const PathRouter: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route
        exact
        path={`${path}/(create|update)/:slug?`}
        component={CreateUpdatePathPage}
      />
      <Route path={`${path}/:slug`} component={PathDetail} />
      <Route path={`${path}`} component={PathsPage} />
    </Switch>
  );
};