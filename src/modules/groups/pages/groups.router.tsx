import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { CreateUpdateGroupPage } from "./[create-update].page";
import { GroupsPage } from "./groups.page";

export const GroupsRouter: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route
        exact
        path={`${path}/(create|update)/:slug?`}
        component={CreateUpdateGroupPage}
      />
      <Route exact path={path} component={GroupsPage} />
    </Switch>
  );
};
