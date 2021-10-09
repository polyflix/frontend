import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { CoursesPage } from "./index.page";
import { CreateUpdateCoursePage } from "./[create-update].page";
import { CourseDetail } from "./[slug].page";

export const CourseRouter: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route
        exact
        path={`${path}/(create|update)/:slug?`}
        component={CreateUpdateCoursePage}
      />
      <Route path={`${path}/:slug`} component={CourseDetail} />
      <Route path={`${path}`} component={CoursesPage} />
    </Switch>
  );
};
