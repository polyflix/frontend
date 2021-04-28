import { Route, Switch, useRouteMatch } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute.component";
import { useAuth } from "../../hooks/useAuth.hook";
import NotFoundPage from "../404.page";
import CreateUpdateVideoPage from "./[create|update].page";
import VideoDetail from "./[slug].page";

const VideoRouter = () => {
  const { isAuthenticated } = useAuth();
  const { path } = useRouteMatch();

  return (
    <Switch>
      <ProtectedRoute
        hasAccessIf={isAuthenticated}
        exact
        path={`${path}/(create|update)/:slug?`}
        component={CreateUpdateVideoPage}
      />
      <Route path={`${path}/:slug`} component={VideoDetail} />
      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
};

export default VideoRouter;
