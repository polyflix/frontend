import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { QuizzesPage } from "./index.page";
import { PlayQuizzPage } from "./play.page";
import { QuizzResultsPage } from "./results.page";
import { CreateUpdateQuizzPage } from "./[create-update].page";

export const QuizzesRouter: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route
        exact
        path={`${path}/:id?/(new|update)`}
        component={CreateUpdateQuizzPage}
      />
      <Route exact path={`${path}/:id/play`} component={PlayQuizzPage} />
      <Route exact path={`${path}/:id/results`} component={QuizzResultsPage} />
      <Route exact path={path} component={QuizzesPage} />
    </Switch>
  );
};
