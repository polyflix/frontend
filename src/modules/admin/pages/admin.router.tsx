import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { AdminPage } from "./admin.page";
import { AdminTagsPage } from "./tags/tags.page";

export const AdminRouter: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/tags`} component={AdminTagsPage} />
      <Route exact path={path} component={AdminPage} />
    </Switch>
  );
};
