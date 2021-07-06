import { Route, Switch, useRouteMatch } from "react-router-dom";
import { ProfilePage } from "./index.page";
import { UserVideosPage } from "./videos/index.page";
import { UserCollectionsPage } from "./collections/index.page";
import { UserVideosHistoryPage } from "./videos/history.page";
import { UserCoursesPage } from "./courses/index.page";

export const ProfileRouter = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={ProfilePage} />
      <Route
        path={`${path}/videos/history`}
        component={UserVideosHistoryPage}
      />
      <Route path={`${path}/videos/:id`} component={UserVideosPage} />
      <Route path={`${path}/courses/:id`} component={UserCoursesPage} />
      <Route path={`${path}/collections/:id`} component={UserCollectionsPage} />
    </Switch>
  );
};
