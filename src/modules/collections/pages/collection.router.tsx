import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { CreateUpdateCollectionPage } from "./[create-update].page";
// import { VideoDetail } from "./[slug].page";

export const CollectionRouter: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route
        exact
        path={`${path}/(create|update)/:slug?`}
        component={CreateUpdateCollectionPage}
      />
      {/* <Route path={`${path}/:slug`} component={VideoDetail} /> */}
    </Switch>
  );
};
