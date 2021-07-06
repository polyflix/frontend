import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { CollectionsPage } from "./index.page";
import { CreateUpdateCollectionPage } from "./[create-update].page";

export const CollectionRouter: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route
        exact
        path={`${path}/(create|update)/:slug?`}
        component={CreateUpdateCollectionPage}
      />
      <Route path={`${path}`} exact component={CollectionsPage} />
    </Switch>
  );
};
