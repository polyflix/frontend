import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { CoursesPage } from "./index.page";
import { CourseDetail } from "./[slug].page";

export const CourseRouter: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/:slug`} component={CourseDetail} />
      <Route path={`${path}`} component={CoursesPage} />
    </Switch>
  );
};
