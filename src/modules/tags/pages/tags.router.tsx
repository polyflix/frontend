import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { TagSearchPage } from "./tag-search.page";

export const TagsRouter: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/:tags`} component={TagSearchPage} />
    </Switch>
  );
};
