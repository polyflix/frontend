import { Route, Switch, useRouteMatch } from "react-router-dom";
import { ProfilePage } from "./index.page";
import { UserVideosPage } from "./videos/index.page";

export const ProfileRouter = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={ProfilePage} />
      <Route path={`${path}/videos/:id`} component={UserVideosPage} />
    </Switch>
  );
};
