import { Route, Switch, useRouteMatch } from "react-router-dom";
import ProfilePage from "./index.page";
import UserVideosPage from "./videos/index.page";

const ProfileRouter = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={ProfilePage} />
      <Route exact path={`${path}/videos`} component={UserVideosPage} />
    </Switch>
  );
};

export default ProfileRouter;
