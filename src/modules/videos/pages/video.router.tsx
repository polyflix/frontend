import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { NewVideoPage } from "./new-video.page";
import { CreateUpdateVideoPage } from "./[create-update].page";
import { VideoDetail } from "./[slug].page";

export const VideoRouter: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/new`} component={NewVideoPage} />
      <Route
        exact
        path={`${path}/(create|update)/:slug?`}
        component={CreateUpdateVideoPage}
      />
      <Route path={`${path}/:slug`} component={VideoDetail} />
    </Switch>
  );
};
